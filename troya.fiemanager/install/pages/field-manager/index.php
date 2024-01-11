<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetTitle('Контроль полей');


?>
<?$APPLICATION->IncludeComponent(
    "bitrix:ui.sidepanel.wrapper",
    "",
    [
        'POPUP_COMPONENT_NAME' => 'troya:entity.fields.config',
        'POPUP_COMPONENT_TEMPLATE_NAME' => 'all',
        'POPUP_COMPONENT_PARAMS' => [
            'VARIABLES' => [
                'entity' => $_REQUEST['entity_type'],
                'id' => $_REQUEST['id'],
                'type' => $_REQUEST['type'],
            ],
            'TYPE_TABLE_SYNC' => [
                'STRING_FILLMENT' => 'Troya\FieManager\Orm\StringFillmentTable',
                'REQUIREMENTS' => 'Troya\FieManager\Orm\RequirementsTable',
                'ENTITY_LIMITS' => 'Troya\FieManager\Orm\EntityLimitsTable',
                'BLOCKINGS' => 'Troya\FieManager\Orm\BlockingsTable',
                'LIST_LIMITS' => 'Troya\FieManager\Orm\ListLimitsTable',
            ],
            'FOLDER' => '/troya/crm/field-manager/'
        ],
    ],
);
?>
<? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php");