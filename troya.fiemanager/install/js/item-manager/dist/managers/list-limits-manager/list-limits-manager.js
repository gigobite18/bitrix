class ListLimitsManager{

    regulations;

    constructor(regulations=[]) {

        this.regulations = regulations;

        this.listenEditEvent();

        BX.Troya.ListLimitsManager.data.push(this);

    }

    listenEditEvent(){

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
            this.checkAllRequlations();
        });

        BX.Event.EventEmitter.subscribe('BX.Crm.EntityEditor:onControlModeChange', (event) => {
            this.checkAllRequlations();
        });

        BX.Event.EventEmitter.subscribe('BX.Crm.EntityEditor:onControlChange', (event) => {
            this.checkAllRequlations();
        });

    }

    checkAllRequlations(){

        let userFieldManager;

        for(let regulation of this.regulations){

            userFieldManager = this.parent.getFieldControl(regulation.FIELD_CODE);

            if(!userFieldManager)
                continue

            this.checkFieldLimits(userFieldManager, regulation);

        }
    }

    checkFieldLimits(params, regulation){

        if(params.listening)
            return;

        params.listening = true;

        let control = params._wrapper,
            changed = false;

        if(control.querySelector('.enumeration.enumeration-checkbox.field-item'))
            changed = this.setCheckboxSelectFieldLimits(params, regulation);

        else if(control.querySelector('.main-ui-control.main-ui-select'))
            changed = this.setUISelectFieldLimits(params, regulation);

        else if(control.querySelector('.main-enum-dialog-input'))
            changed = this.setDialogSelectFieldLimits(params, regulation);

        else if(control.querySelector('.main-ui-select'))
            changed = this.setUI2SelectFieldLimits(params, regulation);

        else if(control.querySelector('select'))
            changed = this.setSelectFieldLimits(params, regulation);

        else
            changed = this.setPopUpSelectFieldLimits(params, regulation);

        setTimeout(() => {
            params.listening = false;
        }, 1000)
    }

    setSelectFieldLimits(params, regulation){


        try{
            let FIELD = this.parent.getEntityData(),
                index = -1;

            let true_condition = eval(regulation.CONDITION);

            for(let option of Array.from(params._wrapper.querySelector('select').options)){

                index = regulation.ALLOWED_ITEMS.findIndex(x => x == option.value);

                if(index < 0 && option.value != '' && true_condition){
                    option.selected = false;
                    option.disabled = true;
                    option.style.display = 'none';
                }else{
                    option.disabled = false;
                    option.style.display = 'block';
                }

            }
        }catch (e){
            console.log(e);
            return false;
        }


    }

    setCheckboxSelectFieldLimits(params, regulation){

        try{
            let FIELD = this.parent.getEntityData(),
                index = -1;

            let true_condition = eval(regulation.CONDITION);


            for(let checkbox of Array.from(params._wrapper.querySelectorAll('input[type="radio"]'))){

                index = regulation.ALLOWED_ITEMS.findIndex(x => x == checkbox.value);

                if(index < 0 && checkbox.value != '' && true_condition){
                    checkbox.checked = false;
                    checkbox.disabled = true;
                }else{
                    checkbox.disabled = false;
                }

            }


        }catch (e){
            console.log(e);
            return false;
        }


    }

    setUISelectFieldLimits(params, regulation){

        let changed = false;
        try{
            let FIELD = this.parent.getEntityData(),
                index = -1,
                select = params._wrapper.querySelector('.main-ui-square-search').parentNode,
                filteredItems=[];

            let true_condition = eval(regulation.CONDITION);

            if(!params.preitems)
                params.preitems = BX.parseJSON(select.dataset.items);

            for(let option of params.preitems){
                index = regulation.ALLOWED_ITEMS.findIndex(x => x == option.VALUE);
                if(index >= 0 || option.VALUE == '' || !true_condition){
                    filteredItems.push(option);
                }
            }

            select.dataset.items = JSON.stringify(filteredItems);

            this.correctPopupManager(Object.values(filteredItems).map(x => x.VALUE), params._wrapper.querySelector('div.main-ui-control.main-ui-select'));

        }catch (e){
            console.log(e);
            return false;
        }

        return changed;
    }

    setUI2SelectFieldLimits(params, regulation){

        let changed = false;

        try{
            let FIELD = this.parent.getEntityData(),
                index = -1,
                select = params._wrapper.querySelector('.main-ui-select').parentNode,
                filteredItems=[];

            let true_condition = eval(regulation.CONDITION);

            if(!select.dataset.preitems)
                select.preitems = BX.parseJSON(select.dataset.items);

            let items = select.preitems;

            for(let option of items){
                index = regulation.ALLOWED_ITEMS.findIndex(x => x == option.VALUE);
                if(index >= 0 || option.VALUE == '' || !true_condition){
                    filteredItems.push(option);
                }
            }

            changed = BX.parseJSON(select.dataset.items).map(x=>x.VALUE) != filteredItems.map(x=>x.VALUE).join(',');

            select.dataset.items = JSON.stringify(filteredItems);

        }catch (e){
            console.log(e);
            return false;
        }

        return changed;
    }

    setDialogSelectFieldLimits(params, regulation){

        try{
            let FIELD = this.parent.getEntityData(),
                index = -1,
                target = params._wrapper.querySelector('.ui-ctl.ui-ctl-textbox');

            let dialog = BX.UI.EntitySelector.Dialog.getInstances().find( x=> x.targetNode == target);
            if(!dialog)
                return;

            let true_condition = eval(regulation.CONDITION);

            for(let item of dialog.getItems()){
                index = regulation.ALLOWED_ITEMS.findIndex(x => x == item.id);
                if(index < 0 && true_condition){
                    item.setHidden(true);
                    if(item.selected)
                        item.deselect();
                }else{
                    item.setHidden(false);
                }
            }

        }catch (e){
            console.log(e);
            return false;
        }


    }

    setPopUpSelectFieldLimits(params, regulation){

        let changed = false;

        try{
            let FIELD = this.parent.getEntityData(),
                index = -1,
                swapItems=[];

            if(!params.__items)
                params.__items = params._items;


            let true_condition = eval(regulation.CONDITION);

            if(typeof params.__items != 'object')
                return;

            for(let item of Object.values(params.__items)){
                index = regulation.ALLOWED_ITEMS.findIndex(x => x == item.VALUE);
                if((index >= 0 && true_condition) || !true_condition){
                    swapItems.push(item);
                }
            }

            changed = params._items.map(x=>x.VALUE).join(',') != swapItems.map(x=>x.VALUE).join(',');

            params._items = swapItems;

        }catch (e){
            console.log(e);
            return false;
        }

        return changed;
    }


    correctPopupManager(ids, terget){
        let popup = Object.values(BX.Main.PopupManager._popups).find(x=>x.bindElement == terget);

        if(!popup)
            return;

        let items = Array.from(popup.contentContainer.querySelectorAll('.main-ui-select-inner-item')),
            data,
            index,
            multiple=true;

        if(items[0])
            multiple = BX.parseJSON(items[0].dataset.item).VALUE != '';


        for(let item of items){
            data = BX.parseJSON(item.dataset.item);
            index = ids.findIndex(x => x == data.VALUE);
            if(index>=0){
                item.style.display = 'block';
            }else{
                item.style.display = 'none';
                if(item.classList.contains('main-ui-checked')){
                    if(multiple)
                        item.dispatchEvent(new Event('mousedown'));
                    else
                        items[0].dispatchEvent(new Event('mousedown'));

                }

            }
        }

    }
}

BX.ready(() => {
    if(!BX.Troya)
        BX.Troya = {};

    BX.Troya.ListLimitsManager = ListLimitsManager;
    BX.Troya.ListLimitsManager.data = [];

})