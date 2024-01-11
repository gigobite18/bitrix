<?
$arResult['FIELDS'] = array_filter($arResult['FIELDS'], function($value, $key) use ($arResult){
    return ($value['TYPE'] == 'crm' && !in_array($key, array_column($arResult['CONFIG'], 'FIELD_CODE')) && count(array_filter($value['SETTINGS'])) == 1) || ($value['TYPE'] == 'crm' && $arResult['ITEM']['FIELD_CODE'] == $key  && count(array_filter($value['SETTINGS'])) == 1);
}, ARRAY_FILTER_USE_BOTH);

