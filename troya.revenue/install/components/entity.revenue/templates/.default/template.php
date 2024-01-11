
<? if($arResult['PREMISSIONS']['ADMIN'] || $arResult['PREMISSIONS']['CAN_EDIT']):?>
    <div class="crm-entity-product-list-add-block crm-entity-product-list-add-block-top crm-entity-product-list-add-block-active element-revenues-buttons">
        <div>
            <?if($arResult['PREMISSIONS']['ADMIN']):?>
                <a class="ui-btn ui-btn-light-border ui-btn-icon-setting"></a>
            <?endif;?>

            <?if($arResult['PREMISSIONS']['CAN_EDIT']):?>
                <a class="ui-btn ui-btn-primary add-product">
                    Добавить товар
                </a>
                <a class="ui-btn ui-btn-primary add-quartal-left">
                    Добавить квартал влево
                </a>
                <a class="ui-btn ui-btn-primary add-quartal">
                    Добавить квартал вправо
                </a>
                <a hidden class="ui-btn ui-btn-success save">
                    Сохранить
                </a>
            <?endif;?>
        </div>

    </div>
<?endif;?>

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
        <?=Bitrix\Main\Web\Json::encode($arResult['CATEGORY_SETTINGS'])?>,
        <?=$arResult['CATALOG_ID']?>,
        <?=Bitrix\Main\Web\Json::encode($arResult['PREMISSIONS'])?>
    );
</script>
