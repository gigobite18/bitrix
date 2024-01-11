<?
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();
use Bitrix\Main\Loader,
    Bitrix\UI\Toolbar\Facade,
    Bitrix\UI\Toolbar\Manager,
    Bitrix\Main\Engine\Contract\Controllerable,
    Bitrix\Crm\Service,
    Troya\FieManager\Controller\Dynamic;

class EntityFieldsConfigTypeItem extends  \CBitrixComponent implements Controllerable{

    public function configureActions(){}

    private function includeExtensions(){
        CJSCore::Init(['ui.layout-form', 'ui.buttons', 'ui.alerts', 'ui.buttons.icons', 'troya.cool-field-editor']);
    }

    private function defineConfig(){

        $tableConfigs = $this->arParams['TYPE_TABLE_SYNC'];
        $table = $tableConfigs[$this->arParams['VARIABLES']['type']];

        if(!$table){
            ShowError('Недопустимый тип. Обратитесь к администратору.');
            return;
        }

        $this->arResult['CONFIG'] = $table::getList([
            'filter' => [
                'ENTITY' => $this->arParams['~VARIABLES']['entity']
            ],
        ])->fetchAll();

        if($_REQUEST['id'])
            $this->arResult['ITEM'] = $table::getById($_REQUEST['id'])->fetch();

    }

    private function defineEntityFields(){

        if(intval($this->arParams['VARIABLES']['entity']) != $this->arParams['VARIABLES']['entity']){
            $this->arParams['VARIABLES']['entity'] = \CCrmOwnerType::ResolveID(mb_strtoupper($this->arParams['VARIABLES']['entity']));
        }

        $factory = Service\Container::getInstance()->getFactory($this->arParams['VARIABLES']['entity']);

        $this->arResult['FIELDS'] = $factory->getUserFieldsInfo();
        $this->arResult['MORE_FIELDS'] = Dynamic::getFieldsAction($this->arParams['VARIABLES']['entity'])['fields'];
    }


    public function executeComponent() {

        if(!Loader::IncludeModule('crm'))
            return;

        $this->includeExtensions();
        $this->defineEntityFields();
        $this->defineConfig();

        global $APPLICATION;
        $APPLICATION->addHeadString("
            <script>
                troyaControlParams = ".\Bitrix\Main\Web\Json::encode($this->arParams).";
            </script>");

        $this->includeComponentTemplate();
    }

}
