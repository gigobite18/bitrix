<?php

namespace Axioma\Customizations\Applications\CategoriedEntitySellector;

use Axioma\Customizations\Applications\CategoriedEntitySellector;
use Bitrix\Main\loader;

class PageManager{

    public static function getConfig()
    {
        return [
            'path' => 'related_properties',
            'pages' => [
                'crm_detail' => 'crm/#entity_type#/details/#entity_id#/',
                'crm_kanban' => 'crm/#entity_type#/kanban/',
                'crm_kanban_categoried' => 'crm/#entity_type#/kanban/category/#category_id#/',
                'crm_list' => 'crm/#entity_type#/list/',
                'crm_list_categoried' => 'crm/#entity_type#/list/category/#category_id#/',
                'crm_type_detail' => 'crm/type/#entity_type#/details/#entity_id#/',
                'crm_type_kanban' => 'crm/type/#entity_type#/kanban/category/#category_id#/',
                'crm_type_list' => 'crm/type/#entity_type#/list/category/#category_id#/',
            ]
        ];
    }

    public static function crmDetailPageDetected($variables=[]){

        if(intval($variables['entity_type']) != $variables['entity_type']){
            Loader::IncludeModule('crm');
            $variables['entity_type'] = \CCrmOwnerType::ResolveID(mb_strtoupper($variables['entity_type']));
        }

        new CategoriedEntitySellector\Render('apply', [
            'entity' => 'crm',
            'entity_id' => $variables['entity_type']
        ]);
    }

    public static function crmTypeDetailPageDetected($variables=[]){
        self::crmDetailPageDetected($variables);
    }



    public static function crmTypeKanbanPageDetected($variables=[]){

        if(intval($variables['entity_type']) != $variables['entity_type']){
            Loader::IncludeModule('crm');
            $variables['entity_type'] = \CCrmOwnerType::ResolveID(mb_strtoupper($variables['entity_type']));
        }

        new CategoriedEntitySellector\Render('settingsLink', [
            'entity' => 'crm',
            'entity_id' => $variables['entity_type']
        ]);
    }
    public static function crmTypeListPageDetected($variables=[]){self::crmTypeKanbanPageDetected($variables);}
    public static function crmKanbanPageDetected($variables=[]){self::crmTypeKanbanPageDetected($variables);}
    public static function crmListPageDetected($variables=[]){self::crmTypeKanbanPageDetected($variables);}
    public static function crmListCategoriedPageDetected($variables=[]){self::crmTypeKanbanPageDetected($variables);}
    public static function crmKanbanCategoriedPageDetected($variables=[]){self::crmTypeKanbanPageDetected($variables);}



}