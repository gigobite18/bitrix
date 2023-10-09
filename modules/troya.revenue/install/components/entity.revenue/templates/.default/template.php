<div class="crm-entity-product-list-add-block crm-entity-product-list-add-block-top crm-entity-product-list-add-block-active element-revenues-buttons">
    <div>
        <?if($arParams['IS_ADMIN']):?>
            <a class="ui-btn ui-btn-light-border ui-btn-icon-setting"></a>
        <?endif;?>

        <a class="ui-btn ui-btn-primary add-product">
            Добавить товар
        </a>
        <a class="ui-btn ui-btn-primary add-quartal">
            Добавить квартал
        </a>
        <a hidden class="ui-btn ui-btn-success save">
            Сохранить
        </a>
    </div>

</div>

<form class="element-revenues">
    <table>
        <thead></thead>
        <tbody></tbody>
    </table>
</form>


<script>
    new ElementRevenues(
        <?=Bitrix\Main\Web\Json::encode($arResult['REVENUES'])?>,
        <?=$arResult['min']?>,
        <?=$arResult['max']?>,
        <?=$arParams['ENTITY_ID']?> ,
        <?=$arParams['ENTITY_TYPE_ID']?> ,
        <?=Bitrix\Main\Web\Json::encode($arResult['CATEGORY_STAGES'])?>,
        <?=Bitrix\Main\Web\Json::encode($arResult['CATEGORY_SETTINGS'])?>
    );
</script>
