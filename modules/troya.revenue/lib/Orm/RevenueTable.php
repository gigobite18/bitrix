<?php
namespace Troya\Revenue\Orm;

use Bitrix\Main\Localization\Loc,
    Bitrix\Main\Entity;


class RevenueTable extends Entity\DataManager
{
    public static function getTableName()
    {
        return 'troya_revenue';
    }

    /**
     * Returns entity map definition.
     *
     * @return array
     */
    public static function getMap()
    {
        return [
            new Entity\IntegerField(
                'ID',
                [
                    'primary' => true,
                    'autocomplete' => true,
                ]
            ),
            new Entity\IntegerField('ENTITY_TYPE_ID'),
            new Entity\IntegerField('ENTITY_ID'),
            new Entity\IntegerField('PRODUCT_ID'),
            new Entity\IntegerField('DOCUMENT_TYPE'),
            new Entity\IntegerField('SUMMARY'),
            new Entity\TextField('QUARTER_PRICES',[
                'save_data_modification' => function () {
                    return [
                        function ($value) {
                            return serialize($value);
                        }
                    ];
                },
                'fetch_data_modification' => function () {
                    return [
                        function ($value) {
                            return unserialize($value);
                        }
                    ];
                }
            ]),
        ];
    }
}