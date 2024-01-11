class copyManagerClient{
    constructor() {
        this.tryInsertSettingsBtn();
        this.getEntityFields();
    }


    tryInsertSettingsBtn(){

        this.settingsBtn = document.querySelector('#uiToolbarContainer .ui-btn-icon-setting');

        if(!this.settingsBtn)
            this.settingsBtn = document.querySelector('.pagetitle-menu .ui-btn-icon-setting');

        if(!this.settingsBtn)
            return;

        let checkTooltipButton = () => {
            let btnText = 'Копировать(troya)';

            let popUp = BX.Main.PopupManager._popups.find(x => x.bindElement == this.settingsBtn);

            if(!popUp)
                return;

            if(popUp.setted)
                return;

            popUp.contentContainer.querySelector('.menu-popup-items').prepend(BX.create({
                tag: 'span',
                attrs: {className:'menu-popup-item menu-popup-no-icon'},
                children: [
                    BX.create({
                        tag: 'span',
                        attrs: {className: 'menu-popup-item-icon'}
                    }),
                    BX.create({
                        tag: 'span',
                        attrs: {className: 'menu-popup-item-text'},
                        text: btnText
                    })
                ],
                events: {
                    click: () => {
                        this.showCopyDialog();
                    }
                }
            }))

            popUp.setted = true;
        }

        this.settingsBtn.addEventListener('click', () => {

            setTimeout(() => {
                checkTooltipButton();
            }, 40)

            setTimeout(() => {
                checkTooltipButton();
            }, 100)
        })
    }

    getEntityFields(){

        let self = this;

        BX.ajax.runAction('troya:smartactions.Dynamic.getFieldsInfo', {
            data: {
                entity_type : window.entity.entity_type
            },
        }).then(function (response) {

            self.fields = response.data;

        }, function (response) {


        });

    }

    showMessage(message){

        BX.UI.Notification.Center.notify({
            content: message,
            position: "top-right"
        });

    }

    getDialogContent(){

        let items = [];

        if(typeof this.fields != 'object')
            this.fields = [];

        for(let fieldCode in this.fields){
            if(this.fields[fieldCode].TYPE == 'crm')
                items.push({
                    tabs: ['list'],
                    id: fieldCode,
                    entityId: 'list',
                    title: this.fields[fieldCode].TITLE,
                })
        }


        let selector = new BX.UI.EntitySelector.TagSelector({
            multiple: 'Y',
            dialogOptions: {
                tabs : [
                    { id : 'list', title: 'Список'}
                ],
                items: items,
                recentTabOptions: {
                    visible:false,
                },
            },
            id: 'CLONE_ITEMS_FIELDS',
            events: {
                onAfterTagAdd: function(event){
                    event.target.setInput(event);
                },
                onTagRemove: function(event){
                    event.target.setInput(event);
                }
            }
        });

        selector.setInput = (event) => {

            let isMulty = event.target.multiple;
            let container = event.target.getContainer();

            for(let input of Array.from(container.querySelectorAll(`[name="${event.target.id}"] option`))){
                input.remove();
            }

            for(let tag of event.target.getTags()){

                container.querySelector(`[name="${event.target.id}"]`).appendChild(BX.create({
                    tag: 'option',
                    attrs: {value : tag.getId(), selected: true}
                }));

            }

        }

        selector.getContainer().appendChild(BX.create({
            tag: 'select',
            attrs: {name: selector.id, hidden: true, multiple: true}
        }));

        this.form = BX.create({
            tag: 'form',
            attrs: {className: 'ui-form', style: 'padding:0;padding-top: 10px;'},
            children: [
                BX.create({
                    tag: 'div',
                    attrs: {className: 'ui-form-row'},
                    children: [
                        BX.create({
                            tag: 'div',
                            attrs: {className: 'ui-form-label'},
                            children: [
                                BX.create({
                                    tag: 'div',
                                    attrs: {className: 'ui-ctl-label-text'},
                                    text: 'Клонировать внутренние элементы полей типа crm:'
                                })
                            ]
                        }),
                        BX.create({
                            tag: 'div',
                            attrs: {className: 'ui-form-content'},
                        })
                    ]
                })
            ]
        });

        selector.renderTo(this.form.querySelector('.ui-form-content'));

        return this.form;
    }

    showCopyDialog(entity){

        this.messageBox = new BX.UI.Dialogs.MessageBox({
            title: 'Копирование',
            message: this.getDialogContent(),
            buttons: BX.UI.Dialogs.MessageBoxButtons.OK,
            okCaption: "Копировать",
            onOk : () => {
                return this.copyEntity(entity);
            },
            modal: false,
            minWidth: 400,
            maxWidth: 600,
            offsetTop: 50,
            popupOptions: {
                bindElement: this.settingsBtn,
                closeIcon: true,
                cacheable: false,
            },
        });

        this.messageBox.show();

    }

    copyEntity(entity){
        let cloneFields = Array.from(this.form.querySelector('[name=CLONE_ITEMS_FIELDS]').selectedOptions).map((x) => {return x.value});

        let self = this;

        BX.ajax.runAction('troya:smartactions.Dynamic.copyEntity', {
            data: {
                entity_type : entity.entity_type,
                entity_id : entity.entity_id,
                cloneFields: cloneFields
            },
        }).then(function (response) {

           if(response.data.id){
               let path = location.pathname.split('/').filter(x=> x);
               path.pop();
               path.push(response.data.id);

               window.open(location.origin+'/'+path.join('/')+'/', '_blank');
           }else
               self.showCopyDialog('Произошла ошибка при создании элемента. Обратитесь к администратору.');

            self.messageBox.close();
        }, function (response) {

            self.showCopyDialog('Произошла ошибка при создании элемента. Обратитесь к администратору.');
        });
    }

}


BX.ready(() => {
    BX.UI.copyManagerClient = new copyManagerClient();
})