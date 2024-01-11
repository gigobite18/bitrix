<?php
namespace Troya\FieManager\Orm;

use Bitrix\Main\Entity;

class StringFillmentTable extends Entity\DataManager
{

    public static function getTableName()
    {
        return 'troya_fiemanager_string_fillment';
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
            new Entity\StringField('FIELD_CODE',[]),
            new Entity\StringField('PATTERN',[]),
            new Entity\StringField('PATTERN_TYPE',[]),
            new Entity\StringField('DESCRIPTION', ['nullable' => true]),
            new Entity\StringField('USER_MESSAGE', ['nullable' => true]),
        ];
    }
}