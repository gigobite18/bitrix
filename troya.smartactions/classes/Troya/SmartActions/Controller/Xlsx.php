<?php
namespace Troya\SmartActions\Controller;

use Bitrix\Main\Loader,
    Bitrix\Main\Context,
    Bitrix\Main\Application,
    Bitrix\Crm\Service\Container,
    PhpOffice\PhpSpreadsheet\Spreadsheet,
    PhpOffice\PhpSpreadsheet\Writer\Xlsx as Xlsxs,
    PhpOffice\PhpSpreadsheet\IOFactory;

class Xlsx extends \Bitrix\Main\Engine\Controller{

    public static function importSmartElementsAction(){

        if(!Loader::IncludeModule('crm'))
            return;

        $request = Application::getInstance()->getContext()->getRequest();
        $data = $request->getPostList()->toArray();
        $files = $request->getFileList()->toArray();

        $smart = $data['SMART'];
        $file = $files['FILE'];

        $factory = Container::getInstance()->getFactory($smart);
        $fields = array_merge($factory->getFieldsInfo(), $factory->getUserFieldsInfo());

        $excelData = self::readExcelAction($file['tmp_name']);
        $parsedData = self::parseExcelDataAction($excelData);

        if(count(array_intersect_key(current($parsedData), $fields) ) != count(current($parsedData)))
            return [
                'error' => 'В файле используются поля, которых нет в импортируемой сущности'
            ];


        $fileFields = array_filter($fields, fn($v) => $v['TYPE'] == 'file');
        $multipleFields = array_filter($fields, function($v) {
            if(is_array($v['ATTRIBUTES']))
                return $v['ATTRIBUTES']['1'] == 'MUL';
            else
                return false;
        });


        global $USER;
        $context = new \Bitrix\Crm\Service\Context();
        $context->setUserId($USER->getId());

        $importedCount = 0;

        foreach ($parsedData as $key => $dataToStore){

            foreach ($multipleFields as $fieldCode => $desc)
                if(is_string($dataToStore[$fieldCode]))
                    $dataToStore[$fieldCode] = explode(';', $dataToStore[$fieldCode]);

            foreach ($fileFields as $fieldCode => $desc)
                $dataToStore[$fieldCode] = self::tryParseFilePath($dataToStore[$fieldCode]);


            $item = $factory->createItem();
            $item->setFromCompatibleData($dataToStore);
            $item->save();
            $saveOperation = $factory->getAddOperation($item, $context);
            $operationResult = $saveOperation->launch();

           if( $item->getId()>0) $importedCount++;

        }


        return [
            'count' => count($parsedData),
            'imported_count' => $importedCount,
        ];
    }

    public static function exportSmartElementsAction($SMART, $filter=[], $FIELDS=[]){

        if(!Loader::IncludeModule('crm'))
            return;

        $factory = Container::getInstance()->getFactory($SMART);

        $fields = array_merge($factory->getFieldsInfo(), $factory->getUserFieldsInfo());

        if(count($FIELDS) == 0)
            $FIELDS = array_keys($fields);

        $fileFields = array_filter($fields, fn($desc) => $desc['TYPE'] == 'file');

        if($fileFields) $fileFields = array_keys($fileFields);


        $itemsData = [

            array_map(function($code) use($fields) {
                return $fields[$code]['TITLE'];
            }, $FIELDS),

            $FIELDS,
        ];

        $fileIds = [];

        foreach ($factory->getItems(['filter' => $filter]) as $item){

            $compitable = $item->getCompatibleData();

            foreach ($FIELDS as $fieldCode){
                $itemData[$fieldCode] = $compitable[$fieldCode];
            }

            if(count($fileFields)>0){

                foreach ($fileFields as $fieldCode){

                    if(is_array($itemData[$fieldCode]))
                        $fileIds = array_merge($fileIds, $itemData[$fieldCode]);

                    else if(!empty($itemData[$fieldCode]))
                        $fileIds[] = $itemData[$fieldCode];

                }

            }

            $itemsData[] = $itemData;
        }

        if(count($fileIds) > 0){

            $filePaths = [];

            $filesRS = \Bitrix\Main\FileTable::getList([
                'filter' => ['ID' => $fileIds],
                'select' => ['PATH', 'ID'],
                'runtime' => [
                    new \Bitrix\Main\Entity\ExpressionField(
                        'PATH',
                        'CONCAT("/upload/", %s, "/", %s)',
                        ['SUBDIR', 'ORIGINAL_NAME']
                    )
                ]
            ]);
            while($file = $filesRS->fetch())

                $filePaths[$file['ID']] = $file['PATH'];


            foreach ($itemsData as $key => $item){

                foreach ($fileFields as $fieldCode){

                    if(is_array($item[$fieldCode]))
                        $itemsData[$key][$fieldCode] = array_map(function($fileId) use($filePaths){
                            return $filePaths[$fileId];
                        }, $item[$fieldCode]);

                    else if(!empty($item[$fieldCode]))
                        $itemsData[$key][$fieldCode] = $filePaths[$item[$fieldCode]];

                }

            }
        }

        return self::exportAction($itemsData);
    }

    public static function exportAction($data){

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $row = 1;

        foreach ($data as $rowData) {
            $col = 1;

            foreach ($rowData as $cellData) {
                if (is_array($cellData)) {
                    $sheet->setCellValueByColumnAndRow($col, $row, implode(';', $cellData));
                    $col++;
                } else {
                    $sheet->setCellValueByColumnAndRow($col, $row, $cellData);
                    $col++;
                }
            }
            $row++;
        }

        $writer = new Xlsxs($spreadsheet);

        global $USER;

        $fileName = $USER->getId().'excel.xlsx';
        $filePath = dirname(dirname(dirname(dirname(__DIR__)))).'/trash/'.$fileName;

        unlink($filePath);
        $writer->save($filePath);

        return [
            'file' =>  str_replace($_SERVER['DOCUMENT_ROOT'], '', $filePath),
        ];
    }

    public static function readExcelAction($path){
        $spreadsheet = IOFactory::load($path);


        $sheet = $spreadsheet->getActiveSheet();


        $highestRow = $sheet->getHighestRow();
        $highestColumn = $sheet->getHighestColumn();


        $data = [];
        for ($row = 1; $row <= $highestRow; ++$row) {
            $rowData = [];
            for ($col = 'A'; $col <= $highestColumn; ++$col) {
                $cellValue = $sheet->getCell($col . $row)->getValue();
                $rowData[] = $cellValue;
            }
            $data[] = $rowData;
        }

        return $data;
    }

    public static function parseExcelDataAction($data){
        $parsedData = [];

        if(!is_array($data))
            return $parsedData;

        $header = $data[1];
        unset($data[0], $data[1]);

        foreach ($data as $row){
            $parsedData[] = array_combine($header, $row);
        }

        return $parsedData;
    }
    

    public static function tryParseFilePath($paths){

        $is_multiple = is_array($paths);

        if(!$is_multiple)
            $paths = [$paths];

        foreach ($paths as $key => $path){

            if(!file_exists($path))
                if(file_exists($_SERVER['DOCUMENT_ROOT'].$path))
                    $paths[$key] = $_SERVER['DOCUMENT_ROOT'].$path;

            $paths[$key] = \CFile::MakeFileArray($paths[$key]);

        }

        return $is_multiple? $paths : current($paths);
    }
}