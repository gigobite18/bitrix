class ItemManager{

    constructor(conf, fields) {

        if(typeof conf != 'object')
            return;

        this.conf = conf;
        BX.Troya.ItemManager.fields = fields;
        this.managers = {};
        this.crmObjects = {};


        this.defineManagers();
        this.listenEditorBuild();


        BX.Troya.ItemManager.data.push(this);

    }


    listenEditorBuild(){
        BX.Event.EventEmitter.subscribe('BX.Crm.EntityEditor:onInit', (event) => {

            let params = event.getData();
            this.crmObjects.EntityEditor = params[0];

            this.correctEditorSaveAction();

        });
    }

    correctEditorSaveAction(){

        let canSave,
            swap = this;

        let editor = this.getEntityEditor();

        if(editor.performSaveActionSwap)
            return;

        editor.performSaveActionSwap = editor.performSaveAction;

        editor.performSaveAction = (action) => {

            canSave = true;

            for(let i in this.managers){

                if(typeof this.managers[i].validate != 'function')
                    continue;


                if(!this.managers[i].validate())
                    canSave = false;

            }

            if(canSave)
                editor.performSaveActionSwap(action);

        }
    }

    defineManagers(){

        let managers = {
            'list_limits' : 'BX.Troya.ListLimitsManager',
            'blocks' : 'BX.Troya.BlocksManager',
            'requirements' : 'BX.Troya.RequirementsManager',
            'string_fillment' : 'BX.Troya.StringFillmentManager',
            'entity_limits' : 'BX.Troya.EntityLimitsManager',
        }

        for(let i in this.conf){

            try {
                eval(`this.managers[i] = new ${managers[i]}(this.conf[i]);`);
                this.managers[i].parent = this;
            }catch (e) {
                continue;
            }

        }
    }

    getEntityData(){

        let data = Object.assign({}, BX.Crm.EntityEditor.defaultInstance._model.getData()),
            item = false,
            control,
            multipleFields= {};

        for(let i in data){

            if(typeof data[i] == 'object' && data[i] != null){

                data[i] = typeof data[i].VALUE == 'undefined' ? '' : data[i].VALUE;

            }
        }

        let formData = new FormData(document.querySelector('.crm-entity-card-container').querySelector('form'));

        for(let [name, value] of formData)
        {
            control = BX.Crm.EntityEditor.defaultInstance.getControlById(name);

            if(name.endsWith('[]') && !control){
                name = name.split('[]')[0];
                if(!multipleFields[name])
                    multipleFields[name] = [];

                multipleFields[name].push(value);

            } else if(control){
                item = this.getEntityEditor()._formElement.querySelector(`[name="${name}"]`);
                if(!item)
                    continue;

                if(item.tagName == 'SELECT' && item.multiple)
                    data[name] = Array.from(item.selectedOptions).map((x) => {return x.value});
                else
                    data[name] = value;
            }


        }

        for(let name in multipleFields){
            data[name] = multipleFields[name];
        }

        return data;
    }

    getInitialData(){
        let data = Object.assign({}, BX.Crm.EntityEditor.defaultInstance._model.getData()),
            item = false,
            control;

        for(let i in data){

            if(typeof data[i] == 'object' && data[i] != null){

                data[i] = typeof data[i].VALUE == 'undefined' ? '' : data[i].VALUE;

            }
        }

        return data;
    }

    getFieldControl(code){
        return this.getEntityEditor().getControlById(code);
    }

    getEntityEditor(){
        let editor = BX.Crm.EntityEditor.defaultInstance;

        if(!editor)
            editor = this.crmObjects.EntityEditor;
        else
            this.crmObjects.EntityEditor = editor;

        return editor;
    }

    showFieldError(code, error){

        let control = this.getFieldControl(code);

        if(!control)
            return false;

        if (control._mode === BX.UI.EntityEditorMode.edit) {
            control.showError(error);
            control.focus();
        } else if (!control.isReadOnly()) {
            control.setMode(BX.UI.EntityEditorMode.edit, {
                notify: true
            });
            control.refreshLayout({
                callback: function() {

                }
            })

            control.showError(error);
            control.focus();
        }
    }
}

BX.ready(() => {
    if(!BX.Troya)
        BX.Troya = {};

    BX.Troya.ItemManager = ItemManager;
    BX.Troya.ItemManager.data = [];

    document.body.appendChild(BX.create({
        tag: 'div',
        attrs: {className: 'ui-btn ui-btn-icon-tariff', style: "position:absolute;top:0;right:0;"},
        events: {
            click: () => {
                BX.SidePanel.Instance.reload();
            }
        }
    }))
})