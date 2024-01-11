<?php
use Bitrix\Main\Application;

define('NO_KEEP_STATISTIC', 'Y');
define('NO_AGENT_STATISTIC', 'Y');
define('NO_AGENT_CHECK', true);
define('PUBLIC_AJAX_MODE', true);
define('DisableEventsCheck', true);

$siteID = isset($_REQUEST['site']) ? mb_substr(preg_replace('/[^a-z0-9_]/i', '', $_REQUEST['site']), 0, 2) : '';

if ($siteID !== '') {
    define('SITE_ID', $siteID);
}

require_once($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php');

if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) {
    //die();
}

/**
 * Проверка сессии
 */
if (!check_bitrix_sessid()) {
    //die();
}

Header('Content-Type: text/html; charset=' . LANG_CHARSET);

global $APPLICATION;
$APPLICATION->ShowAjaxHead();

$request = Application::getInstance()->getContext()->getRequest();

$APPLICATION->IncludeComponent(
    'bitrix:ui.sidepanel.wrapper',
    '',
    [
        'PLAIN_VIEW' => false,
        'USE_PADDING' => true,
        'POPUP_COMPONENT_NAME' => 'troya:entity.revenue',
        'POPUP_COMPONENT_TEMPLATE_NAME' => $componentData['template'] ?? '',
        'POPUP_COMPONENT_PARAMS' => $request->get('PARAMS')['params']
    ]
);

\CMain::FinalActions();