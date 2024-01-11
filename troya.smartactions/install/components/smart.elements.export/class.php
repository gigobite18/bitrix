<?
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();
use Bitrix\Main\Loader,
    Bitrix\UI\Toolbar\Facade,
    Bitrix\UI\Toolbar\Manager,
    Bitrix\Main\Engine\Contract\Controllerable,
    Bitrix\Crm\Service\Container;

class SmartElementsExport extends  \CBitrixComponent implements Controllerable{
    public function configureActions(){}

    protected function initExtensions(){
        \CJSCore::Init([
            'ui.layout-form',
            'ui.buttons',
            'ui.buttons.icons',
            'ui.entity-selector',
            'ui.notification'
        ]);

        global $APPLICATION;
        $APPLICATION->addHeadScript('/bitrix/js/main/popup_menu.js');
        $APPLICATION->addHeadScript('/bitrix/js/main/admin_tools.js');
    }

    protected function defineSmarts(){

        $this->arResult['SMARTS'] = [];


        foreach (Container::getInstance()->getTypesMap()->getFactories() as $factory) {

            $this->arResult['SMARTS'][] = [
                'ID' => $factory->getEntityTypeId(),
                'TITLE' => $factory->getEntityDescription(),
                'FIELDS' => $factory->getFieldsInfo(),
                'USER_FIELDS' => $factory->getUserFieldsInfo(),
            ];
            
        }

    }


    public function executeComponent() {

        if(!Loader::IncludeModule('crm'))
            return;

        $this->initExtensions();
        $this->defineSmarts();

        $this->includeComponentTemplate();
    }

}
