<?php
namespace Axioma\Customizations\Applications\CategoriedEntitySellector;

use \Bitrix\UI\Toolbar\Facade\Toolbar;
use Bitrix\Main\Localization\Loc;
use Bitrix\Main\Loader;
use Bitrix\Crm\Service;
use Axioma\Customizations\Applications\CategoriedEntitySellector\Orm\ConfigTable;
use Axioma\Customizations\Orm\UserFieldEnumTable;

class Render
{
    public function __construct($action, $entity)
    {
        $this->entity = $entity;
        switch ($action){
            case 'settingsLink':
                $this->renderSettingLink();
                break;


            case 'apply':
                $this->renderApplication();
                break;
        }
    }


    private function renderSettingLink(){

        global $USER;
        if(!$USER->isAdmin())
            return;

        Toolbar::addButton([
            "color" => \Bitrix\UI\Buttons\Color::LIGHT_BORDER,
            "icon" => false,
            "click" => new \Bitrix\UI\Buttons\JsCode(
                "BX.SidePanel.Instance.open('/axioma-customizations/?".http_build_query($this->entity)."', {allowChangeHistory: false, cacheable : false, width: 600, Title: '".Loc::GetMessage("RELATED_PROPERTIES_SETTINS")."'})"
            ),
            "text" => Loc::GetMessage("RELATED_PROPERTIES_SETTINGS_BTN")
        ]);


    }

    private function renderApplication(){

        $this->defineEntityConfig();
        $this->includeHeadStrings();

    }

    private function defineEntityConfig(){

        $config = ConfigTable::getList([
            'filter' => [
                'ENTITY' => $this->entity['entity'],
                'ENTITY_ID' => $this->entity['entity_id'],
            ],
        ])->fetchAll();

        foreach ($config as $item){

            switch ($item['INNER_ENTITY']){
                case 'crm':

                    $this->getCrmConfigItemCategories($item);
                    $this->entity_config[] = $item;
                    break;
            }
        }

    }

    private function getCrmConfigItemCategories(&$item){


        Loader::IncludeModule('crm');




        $table = Service\Container::getInstance()->getFactory($item['INNER_ENTITY_ID'])->getDataClass();

        $result = $table::getList([
            'select' => [
                'TITLE',
                'ID',
                'CAT_TITLE' => 'EMUN_TABLE.VALUE',
                'CAT_ID' => 'EMUN_TABLE.ID',
            ],
            'order' => [
                'CAT_TITLE' => 'asc',
                'TITLE' => 'asc',
            ],
            'runtime' => [
                'EMUN_TABLE' => [
                    'data_type' => 'Axioma\Customizations\Orm\UserFieldEnumTable',
                    'reference' => [
                        'this.'.$item['INNER_PROPERTY'] => 'ref.ID',
                    ]
                ]
            ]
        ]);

        while($row = $result->fetch()){
            if(!$item['CATEGORIES'][$row['CAT_ID']])
                $item['CATEGORIES'][$row['CAT_ID']] = [
                    'ID' => $row['CAT_ID'],
                    'TITLE' => $row['CAT_TITLE'],
                ];

            $item['CATEGORIES'][$row['CAT_ID']]['ITEMS'][$row['ID']] = $row['TITLE'];
        }
    }

    private function includeHeadStrings(){
        \CJSCore::init(['ui.select', 'ui.entity-selector']);

        global $APPLICATION;

        $APPLICATION->addHeadScript('/local/modules/axioma.customizations/lib/Applications/CategoriedEntitySellector/dist/script.js');
        $APPLICATION->addHeadScript('/local/modules/axioma.customizations/lib/Applications/CategoriedEntitySellector/dist/multiselect.js');
        $APPLICATION->setAdditionalCss('/local/modules/axioma.customizations/lib/Applications/CategoriedEntitySellector/dist/style.css');
        $APPLICATION->setAdditionalCss('/local/modules/axioma.customizations/lib/Applications/CategoriedEntitySellector/dist/multiselect.css');
        $APPLICATION->AddHeadString("
        <script>
            categoriedEntitySellectorConfig = ".\Bitrix\Main\Web\Json::encode($this->entity_config).";
            
            BX.message({
                'CATEGORIES' : '".GetMessage('CATEGORIES')."',
            })
        </script>
        ");
    }

}