<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetTitle('Экспорт элементов смарт-процессов');


?>
<?$APPLICATION->IncludeComponent(
    "bitrix:ui.sidepanel.wrapper",
    "",
    [
        'POPUP_COMPONENT_NAME' => 'troya:smart.elements.export',
    ],
);
?>
<? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php");