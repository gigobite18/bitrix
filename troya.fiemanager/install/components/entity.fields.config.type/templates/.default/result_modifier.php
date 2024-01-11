<?php
$arResult['TYPES'] = [
    'STRING_FILLMENT' => [
        'title' => 'Заполнение типа "Строка"',
        'link' => $arParams['FOLDER']."?type=STRING_FILLMENT&entity={$_REQUEST['entity_type']}&id=0",
        'desc' => 'Задайте полям паттерн заполнения.',
        'image' => '/local/components/troya/entity.fields.config/templates/.default/images/stringrulls.svg?22',
        'items' => [],
    ],
    'REQUIREMENTS' => [
        'title' => 'Зависимая обязательность полей',
        'link' => $arParams['FOLDER']."?type=REQUIREMENTS&entity={$_REQUEST['entity_type']}&id=0",
        'desc' => 'Выстройте обязательность поля в зависимости от состояния других полей.',
        'image' => '/local/components/troya/entity.fields.config/templates/.default/images/anchorrulls.svg?22',
        'items' => [],
    ],
    'BLOCKINGS' => [
        'title' => 'Зависимая блокировка полей',
        'link' => $arParams['FOLDER']."?type=BLOCKINGS&entity={$_REQUEST['entity_type']}&id=0",
        'desc' => 'Выстройте правила запрета редактирования в зависимости от состояния других полей.',
        'image' => '/local/components/troya/entity.fields.config/templates/.default/images/lockrulls.svg?22',
        'items' => [],
    ],
    'LIST_LIMITS' => [
        'title' => 'Ограничение типа "Список"',
        'link' => $arParams['FOLDER']."?type=LIST_LIMITS&entity={$_REQUEST['entity_type']}&id=0",
        'desc' => 'Задайте доступные значения поля в зависимости от значений других.',
        'image' => '/bitrix/components/bitrix/crm.type.detail/templates/.default/images/preset-full.svg?22',
        'items' => [],
    ],
    'ENTITY_LIMITS' => [
        'title' => 'Ограничения типа "Диалог сущностей"',
        'link' => $arParams['FOLDER']."?type=ENTITY_LIMITS&entity={$_REQUEST['entity_type']}&id=0",
        'desc' => 'Задайте фильтры полю. Список элементов выстроится согласно нему.',
        'image' => '/local/components/troya/entity.fields.config/templates/.default/images/entityrulls.svg?22',
        'items' => [],
    ]
];


foreach ($arResult['CONFIG'] as $element){
    $arResult['TYPES'][$element['type']]['items'][] = $element;
}