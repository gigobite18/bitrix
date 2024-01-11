<?php
$APPLICATION->SetAdditionalCss('/bitrix/components/bitrix/crm.type.detail/templates/.default/style.min.css');

$list = [
    [
        'title' => 'Правила заполнения полей типа Строка',
        'link' => "/local/modules/troya.fiemanager/install/fields/?type=STRING_FILLMENT&entity={$_REQUEST['entity_type']}",
        'desc' => 'Задайте полям паттерн заполнения.',
        'image' => '/local/components/troya/entity.fields.config/templates/.default/images/stringrulls.svg?22',
    ],
    [
        'title' => 'Зависимая обязательность полей',
        'link' => "/local/modules/troya.fiemanager/install/fields/?type=REQUIREMENTS&entity={$_REQUEST['entity_type']}",
        'desc' => 'Выстройте обязательность поля в зависимости от состояния других полей.',
        'image' => '/local/components/troya/entity.fields.config/templates/.default/images/anchorrulls.svg?22',
    ],
    [
        'title' => 'Зависимая блокировка полей',
        'link' => "/local/modules/troya.fiemanager/install/fields/?type=BLOCKINGS&entity={$_REQUEST['entity_type']}",
        'desc' => 'Выстройте правила запрета редактирования в зависимости от состояния других полей.',
        'image' => '/local/components/troya/entity.fields.config/templates/.default/images/lockrulls.svg?22',
    ],
    [
        'title' => 'Ограничение доступных значений полей типа Список',
        'link' => "/local/modules/troya.fiemanager/install/fields/?type=LIST_LIMITS&entity={$_REQUEST['entity_type']}",
        'desc' => 'Задайте доступные значения поля в зависимости от значений других.',
        'image' => '/bitrix/components/bitrix/crm.type.detail/templates/.default/images/preset-full.svg?22',
    ],
    [
        'title' => 'Ограничение доступных значений диалога выбора сущностей',
        'link' => "/local/modules/troya.fiemanager/install/fields/?type=ENTITY_LIMITS&entity={$_REQUEST['entity_type']}",
        'desc' => 'Задайте фильтры полю. Список элементов выстроится согласно нему.',
        'image' => '/local/components/troya/entity.fields.config/templates/.default/images/entityrulls.svg?22',
    ]
];
?>
<style>
    .crm-type-preset,
    .crm-type-preset-text{
        width: 100%;
        max-width: calc(100% - 20px);
    }
</style>

<div class="crm-type-presets-category-list">
    <?foreach ($list as $item):?>
        <div onclick="BX.SidePanel.Instance.open(`<?=$item['link']?>`, {allowChangeHistory: false,width:850,cacheable: false, label: {text: `<?=$item['title']?>`, bgColor: `rgb(47 138 246 / 95%)`,}});" class="crm-type-preset" data-role="preset" data-preset-id="bitrix:list">
            <div class="crm-type-preset-icon" style="background-image: url(<?=$item['image']?>)"></div>
            <div class="crm-type-preset-text">
                <div class="crm-type-preset-text-title"><?=$item['title']?></div>
                <div class="crm-type-preset-text-description"><?=$item['desc']?></div>
            </div>
        </div>
    <?endforeach;?>
</div>

