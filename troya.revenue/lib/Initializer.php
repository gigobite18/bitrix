<?php
namespace Troya\Revenue;

use Bitrix\Crm\Category\DealCategory,
    Bitrix\Main\Config\Option,
    Troya\Revenue\Orm\RevenueTable,
    Bitrix\Main\Loader,
    CIMNotify;

class Initializer
{
    const ALLOWED_TYPES = [2];

    public static function insertTab(\Bitrix\Main\Event $event){

        if(!in_array($event->getParameter('entityTypeID'),self::ALLOWED_TYPES) || !$event->getParameter('entityID'))
            return;

        $tabs = $event->getParameter('tabs');
        $tabs[] = [
            'id' => 'revenue_tab',
            'name' => 'Оценка выручки и платежей',
            'loader' => [
                'serviceUrl' => '/local/components/troya/entity.revenue/lazyload.ajax.php?&site=' . \SITE_ID . '&' . \bitrix_sessid_get(),
                'componentData' => [
                    'template' => '',
                    'params' => [
                        'ENTITY_TYPE_ID' => $event->getParameter('entityTypeID'),
                        'ENTITY_ID' => $event->getParameter('entityID'),
                    ]
                ]
            ]
        ];
        return new \Bitrix\Main\EventResult(\Bitrix\Main\EventResult::SUCCESS, [
            'tabs' => $tabs,
        ]);
    }

    public static function checkIssetInDealStages(&$arFields){


		$stages = array_keys(array_filter(DealCategory::getStageInfos($category['ID']), fn($v) => $v['SEMANTICS'] != 'F'));

        $moduleOptions = Option::getForModule('troya.revenue');
        $startCheckStage = $moduleOptions["CATEGORY_{$arFields['CATEGORY_ID']}"];

        if(!$startCheckStage)
            return;

        $key = array_search($startCheckStage, $stages);

        if($key === false)
            return;

        $requiresStages = array_splice($stages, $key);

        if(!in_array($arFields['STAGE_ID'], $requiresStages))
            return;

        $revenues = RevenueTable::getList([
            'filter' => [
                'ENTITY_TYPE_ID' => 2,
                'ENTITY_ID' => $arFields['ID'],
            ],
        ])->fetchAll();

        if(count($revenues)>0)
            return;

        $message = 'Oбязательно заполнение строк хотя бы для одного товара во вкладке "Оценка выручки и платежей"';

        self::notifyCurrentUser($message);

        $arFields['RESULT_MESSAGE'] = $message;
        global $APPLICATION;
        $APPLICATION->ThrowException($arFields['RESULT_MESSAGE']);
        return false;
    }


    public static function notifyCurrentUser($message){
        if(!Loader::IncludeModule('im'))
            return;

        global $USER;

        CIMNotify::add([
            'TO_USER_ID' => $USER->getId(),
            'NOTIFY_TYPE' => IM_NOTIFY_SYSTEM,
            'NOTIFY_TAG' => 'crm_revenueless',
            'NOTIFY_MESSAGE' => $message
        ]);

    }
}