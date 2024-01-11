<?
$arResult['FIELDS'] = array_filter($arResult['FIELDS'], function($value, $key) use ($arResult){
    return ($value['TYPE'] == 'string' && !in_array($key, array_column($arResult['CONFIG'], 'FIELD_CODE'))) || ($value['TYPE'] == 'string' && $arResult['ITEM']['FIELD_CODE'] == $key);
}, ARRAY_FILTER_USE_BOTH);

