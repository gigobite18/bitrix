<?php

namespace Troya\SmartActions\Pages;

use Bitrix\Main\Page\Asset,
    Bitrix\Main\Loader,
    Bitrix\Crm\Binding\ContactCompanyTable,
    Bitrix\Crm\Service,
    Troya\FieManager\Settings,
    Bitrix\Main\Entity\ExpressionField,
    Bitrix\UI\Toolbar\Facade\Toolbar,
    Bitrix\UI\Toolbar\Manager as TManager,
    Troya\FieManager\Controller\Dynamic;

class Manager{

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

    public static function crmDetailPageDetected($variables=[]){self::insertCopyClient($variables);}
    public static function crmTypeDetailPageDetected($variables=[]){self::insertCopyClient($variables);}

    public static function initSettingsControl(&$menu){


        global $USER;

        if(!$USER->isAuthorized() || !Loader::IncludeModule('crm') || !is_array($menu))
            return;

        $userPermissions = Service\Container::getInstance()->getUserPermissions();

        if(!$userPermissions->canWriteConfig())
            return;


        $ids = array_column($menu, 'ID');


        $settingsKey = array_search('crm_settings', $ids);
        if(array_key_exists($settingsKey, $menu)){
            $menu[$settingsKey]['ITEMS'][] = [
                'ID' => 'SMART_ACTIONS_IMPORT',
                'MENU_ID' => 'SMART_ACTIONS',
                'NAME' => 'Импорт элементов',
                'ON_CLICK' => 'BX.SidePanel.Instance.open(`/troya/crm/import/`, {allowChangeHistory: false,width:600,cacheable: false, label: {text: "Импорт"}});return false;'
            ];
            $menu[$settingsKey]['ITEMS'][] = [
                'ID' => 'SMART_ACTIONS_EXPORT',
                'MENU_ID' => 'SMART_ACTIONS',
                'NAME' => 'Экспорт элементов',
                'ON_CLICK' => 'BX.SidePanel.Instance.open(`/troya/crm/export/`, {allowChangeHistory: false,width:600,cacheable: false, label: {text: "Экспорт"}});return false;'
            ];
        }



    }

    public static function insertCopyClient($variables){

        global $APPLICATION;

        $APPLICATION->addHeadScript('/local/modules/troya.smartactions/install/dist/copyManager/script.js');
        $APPLICATION->addHeadString('<script>window.entity='.\Bitrix\Main\Web\Json::encode($variables).'</script>');

        \CJSCore::Init([
            'popup',
            'ui.notification'
        ]);

    }

}