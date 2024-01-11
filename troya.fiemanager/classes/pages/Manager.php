<?php

namespace Troya\FieManager\Pages;

use Bitrix\Main\Page\Asset,
    Bitrix\Main\Loader,
    Bitrix\Crm\Binding\ContactCompanyTable,
    Bitrix\Crm\Service,
    Troya\FieManager\Settings,
    Bitrix\Main\Entity\ExpressionField,
    Bitrix\UI\Toolbar\Facade\Toolbar,
    Bitrix\UI\Toolbar\Manager as TManager,
    Troya\FieManager\Controller\Dynamic,
    Troya\FieManager\Orm\StringFillmentTable,
    Troya\FieManager\Orm\RequirementsTable,
    Troya\FieManager\Orm\EntityLimitsTable,
    Troya\FieManager\Orm\BlockingsTable,
    Troya\FieManager\Orm\ListLimitsTable;

class Manager{

    const ALLOW_CRM_TYPES = [
        'DEAL',
        'LEAD',
    ];

    const ALLOW_CRM_CLIENT_TYPES = [
        'CONTACT',
        'COMPANY',
    ];

    const ALLOW_DYNAMIC = true;

    public static function getConfig()
    {
        return [
            'path' => 'client_field',
            'pages' => [
                'crm_detail' => 'crm/#entity_type#/details/#entity_id#/',
                'crm_type_detail' => 'crm/type/#entity_type#/details/#entity_id#/',
            ]
        ];
    }

    public static function crmDetailPageDetected($variables=[]){self::initItemFieldManager($variables);}
    public static function crmTypeDetailPageDetected($variables=[]){self::initItemFieldManager($variables);}

    public static function initSettingsControl(&$menu){


        global $USER;

        if(!$USER->isAuthorized() || !Loader::IncludeModule('crm') || !is_array($menu))
            return;

        $userPermissions = Service\Container::getInstance()->getUserPermissions();

        if(!$userPermissions->canWriteConfig())
            return;


        $ids = array_column($menu, 'ID');
        $links = [];
        foreach (self::ALLOW_CRM_TYPES as $type){
            $key = array_search($type, $ids);
            $links[] = self::getManagerLink($menu, $key);
        }

        $dynamicKey = array_search('DYNAMIC_LIST', $ids);
        if(array_key_exists($dynamicKey, $menu) && self::ALLOW_DYNAMIC){
            foreach ($menu[$dynamicKey]['ITEMS'] as $dynamicItemKey => $dynamicItemDesc){
                $links[] = self::getManagerLink($menu[$dynamicKey]['ITEMS'], $dynamicItemKey);
            }
        }

        $clientKey = array_search('crm_clients', $ids);
        if(array_key_exists($clientKey, $menu) && is_array(self::ALLOW_CRM_CLIENT_TYPES)){
            foreach (self::ALLOW_CRM_CLIENT_TYPES as $clientItemKey => $clientItemDesc){
                $links[] = self::getManagerLink($menu[$clientKey]['ITEMS'], $clientItemKey);
            }
        }

        $settingsKey = array_search('crm_settings', $ids);
        if(array_key_exists($settingsKey, $menu)){
            $menu[$settingsKey]['ITEMS'][] = [
                'ID' => 'FIELD_MANAGER_CONFIG',
                'MENU_ID' => 'TROYA',
                'NAME' => 'Контроль полей',
                'TITLE' => 'Контроль полей',
                'ITEMS' => $links,
            ];
        }



    }

    public static function getManagerLink($items, $key){

        if(!array_key_exists($key, $items))
            return;

        if(!array_key_exists('ITEMS', $items[$key]))
            $items[$key]['ITEMS'] = [];

        $id = $items[$key]["ID"];

        if(intval($id) != $id)
            $id = \CCrmOwnerType::ResolveID(mb_strtoupper($id));


        return [
            'ID' => 'FIELD_MANAGER_CONFIG_LINK_'.$items[$key]["ID"],
            'MENU_ID' => 'TROYA',
            'NAME' => $items[$key]['NAME'],
            'TITLE' => $items[$key]['TITLE'],
            'ON_CLICK' => 'BX.SidePanel.Instance.open(`/troya/crm/field-manager/?entity_type='.$id.'`, {allowChangeHistory: false,width:1200,cacheable: false, label: {text: "Контроль полей"}});return false;'
        ];
    }


    public static function initItemFieldManager($variables){

        self::applyEntityCardRegulations($variables);

    }


    public static function applyEntityCardRegulations($variables){

        if(!Loader::IncludeModule('crm'))
            return;

        $tables = [
            'list_limits' => 'Troya\FieManager\Orm\ListLimitsTable',
            'blocks' => 'Troya\FieManager\Orm\BlockingsTable',
            'requirements' => 'Troya\FieManager\Orm\RequirementsTable',
            'string_fillment' => 'Troya\FieManager\Orm\StringFillmentTable',
            'entity_limits' => 'Troya\FieManager\Orm\EntityLimitsTable',
        ];

        foreach ($tables as $type => $table){
            $configuration[$type] = $table::getList([
                'filter' => [
                    'ENTITY' => [
                        $variables['entity_type'],
                        \CCrmOwnerType::ResolveID(mb_strtoupper($variables['entity_type']))
                    ]
                ]
            ])->fetchAll();
        }

        global $APPLICATION;

        \CJSCore::init(['troya.item-manager']);

        $APPLICATION->addHeadString("
        <script>
            BX.ready(() => {
                BX.Troya.ItemManager.instance = new BX.Troya.ItemManager(".\Bitrix\Main\Web\Json::encode($configuration).", ".\Bitrix\Main\Web\Json::encode(Dynamic::getFieldsAction($variables['entity_type'])).");
            })
        </script>
        ");
    }
}