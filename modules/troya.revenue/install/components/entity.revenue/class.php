<?
if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();

use Bitrix\Main\Engine\Contract\Controllerable,
    Bitrix\Main\Application,
    Bitrix\Main\Context,
    Bitrix\Main\Loader,
    Bitrix\Crm\Service,
    Bitrix\Main\Config\Option,
    Bitrix\Crm\Category\DealCategory,
    Troya\Revenue\Orm\RevenueTable;

class EntityRenevue extends  \CBitrixComponent implements Controllerable{

    public function configureActions(){}

    function onPrepareComponentParams($arParams){
        global $USER;

        $arParams['IS_ADMIN'] = $USER->isAdmin();

        if(!$arParams['ENTITY_TYPE_ID']){
            $arParams['ENTITY_TYPE_ID'] = 2;
            $arParams['ENTITY_ID'] = 88;
        }

        CJSCore::init(['ui.notification', 'ui.entity-selector', 'ui.alerts']);

        return $arParams;
    }

    public static function loadDataAction($save=[], $remove=[]){

        if(!Loader::IncludeModule('troya.revenue'))
            return;

        foreach ($save as $saveAr){
            $id = $saveAr['ID'];
            unset($saveAr['ID']);

            if(intval($id))
                RevenueTable::update($id, $saveAr);
            else
                RevenueTable::add($saveAr);

        }

        foreach ($remove as $id){
            RevenueTable::delete($id);
        }


        return true;
    }

    public static function loadSettingAction($name, $value){
        Option::set('troya.revenue', $name, $value);
    }

    function getMonthQuarter($month){
        return intval(($month+2)/3);
    }

    private function defineEntityRevenue(){

        $quartes=[
            date('Y').'.'.$this->getMonthQuarter(date('m')),
            (date('Y')+1).'.'.$this->getMonthQuarter(date('m'))
        ];

        $revenuesTableRS = RevenueTable::getList([
            'select' => [
                '*',
                'PRODUCT_NAME' => 'PRODUCT_TABLE.NAME'
            ],
            'filter' => [
                'ENTITY_TYPE_ID' => $this->arParams['ENTITY_TYPE_ID'],
                'ENTITY_ID' => $this->arParams['ENTITY_ID'],
                'PRODUCT_TABLE.IBLOCK_ID' => 14,
            ],
            'runtime' => [
                'PRODUCT_TABLE' => [
                    'data_type' => '\Bitrix\Iblock\ElementTable',
                    'reference' => ['this.PRODUCT_ID' => 'ref.ID'],
                ]
            ]
        ]);

        while($revenue = $revenuesTableRS->fetch()){
            $this->arResult['REVENUES'][$revenue['ID']] = $revenue;

            $quartes = array_unique(array_merge($quartes, array_keys($revenue['QUARTER_PRICES'])));
        }

        sort($quartes, SORT_NUMERIC);

        $this->arResult['min'] = $quartes[0];
        $this->arResult['max'] = $quartes[count($quartes)-1];
    }

    private function defineCategoryStages(){
        $this->arResult['CATEGORY_STAGES'] = [];

        $categories = array_merge([['ID' => 0, 'NAME' => 'Общий']], DealCategory::getAll());
        foreach ($categories as $category){
            $this->arResult['CATEGORY_STAGES'][$category['ID']] = [
                'STAGES' => array_merge(['' => 'Не проверять'], DealCategory::getStageList($category['ID'])),
                'CATEGORY_ID' => $category['ID'],
                'CATEGORY_NAME' => $category['NAME'],
            ];
        }

        $this->arResult['CATEGORY_SETTINGS'] = Option::getForModule('troya.revenue');
    }

    public function executeComponent() {
        if(!Loader::IncludeModule('iblock') || !Loader::IncludeModule('troya.revenue'))
            return;

        $this->defineEntityRevenue();

        if($this->arParams['IS_ADMIN'])
            $this->defineCategoryStages();

        $this->includeComponentTemplate();
    }
}

function dump($s=''){
    print_r('<pre>');
    print_r($s);
    print_r('</pre>');
}