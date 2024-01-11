<?

use Bitrix\Main\Application,
    Bitrix\Main\Loader,
    Bitrix\Main\EventManager,
    CUserTypeEntity,
    Bitrix\Main\Config\Option;

class troya_fiemanager extends CModule
{
    
    protected $arrivalObjs=[
        [
            'from' => "/local/modules/#module_id#/install/components/entity.fields.config/",
            'to' => "/local/components/troya/entity.fields.config/",
            'is_path' => true,
        ],
        [
            'from' => "/local/modules/#module_id#/install/components/entity.fields.config.type/",
            'to' => "/local/components/troya/entity.fields.config.type/",
            'is_path' => true,
        ],
        [
            'from' => "/local/modules/#module_id#/install/components/entity.fields.config.type.item/",
            'to' => "/local/components/troya/entity.fields.config.type.item/",
            'is_path' => true,
        ],
        [
            'from' => "/local/modules/#module_id#/install/js/cool-field-editor/",
            'to' => "/bitrix/js/troya/cool-field-editor/",
            'is_path' => true,
        ],
        [
            'from' => "/local/modules/#module_id#/install/js/item-manager/",
            'to' => "/bitrix/js/troya/item-manager/",
            'is_path' => true,
        ],
        [
            'from' => "/local/modules/#module_id#/install/pages/field-manager/",
            'to' => "/troya/crm/field-manager/",
            'is_path' => true,
        ],
    ];

    protected $eventsHandls=[
        [
            'event' => 'OnBeforeProlog',
            'module' => 'main',
            'class' => 'Troya\FieManager\Pages\Identificator',
            'method' => 'createInstance',
        ],
        [
        'event' => 'OnAfterCrmControlPanelBuild',
        'module' => 'crm',
        'class' => 'Troya\FieManager\Pages\Manager',
        'method' => 'initSettingsControl',
        ]
    ];



    protected $agents=[
    ];

    protected $tables=[
        'Troya\FieManager\Orm\StringFillmentTable',
        'Troya\FieManager\Orm\RequirementsTable',
        'Troya\FieManager\Orm\EntityLimitsTable',
        'Troya\FieManager\Orm\BlockingsTable',
        'Troya\FieManager\Orm\ListLimitsTable',
    ];

    protected $userFields=[
    ];

    public function __construct()
    {
        $arModuleVersion = array();
        include_once(__DIR__ . '/version.php');
        $this->MODULE_ID = str_replace("_", ".", get_class($this));
        $this->MODULE_VERSION = $arModuleVersion["VERSION"];
        $this->MODULE_VERSION_DATE = $arModuleVersion["VERSION_DATE"];
        $this->MODULE_NAME = GetMessage("MODULE_TROYA_FIEMANAGER_NAME");
        $this->MODULE_DESCRIPTION = GetMessage("MODULE_TROYA_FIEMANAGER_DESCRIPTION");
        $this->PARTNER_NAME = GetMessage("MODULE_TROYA_FIEMANAGER_PARTNER_NAME");
        $this->PARTNER_URI = GetMessage("MODULE_TROYA_FIEMANAGER_PARTNER_URI");
        $this->isDev = true;
        $this->eventManager = EventManager::getInstance();
    }

    function DoInstall()
    {

        global $DOCUMENT_ROOT, $APPLICATION;
        if (!$this->installFiles()) {
            return false;
        }
        RegisterModule($this->MODULE_ID);
        Loader::includeModule($this->MODULE_ID);

        $this->installDB();
        $this->registerAgents();
        $this->registerListeners();
        $this->createUserFields();
    }

    function DoUninstall()
    {
        global $DOCUMENT_ROOT, $APPLICATION, $step;

        if(count($this->tables)>0)
            $step = 1;

        switch ($step){

            case 1:
                $this->unRegisterListeners();
                $this->unRegisterAgents();
                if($_REQUEST['save_tables']!='Y'){
                    $this->uninstallDB();
                }
                $this->UnInstallFiles();
                $this->deleteUserFields();
                UnRegisterModule($this->MODULE_ID);
                break;

            default:
                $APPLICATION->IncludeAdminFile(GetMessage("MODULE_UNINSTALL") . $this->MODULE_NAME, __DIR__."/unstep.php");
                break;

        }

    }

