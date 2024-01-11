<?
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();
use Bitrix\Main\Loader,
    Bitrix\UI\Toolbar\Facade,
    Bitrix\UI\Toolbar\Manager,
    Bitrix\Main\Engine\Contract\Controllerable;

class EntityFieldsConfig extends  \CBitrixComponent implements Controllerable{
    public function configureActions(){}

    function defineComponentPage(){

        global $APPLICATION;

        $arDefaultVariableAliases = array(
            'type' => 'type',
            'id' => 'id',
            'entity' => 'entity',
            'add' => 'add',
        );
        $VARIABLE_ALIASES = array(
            'type' => 'type',
            'id' => 'id',
            'entity' => 'entity',
            'add' => 'add',
        );

        $arComponentVariables = array(
            'type',
            'id',
            'entity',
            'add'
        );


        $arVariables = array();


        $arVariableAliases = CComponentEngine::makeComponentVariableAliases($arDefaultVariableAliases, $VARIABLE_ALIASES);
        $componentPage = CComponentEngine::initComponentVariables(false, $arComponentVariables, $arVariableAliases, $arVariables);


        if($arVariables['type'])
            $componentPage='type_list';
        if($arVariables['type'] && array_key_exists('id', $arVariables))
            $componentPage='type_list_item';

        $this->arParams['VARIABLES'] = $arVariables;
        $this->arParams['PAGE'] = $componentPage;

        return $componentPage;

    }


    public function executeComponent() {
        CJSCore::init(['ui.dialogs.messagebox']);
        $componentPage = $this->defineComponentPage();

        $this->includeComponentTemplate($componentPage);
    }

}
