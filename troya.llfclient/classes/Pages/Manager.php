<?php

namespace Troya\LLFClient\Pages;

use Bitrix\Main\Page\Asset,
    Bitrix\Main\Loader,
    Bitrix\Crm\Binding\ContactCompanyTable,
    Bitrix\Main\Entity\ExpressionField;

class Manager{

    public static function getConfig()
    {
        return [
            'path' => 'client_field',
            'pages' => [
                'entity_detail' => 'crm/#entity_type#/details/#entity_id#/',
                'entity_dynamic_detail' => 'crm/type/#entity_type#/details/#entity_id#/',
            ]
        ];
    }

    public static function entityDetailPageDetected($variables=[]){
        self::initLLFClient();
    }

    public static function entityDynamicDetailPageDetected($variables=[]){
        self::initLLFClient();
    }

    public static function initLLFClient(){

        Loader::IncludeModule('crm');

        $compContactBinds=[];
        $compContactBindsRS = ContactCompanyTable::getList([
            'select' => [
                'COMPANY_ID',
                'CONTACT_ID',
                'CONTACT_TITLE',
                'CONTACT_LINK'
            ],
            'runtime' => [
                'CONTACT_TABLE' => [
                    'data_type' => '\Bitrix\Crm\ContactTable',
                    'reference' => [
                        'this.CONTACT_ID' => 'ref.ID'
                    ]
                ],
                new \Bitrix\Main\Entity\ExpressionField(
                    'CONTACT_LAST_NAME',
                    'COALESCE(%s, " ")',
                    'CONTACT_TABLE.LAST_NAME'
                ),
                new \Bitrix\Main\Entity\ExpressionField(
                    'CONTACT_NAME',
                    'COALESCE(%s, " ")',
                    'CONTACT_TABLE.NAME'
                ),
                new \Bitrix\Main\Entity\ExpressionField(
                    'CONTACT_SECOND_NAME',
                    'COALESCE(%s, " ")',
                    'CONTACT_TABLE.SECOND_NAME'
                ),
                new \Bitrix\Main\Entity\ExpressionField(
                    'CONTACT_TITLE',
                    'CONCAT(%s, " ", %s, " ", %s)',
                    ['CONTACT_LAST_NAME','CONTACT_NAME', 'CONTACT_SECOND_NAME']
                ),
                new ExpressionField(
                    'CONTACT_LINK',
                    'REPLACE("/crm/contact/details/#contact_id#/", "#contact_id#", %s)',
                    'CONTACT_ID',
                ),
            ]
        ]);
        while($bind = $compContactBindsRS->fetch()){
            $compContactBinds[$bind['COMPANY_ID']][] = [
                'TITLE' => $bind['CONTACT_TITLE'],
                'LINK' => $bind['CONTACT_LINK'],
                'ID' => intval($bind['CONTACT_ID']),
            ];
        }

        global $APPLICATION;

        $APPLICATION->addHeadString("
        <script>
            companyContactBinds = ".\Bitrix\Main\Web\Json::encode($compContactBinds).";
        </script>
        ");

        Asset::getInstance()->addJs("/local/modules/troya.llfclient/install/dist/js/llfclient.js");
    }
}