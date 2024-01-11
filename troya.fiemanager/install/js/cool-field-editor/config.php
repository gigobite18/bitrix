<?
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
	die();
}

return [
    'js' => 'dist/cool-field.editor.js',
    'css' => 'dist/cool-field.editor.css',
	'rel' => [
        'troya.absolute',
		'ui.entity-selector',
		'ui.layout-form',
        'ui.forms',
        'ui.buttons',
        'ui.buttons.icons',
        'ui.select',
        'date'
	],
	'skip_core' => false,
];