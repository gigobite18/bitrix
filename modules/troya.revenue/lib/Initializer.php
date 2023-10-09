<?php
namespace Troya\Revenue;

use Bitrix\Crm\Category\DealCategory;
use Troya\Revenue\Orm\RevenueTable;
use Bitrix\Main\Config\Option;

class Initializer
{
    const ALLOWED_TYPES = [2];

    public static function insertTab(\Bitrix\Main\Event $event){

        if(!in_array($event->getParameter('entityTypeID'),self::ALLOWED_TYPES))
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

        $stages = array_keys(DealCategory::getStageList($arFields['CATEGORY_ID']));

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

        $arFields['RESULT_MESSAGE'] = 'Oбязательно заполнение строк хотя бы для одного товара во вкладке "Оценка выручки и платежей"';

        return false;
    }
}