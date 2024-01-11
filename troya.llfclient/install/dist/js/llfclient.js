class LLFClient{
    EntityEditor;
    EntityEditorClientLight;
    entityInfo=[];
    entityData=[];

    constructor() {
        this.listenEvents();
    }

    listenEvents(){
        let self = this;

        BX.addCustomEvent('BX.Crm.EntityEditor:onControlModeChange', BX.delegate(function (params, params2) {
            if(params2.control._id != 'CLIENT')
                return;

            self.onClientEditorBuild();
        }));



        BX.addCustomEvent('BX.UI.EntityConfigurationManager:onInitialize', BX.delegate(function(params){
            if(params._id != 'CLIENT')
                return;

            self.onClientFieldLoad(params);
        }))
    }

    onClientEditorBuild(){
        this.EntityEditorClientLight = this.getEntityEditorClientLight();
    }
    onClientFieldLoad(params){

        this.EntityEditor = params._editor;

        this.EntityEditor.switchControlModeSwap = this.EntityEditor.switchControlMode;

        this.EntityEditor.switchControlMode = (control, mode, options) => {
            let result = this.EntityEditor.switchControlModeSwap(control, mode, options);

            if(control._id != 'CLIENT')
                return result;

            this.onFieldModeSwitch(mode, options);

            return result;
        }
    }
    onFieldModeSwitch(mode, options){
        if(mode == 1){
            this.replaceAddContactSearchBoxMethod();
            this.addCompanyChangeListener();
            this.correctContactSearchBoxes();
        }
    }


    addCompanyChangeListener(){

        this.EntityEditorClientLight._companySearchBoxes[0].addChangeListener(() => {
            this.EntityEditorClientLight.removeContactAllSearchBoxes();
        })
    }


    replaceAddContactSearchBoxMethod(){
        let self = this;
        this.EntityEditorClientLight.addContactSearchBoxSwap = this.EntityEditorClientLight.addContactSearchBox;
        this.EntityEditorClientLight.addContactSearchBox = (box, options) => {
            let searchBox = this.EntityEditorClientLight.addContactSearchBoxSwap(box, options);
            this.correctContactSearchBox(searchBox);
            return searchBox;
        }
    }
    correctContactSearchBoxes(){
        let searcBoxes = this.EntityEditorClientLight._contactSearchBoxes;

        for(let i in searcBoxes){
            this.correctContactSearchBox(searcBoxes[i]);
        }
    }
    correctContactSearchBox(searchBox){
        this.correctContactSeatchBoxDropdownItems(searchBox);
        this.correctContactSearchBoxSetItemsMethod(searchBox);

        if(searchBox.alreadyEdited)
            return;

        this.correctContactSearchBoxEndEditEvent(searchBox);


        searchBox.alreadyEdited = true;
    }
    correctContactSeatchBoxDropdownItems(searchBox){

        let contacts = this.getCurrentCompanyContacts();
        if(!contacts)
            return;

        searchBox._searchControl.setItems(contacts);
        searchBox._searchControl.setDefaultItems(contacts);
    }
    correctContactSearchBoxSetItemsMethod(searchBox){
        searchBox._searchControl.setItems = (items) => {

            searchBox._searchControl.items = this.liveOnlyCompanyContact(items);
            if (searchBox._searchControl.popupWindow)
            {
                searchBox._searchControl.renderItemsToInnerContainer();

                searchBox._searchControl.popupWindow.adjustPosition({
                    forceBindPosition: true
                });
            }
        }
    }
    correctContactSearchBoxEndEditEvent(searchBox){
        searchBox._changeButtonHandlerSwap = searchBox._changeButtonHandler;
        searchBox._changeButtonHandler = (param1) => {
            searchBox._changeButtonHandlerSwap(param1);

            this.correctContactSearchBox(searchBox);
        }
    }


    liveOnlyCompanyContact(contacts){
        let companyId = this.getSelectedCompanyId();
        if(!companyId)
            return contacts;

        let companyContactsId = companyContactBinds[companyId].map(item => item.ID);

        return contacts.filter((x) => {
            return companyContactsId.includes(x.id);
        })
    }


    getEntityEditorClientLight(){
        return BX.Crm.EntityEditor.defaultInstance._activeControls.filter(x=> x._id == 'CLIENT').shift();
    }
    getSelectedCompanyId(){
        if(!this.EntityEditorClientLight)
            return false;

        if(!this.EntityEditorClientLight._companyInfos._items[0])
            return false;

        return this.EntityEditorClientLight._companyInfos._items[0]._settings.id;
    }
    getCurrentCompanyContacts(){

        let companyId = this.getSelectedCompanyId();
        if(!companyId)
            return [];

        let availableContacts = companyContactBinds[companyId].filter((x) => {
            return true; selectedItems.includes(parseInt(x.ID)) == false;
        })

        return availableContacts.map((x) => {
            return {
                id: x.ID,
                type: "CONTACT",
                title: x.TITLE,
                module: 'crm',
                subTitle: '',
                actions: [],
                links: {
                    show: x.URL
                },
                attributes: []
            };
        });
    }
}

BX.ready(() => {
    BX.Main.LLFClient = new LLFClient();
})