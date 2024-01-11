<?php
namespace Troya\SmartActions\Controller;

use Bitrix\Main\Loader,
    Bitrix\Main\Context,
    Bitrix\Main\Application,
    Bitrix\Crm\Service\Container;

class Dynamic extends \Bitrix\Main\Engine\Controller{

    public static function getFieldsInfoAction($entity_type){

        if(!Loader::IncludeModule('crm'))
            [];

        if(intval($entity_type) != $entity_type){
            $entity_type = \CCrmOwnerType::ResolveID($entity_type);
        }

        $factory = Container::getInstance()->getFactory($entity_type);

        return array_merge($factory->getFieldsInfo(), $factory->getUserFieldsInfo());

    }

    public static function copyEntityAction($entity_type, $entity_id, $cloneFields = []){

        if(!Loader::IncludeModule('crm'))
            [];


        if(intval($entity_type) != $entity_type){
            $entity_type = \CCrmOwnerType::ResolveID($entity_type);
        }

        $factory = Container::getInstance()->getFactory($entity_type);
        $fields = array_merge($factory->getFieldsInfo(), $factory->getUserFieldsInfo());

        global $USER;
        $context = new \Bitrix\Crm\Service\Context();
        $context->setUserId($USER->getId());

        $itemToClone = $factory->getItem($entity_id);
        $itemToCloneData = $itemToClone->getCompatibleData();

        unset($itemToCloneData['MOVED_TIME']);

        $fileFields = array_filter($fields, fn($v) => $v['TYPE'] == 'file');
        if(count($fileFields)>0){

            $fileIds = [];
            foreach ($fileFields as $fieldCode => $field){

                if($itemToCloneData[$fieldCode] && array_search('MUL', $field['ATTRIBUTES']))
                    $fileIds = array_merge($fileIds, $itemToCloneData[$fieldCode]);

                else if($itemToCloneData[$fieldCode])
                    $fileIds[] = $itemToCloneData[$fieldCode];

            }

            if(count($fileIds)>0){
                $filePaths = self::getFilePathsByIdAction($fileIds);
                foreach ($fileFields as $fieldCode => $field){

                    if($itemToCloneData[$fieldCode] && array_search('MUL', $field['ATTRIBUTES']))
                        $itemToCloneData[$fieldCode] = array_map(function($v) use ($filePaths){
                            return \CFile::MakeFileArray($filePaths[$v]);
                        }, $itemToCloneData[$fieldCode]);

                    else if($itemToCloneData[$fieldCode])
                        $itemToCloneData[$fieldCode] = \CFile::MakeFileArray($filePaths[$itemToCloneData[$fieldCode]]);

                }
            }
        }

        foreach ($cloneFields as $cloneField){

            $entityCode = current(array_keys(array_filter($fields[$cloneField]['SETTINGS'], fn($v) => $v == 'Y')));

            if($itemToCloneData[$cloneField] && array_search('MUL', $fields[$cloneField]['ATTRIBUTES']))
                $itemToCloneData[$cloneField] = array_map(function($entityId) use ($entityCode){
                    return self::copyEntityAction($entityCode, $entityId, [])['id'];
                }, $itemToCloneData[$cloneField]);

            else if($itemToCloneData[$cloneField])
                $itemToCloneData[$cloneField] = self::copyEntityAction($entityCode, $itemToCloneData[$cloneField], [])['id'];

        }

        $createdItem = $factory->createItem();
        $createdItem->setFromCompatibleData($itemToCloneData);
        $createdItem->save();
        $saveOperation = $factory->getAddOperation($createdItem, $context);
        $operationResult = $saveOperation->launch();

        return [
            'id' => $createdItem->getId(),
        ];
    }

    public static function getFilePathsByIdAction(array $fileIds){

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

        return $filePaths;

    }

}