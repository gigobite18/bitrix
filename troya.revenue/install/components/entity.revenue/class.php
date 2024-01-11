<?
if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();

use Bitrix\Main\Engine\Contract\Controllerable,
    Bitrix\Main\Application,
    Bitrix\Main\Context,
    Bitrix\Main\Loader,
    Bitrix\Crm\Service,
    Bitrix\Main\Config\Option,
    Bitrix\Crm\Category\DealCategory,
    Troya\Revenue\Orm\RevenueTable,
    Bitrix\Crm\Service\Container,
    CCrmPerms,
    CCrmDeal,
    Troya\Revenue\Initializer;

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

    public static function loadDataAction($entityTypeId, $entityId, $save=[], $remove=[]){

        if(!Loader::IncludeModule('troya.revenue'))
            return;

        $component = new self();
        $component->arParams = [
            'ENTITY_ID' => $entityId,
            'ENTITY_TYPE_ID' => $entityTypeId,
        ];
        $component->executeComponent();

        if(count($save) == 0 && (count($component->arResult['REVENUES']) - count($remove)) <= 0 && $component->checkIsRequiredStage())
            return [
                'error' => 'Oбязательно заполнение строк хотя бы для одного товара во вкладке "Оценка выручки и платежей"'
            ];

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

        $component->defineEntityRevenue();

        return $component->arResult['REVENUES'];
    }

    public static function loadSettingAction($name, $value){
        Option::set('troya.revenue', $name, $value);
    }

    function getMonthQuarter($month){
        return intval(($month+2)/3);
    }

    private function defineEntityRevenue(){

        $this->arResult['REVENUES'] = [];
        $quartes=[
            date('Y').'.'.$this->getMonthQuarter(date('m')),
            (date('Y')+1).'.'.$this->getMonthQuarter(date('m'))
        ];

        $crmCatalogIblockId = COption::GetOptionString("crm","default_product_catalog_id",14);
        $this->arResult['CATALOG_ID'] = $crmCatalogIblockId;

        $revenuesTableRS = RevenueTable::getList([
            'select' => [
                '*',
                'PRODUCT_NAME' => 'PRODUCT_TABLE.NAME'
            ],
            'filter' => [
                'ENTITY_TYPE_ID' => $this->arParams['ENTITY_TYPE_ID'],
                'ENTITY_ID' => $this->arParams['ENTITY_ID'],
				//'PRODUCT_TABLE.IBLOCK_ID' => $crmCatalogIblockId,
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

            $categoryStageList = array_filter(DealCategory::getStageInfos($category['ID']), fn($v) => $v['SEMANTICS'] != 'F');

            $categoryStageList = array_map(function($v){
				return $v['NAME'];
			},$categoryStageList);

            $this->arResult['CATEGORY_STAGES'][$category['ID']] = [
                'STAGES' => array_merge(['' => 'Не проверять'], $categoryStageList),
                'CATEGORY_ID' => $category['ID'],
                'CATEGORY_NAME' => $category['NAME'],
            ];
        }

        $this->arResult['CATEGORY_SETTINGS'] = Option::getForModule('troya.revenue');
    }

    private function defineEntityData(){

        $factory = Container::getInstance()->getFactory($this->arParams['ENTITY_TYPE_ID']);
        $this->arResult['ENTITY_DATA'] = $factory->getItem($this->arParams['ENTITY_ID'])->getCompatibleData();
    }

    private function definePermissions(){

        global $USER;

        if(!$this->arResult['ENTITY_DATA'])
            $this->defineEntityData();

        $userPermissions = CCrmPerms::GetCurrentUserPermissions();
        $arEntityAttr = CCrmDeal::GetPermissionAttributes(array($this->arResult['ENTITY_DATA']['ID']), $this->arResult['ENTITY_DATA']['CATEGORY_ID']);

        $this->arResult['PREMISSIONS'] = [
            'ADMIN' => $USER->isAdmin(),
            'CAN_EDIT' => CCrmDeal::CheckUpdatePermission(
                $this->arResult['ENTITY_DATA']['ID'],
                $userPermissions,
                $this->arResult['ENTITY_DATA']['CATEGORY_ID'],
                array('ENTITY_ATTRS' => $arEntityAttr)
            )
        ];
    }

    private function checkIsRequiredStage(){

        $startCheckStage = $this->arResult['CATEGORY_SETTINGS']["CATEGORY_{$this->arResult['ENTITY_DATA']['CATEGORY_ID']}"];

        if(!$startCheckStage)
            return false;

        $currentCategoryStages = array_keys($this->arResult['CATEGORY_STAGES'][$this->arResult['ENTITY_DATA']['CATEGORY_ID']]['STAGES']);
        $requireStageLevl = array_search($startCheckStage, $currentCategoryStages);

        if(!$requireStageLevl)
            return false;

        $requiresStages = array_splice($currentCategoryStages, $requireStageLevl);

        if(!in_array($this->arResult['ENTITY_DATA']['STAGE_ID'], $requiresStages))
            return false;

        return true;
    }

    public function executeComponent() {
        if(!Loader::IncludeModule('iblock') || !Loader::IncludeModule('troya.revenue'))
            return;

        $this->defineEntityRevenue();
        $this->defineCategoryStages();
        $this->defineEntityData();
        $this->definePermissions();

        $this->includeComponentTemplate();
    }
}