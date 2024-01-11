
<?
$APPLICATION->SetAdditionalCss('/bitrix/components/bitrix/crm.type.detail/templates/.default/style.min.css');
$APPLICATION->IncludeComponent(
    "troya:entity.fields.config.type",
    "",
    $arParams,
);
?>