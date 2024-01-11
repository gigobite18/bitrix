<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetTitle('Импорт элементов смарт-процессов');


?>
<?$APPLICATION->IncludeComponent(
    "bitrix:ui.sidepanel.wrapper",
    "",
    [
        'POPUP_COMPONENT_NAME' => 'troya:smart.elements.import',
    ],
);
?>
<? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php");