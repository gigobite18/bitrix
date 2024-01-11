<?php
namespace Troya\FieManager\Orm;

use Bitrix\Main\Entity;

class BlockingsTable extends Entity\DataManager
{

    public static function getTableName()
    {
        return 'troya_fiemanager_blockings';
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
            new Entity\StringField('ENTITY',[]),
            new Entity\StringField('FIELD_CODES',[
                'save_data_modification' => function () {
                    return array(
                        function ($value) {
                            return serialize($value);
                        }
                    );
                },
                'fetch_data_modification' => function () {
                    return array(
                        function ($value) {
                            return unserialize($value);
                        }
                    );
                }
            ]),
            new Entity\StringField('CONDITION',[]),
            new Entity\StringField('DESCRIPTION', ['nullable' => true]),
            new Entity\StringField('USER_MESSAGE', ['nullable' => true]),
        ];
    }
}