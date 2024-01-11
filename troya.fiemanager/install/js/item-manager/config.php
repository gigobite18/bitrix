<?
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
	die();
}

return [
    'js' => [
        'dist/managers/string-fillment-manager/string-fillment-manager.js',
        'dist/managers/list-limits-manager/list-limits-manager.js',
        'dist/managers/required-fields-manager/required-fields-manager.js',
        'dist/managers/blocks-fields-manager/blocks-fields-manager.js',
        'dist/managers/entity-limits-manager/entity-limits-manager.js',
        'dist/item-manager.js',
    ],
    'css' => [
        'dist/managers/string-fillment-manager/string-fillment-manager.css',
        'dist/managers/list-limits-manager/list-limits-manager.css',
        'dist/managers/required-fields-manager/required-fields-manager.css',
        'dist/managers/blocks-fields-manager/blocks-fields-manager.css',
        'dist/managers/entity-limits-manager/entity-limits-manager.css',
        'dist/item-manager.css',
    ],
    'rel' => [
        'troya.absolute',
    ],
	'skip_core' => true,
];