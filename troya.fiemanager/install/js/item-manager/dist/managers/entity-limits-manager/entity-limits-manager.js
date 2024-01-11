class EntityLimitsManager{

    regulations;

    constructor(regulations=[]) {

        this.regulations = regulations;

        this.listenEditEvent();

        BX.Troya.EntityLimitsManager.data.push(this);

    }

    listenEditEvent(){

        let userFieldManager;

        BX.Event.EventEmitter.subscribe('BX.UI.EntityEditorField:onLayout', (event) => {

            let params = event.getData()[0];
            if(!params)
                return;

            let id = params._id;
            let regulation = this.regulations.find( x => x.FIELD_CODE == id);

            if(!regulation)
                return;

            setTimeout(() => {

                this.checkFieldLimits(params, regulation);

            }, 300)

        });

        BX.Event.EventEmitter.subscribe('onControlChanged', (event) => {

            for(let regulation of this.regulations){

                userFieldManager = this.parent.getFieldControl(regulation.FIELD_CODE);

                if(!userFieldManager)
                    continue

                this.checkFieldLimits(userFieldManager, regulation);

            }

        });

    }

    setFieldLimits(params, regulation){

        let control = params._wrapper.querySelector('.ui-tile-selector-selector-wrap');

        if(!control)
            return;

        if(control.listened)
            return;

        control.addEventListener('mouseenter', (evt) => {

            this.setDialogSelectFieldLimits(params, regulation);
        })

        control.listened = true;
    }

    checkFieldLimits(params, regulation){
        let control = params._wrapper.querySelector('.ui-tile-selector-selector-wrap');

        if(!control)
            return;

        this.setDialogSelectFieldLimits(params, regulation);

    }

    setDialogSelectFieldLimits(params, regulation){

        let target = params._wrapper.querySelector('.ui-tile-selector-selector-wrap'),
            propInfo = params._settings.schemeElement._data.fieldInfo;

        let dialog = BX.UI.TileSelector.getList().find( x=> x.context == target);
        if(!dialog)
            return;

        this.setEntityDialogCustomizations(dialog, regulation, propInfo);

    }

    setEntityDialogCustomizations(dialog, regulation, propInfo){

        let selectorInstance = BX.Main.selectorManagerV2.getById(dialog.id)
        self = this;

        if(selectorInstance.addDataSwap)
            return;

        selectorInstance.addDataSwap = selectorInstance.addData;
        selectorInstance.addData = async function (t, e){

            t = await self.onAfterGetData(t, regulation, propInfo);
            console.log(t);
            selectorInstance.addDataSwap(t, e);

        }

        if(selectorInstance.searchRequestSwap)
            return;

        selectorInstance.searchRequestSwap = selectorInstance.searchRequest;
        selectorInstance.searchRequest = (params) => {

            if(!params.callback.successSwap){
                params.callback.successSwap = params.callback.success;

                params.callback.success = async function (t, s) {

                    t = await self.onAfterGetData(t, regulation, propInfo);

                    console.log(t);
                    return params.callback.successSwap(t, s);
                }
            }
            selectorInstance.searchRequestSwap(params);
        }

    }

    async onAfterGetData(result, regulation, propInfo){

        let entityCode = Object.keys(propInfo.SETTINGS)[0],
            CARD_FIELD = this.parent.getEntityData(),
            FIELD={};

        let entitySplit = entityCode.split('_'),
            entityItems = result.ENTITIES[`${entitySplit[0]}S_${entitySplit[1]}`],
            id,
            condition_resolve,
            changedGroup=[];

        if(!entityItems)
            entityItems = result.ENTITIES[`${entityCode}S`];

        console.log(entityItems);

        if(typeof entityItems != 'object')
            return result;


        let entityIds = Object.values(entityItems.ITEMS).map((x) => {return x.entityId});
        let entityLastIds = typeof entityItems.ITEMS_LAST == 'object' ? Object.values(entityItems.ITEMS_LAST).map((x) => {return parseInt(x.split('_')[1])}) : [];
        let IDs = entityIds.concat(entityLastIds);

        let itemsData = await BX.ajax.runAction('troya:fiemanager.Dynamic.getEntityItems', {
            data: {
                entity : entitySplit[1]??entityCode,
                filter : {
                    ID : IDs
                }
            },
        }).then( await function (response) {
            return response.data;
        }, function (response) {
            console.log(response);
        });

        let newEntityGroup = [];

        for(let i in entityItems.ITEMS){
            id = entityItems.ITEMS[i].entityId;
            FIELD = itemsData[id];
            condition_resolve = eval(regulation.CONDITION);

            if(!condition_resolve){
                if(result.ENTITIES[`${entitySplit[0]}S_${entitySplit[1]}`])
                    delete(result.ENTITIES[`${entitySplit[0]}S_${entitySplit[1]}`].ITEMS[i]);
                else if(result.ENTITIES[`${entityCode}S`])
                    delete(result.ENTITIES[`${entityCode}S`].ITEMS[i]);
            }
        }

        return result;

    }
    
}

BX.ready(() => {
    if(!BX.Troya)
        BX.Troya = {};

    BX.Troya.EntityLimitsManager = EntityLimitsManager;
    BX.Troya.EntityLimitsManager.data = [];

})