    function installFiles()
    {

        foreach ($this->arrivalObjs as $arrivalObj){
            $arrivalObj['from'] = str_replace('#module_id#', $this->MODULE_ID, $arrivalObj['from']);
            $arrivalObj['to'] = str_replace('#module_id#', $this->MODULE_ID, $arrivalObj['to']);

            if($arrivalObj['is_path'])
                CheckDirPath($arrivalObj['to']);

            CopyDirFiles($_SERVER['DOCUMENT_ROOT']. $arrivalObj['from'], $_SERVER['DOCUMENT_ROOT']. $arrivalObj['to'], true, true);
        }

        return true;
    }

    function unInstallFiles()
    {

        if($this->isDev){
            foreach ($this->arrivalObjs as $arrivalObj){
                $arrivalObj['from'] = str_replace('#module_id#', $this->MODULE_ID, $arrivalObj['from']);
                $arrivalObj['to'] = str_replace('#module_id#', $this->MODULE_ID, $arrivalObj['to']);
                DeleteDirFilesEx($arrivalObj['from']);
                if($arrivalObj['is_path'])
                    CheckDirPath($arrivalObj['from']);

                CopyDirFiles($_SERVER['DOCUMENT_ROOT']. $arrivalObj['to'], $_SERVER['DOCUMENT_ROOT']. $arrivalObj['from'], true, true);
            }
        }

        foreach ($this->arrivalObjs as $arrivalObj){
            $arrivalObj['to'] = str_replace('#module_id#', $this->MODULE_ID, $arrivalObj['to']);

            DeleteDirFilesEx($arrivalObj['to']);
        }

        return true;
    }

    function registerListeners(){

        foreach (array_filter($this->eventsHandls, fn ($v) => $v['event'] != '') as $handle){
            $this->eventManager->registerEventHandlerCompatible(
                $handle['module'],
                $handle['event'],
                $this->MODULE_ID,
                $handle['class'],
                $handle['method']
            );
        }
    }

    function unRegisterListeners(){

        foreach (array_filter($this->eventsHandls, fn ($v) => $v['event'] != '') as $handle){
            $this->eventManager->unRegisterEventHandler(
                $handle['module'],
                $handle['event'],
                $this->MODULE_ID,
                $handle['class'],
                $handle['method']
            );
        }

    }

    function registerAgents(){

        foreach (array_filter($this->agents, fn ($v) => $v['classMethod'] != '') as $agent){
            \CAgent::AddAgent($agent['classMethod'], $this->MODULE_ID, $agent['isPeriod'], $agent['interval'], $agent['datecheck'], $agent['active'], $agent['datecheck']);
        }

    }

    function unRegisterAgents(){

        foreach (array_filter($this->agents, fn ($v) => $v['classMethod'] != '') as $agent){
            \CAgent::RemoveAgent($agent['classMethod'], $this->MODULE_ID);
        }

    }


    function installDB()
    {
        Loader::includeModule($this->MODULE_ID);
        $connector = Application::getConnection();

        foreach ($this->tables as $tableName){
            if (!$connector->isTableExists($tableName::getTableName())){
                $tableName::getEntity()->createDbTable();
                $this->onAfterTablesCreate($tableName);
            }
        }
        return true;
    }

    function uninstallDB()
    {
        Loader::includeModule($this->MODULE_ID);
        $connector = Application::getConnection();

        foreach ($this->tables as $tableName){
            if ($connector->isTableExists($tableName::getTableName())){
                $tableConnection = $tableName::getEntity()->getConnection();
                $tableConnection->dropTable($tableName::getTableName());
            }
        }

        return true;
    }

    function onAfterTablesCreate($tableName){
        switch ($tableName){
            default:
                break;
        }
    }

    function createUserFields(){
        $obUserField = new CUserTypeEntity;

        foreach ($this->userFields as $fieldSet){
            $fieldId = $obUserField->add($fieldSet);
            if($fieldId)
                Option::set($this->MODULE_ID, "{$fieldSet['FIELD_NAME']}_ID", $fieldId);
        }
    }

    function deleteUserFields(){
        $obUserField = new CUserTypeEntity;

        foreach ($this->userFields as $fieldSet){
            $fieldId = Option::get($this->MODULE_ID, "{$fieldSet['FIELD_NAME']}_ID");
            if($fieldId)
                $obUserField->delete($fieldId);
        }
    }

}
