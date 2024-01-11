<?php

use Bitrix\Main;
use Bitrix\Main\Loader;
use Bitrix\Main\Application;
use Bitrix\Main\Localization\Loc;
use Bitrix\Main\Engine\Contract\Controllerable;
use Bitrix\Crm\Service;

if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();


class CategoriedEntitySellectorSettings extends \CBitrixComponent implements Controllerable
{

    const ALLOW_TYPES = ['enumeration'];

    public function configureActions(){}

    public static function saveElementAction($data){
        return $data;
    }

    public static function removeElementAction($data){
        return $data;
    }

    public function onPrepareComponentParams($arParams){
        $request = Application::getInstance()->getContext()->getRequest();




        $arParams['ENTITY'] = $request['entity'];
        $arParams['ENTITY_ID'] = $request['entity_id'];

        if(intval($request['entity_id']) != $request['entity_id'] && $request['entity'] == 'crm'){
            Loader::IncludeModule('crm');
            $arParams['ENTITY_ID'] = CCrmOwnerType::ResolveID(mb_strtoupper($request['entity_id']));
        }



        CJSCore::init(['ui.buttons', 'ui.buttons.icons', 'ui.entity-selector']);

        return $arParams;
    }

    private function defeineProps(){

        $this->arResult['FIELDS'] = [];

        switch ($this->arParams['ENTITY']){
            case 'crm':
                $this->defineCrmProps();
                break;
        }


        global $APPLICATION;

        $APPLICATION->AddHeadString("
        <script>
            configuratorEntityFields = ".Bitrix\Main\Web\Json::encode($this->arResult['FIELDS']).";
        </script>
        ");
    }

    private function defineCrmProps(){


        if(!$this->arParams['ENTITY_ID'])
            return;

        $factory = Service\Container::getInstance()->getFactory($this->arParams['ENTITY_ID']);
        $fields = $factory->getUserFieldsInfo();

        $this->defineCrmEntityProps($fields);
    }

    private function defineCrmEntityProps($fields){
        $fields = array_filter($fields, fn($v) => $v['TYPE'] == 'crm' && count(array_filter($v['SETTINGS'], fn($v) => $v == 'Y')) == 1);

        $entityFields = [];
        $entityIds = [];
        foreach ($fields as $key => $field){

            $entityCode = array_keys(array_filter($field['SETTINGS'], fn($v) => $v == 'Y'))[0];
            $entityId = CCrmOwnerType::ResolveID($entityCode);
            $entityIds[$entityCode] = $entityId;

            $this->arResult['FIELDS'][$key] = [
                'TITLE' => $field['TITLE'],
                'ENTITY' => 'crm',
                'ENTITY_ID' => $entityId,
                'CODE' => $key
            ];
            $entityFields[$entityId] = is_array($entityFields[$entityId]) ? array_merge($entityFields[$entityId], [$key]) : [$key];
        }

        foreach ($entityIds as $entityId){
            $factory = Service\Container::getInstance()->getFactory($entityId);
            $fields = array_filter($factory->getUserFieldsInfo(), fn($v) => in_array($v['TYPE'], self::ALLOW_TYPES));

            $optimFildsInfo=[];
            foreach ($fields as $key => $fieldInfo){
                $optimFildsInfo[] = [
                    'CODE' => $key,
                    'TITLE' => $fieldInfo['TITLE'],
                    'TYPE' => $fieldInfo['TYPE']
                ];
            }

            foreach ($entityFields[$entityId] as $fieldKey){
                $this->arResult['FIELDS'][$fieldKey]['PROPS'] = $optimFildsInfo;
            }
        }
    }

    public function executeComponent()
    {

        Loader::IncludeModule($this->arParams['ENTITY']);

        $this->defeineProps();
        $this->includeComponentTemplate();
    }

}