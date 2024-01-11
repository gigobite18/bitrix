<?php
namespace Axioma\Customizations\Applications\CategoriedEntitySellector\Orm;

use Bitrix\Main\Entity;

class ConfigTable extends Entity\DataManager
{
    public static function getTableName()
    {
        return 'axioma_cat_entity_selector_config';
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
            new Entity\StringField('INNER_PROPERTY'),
            new Entity\StringField('MAIN_PROPERTY'),
            new Entity\StringField('ENTITY'),
            new Entity\IntegerField('ENTITY_ID'),
            new Entity\StringField('INNER_ENTITY'),
            new Entity\IntegerField('INNER_ENTITY_ID'),
        ];
    }
}