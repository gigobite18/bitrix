<?
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();
use Bitrix\Main\Loader,
    Bitrix\UI\Toolbar\Facade,
    Bitrix\UI\Toolbar\Manager,
    Bitrix\Main\Engine\Contract\Controllerable,
    Bitrix\Crm\Service,
    Troya\FieManager\Controller\Dynamic;

class EntityFieldsConfigType extends  \CBitrixComponent implements Controllerable{

    public function configureActions(){}

    private function includeExtensions(){
        CJSCore::Init(['ui.layout-form', 'ui.buttons', 'ui.ears', 'ui.hint']);
    }

    private function defineConfig(){

        $tableConfigs = $this->arParams['TYPE_TABLE_SYNC'];

        if($this->arParams['~VARIABLES']['type'])
            $types = [$this->arParams['~VARIABLES']['type']];
        else
            $types = array_keys($tableConfigs);

        $this->arResult['CONFIG'] = [];

        foreach ($types as $type){

            $table = $tableConfigs[$type];

            if(!$table){
                ShowError('Недопустимый тип. Обратитесь к администратору.');
                return;
            }

            $elementsRS = $table::getList([
                'filter' => [
                    'ENTITY' => $this->arParams['~VARIABLES']['entity']
                ],
            ]);


            $fields = $this->arResult['FIELDS'];

            while($element = $elementsRS->fetch()){
                $element['type'] = $type;

                if($element['FIELD_CODE'])
                    $element['name'] = $fields[$element['FIELD_CODE']]['TITLE'];
                else if(is_array($element['FIELD_CODES']))
                    $element['name'] = implode('<br>', array_map(function($v) use ($fields){
                        return $fields[$v]['TITLE'];
                    }, $element['FIELD_CODES']));

                $element['link'] = $this->arParams['FOLDER']."?type=$type&entity={$this->arParams['~VARIABLES']['entity']}&id={$element['ID']}";
                $this->arResult['CONFIG'][] = $element;
            }

        }

    }

    private function defineEntityFields(){

        if(intval($this->arParams['~VARIABLES']['entity']) != $this->arParams['~VARIABLES']['entity']){
            $this->arParams['~VARIABLES']['entity'] = \CCrmOwnerType::ResolveID(mb_strtoupper($this->arParams['~VARIABLES']['entity']));
        }

        //$factory = Service\Container::getInstance()->getFactory($this->arParams['~VARIABLES']['entity']);
        //$this->arResult['FIELDS'] = $factory->getUserFieldsInfo();
        $this->arResult['FIELDS'] = Dynamic::getFieldsAction($this->arParams['~VARIABLES']['entity'])['fields'];


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
                troyaControlParams = ".\Bitrix\Main\Web\Json::encode($this->arParams)."
            </script>");

        $this->includeComponentTemplate();
    }

}
