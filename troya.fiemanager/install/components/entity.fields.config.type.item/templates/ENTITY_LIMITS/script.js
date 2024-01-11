class configAddManager{

    box;
    form;
    boxEntityPropSelectContext;
    boxValuesContext;
    conditionsContext;
    conditionBtn;

    constructor() {
        this.form = document.querySelector('.ui-form-section');
        this.handleFormButtons();
        this.setConditionBtn();
        this.storeConditionInputFocusPosition();
        this.headleEntityFieldChange();
        this.checkEmptyFields();
    }

    checkEmptyFields(){
        let fieldSelect = this.form.querySelector('[name=FIELD_CODE]');
        if(Array.from(fieldSelect.options).length>0)
            return;

        showNotyMessage('Отсутсвуют пользовательские поля с типом "Диалог сущностей"', () => {
            BX.SidePanel.Instance.close();
        })
    }

    handleFormButtons(){

        this.saveBtn = document.querySelector('.ui-form-section-button-container .save-btn');
        if(this.saveBtn)
            this.saveBtn.addEventListener('click', () => {this.onFormSaveClick();});

        this.cancelBtn = document.querySelector('.ui-form-section-button-container .cancel-btn');
        if(this.cancelBtn)
            this.cancelBtn.addEventListener('click', () => {this.onFormCancelClick();});

        this.deleteBtn = document.querySelector('.ui-form-section-button-container .delete-btn');
        if(this.deleteBtn)
            this.deleteBtn.addEventListener('click', (evt) => {this.onFormDeleteClick(evt);});

    }

    headleEntityFieldChange(){
        this.form.querySelector('[name=FIELD_CODE]').addEventListener('change', (evt) => {
            this.onEntityChange(evt);
        })
    }

    setConditionBtn(){
        let container = this.form.querySelector('.props-here');

        this.conditionBtn = BX.create({
            tag: 'div',
            props: {className: 'ui-btn ui-btn-sm ui-btn-icon-add ui-btn-light-border'},
            text: 'Выбрать условие',
            events: {
                click: () => {this.showPushConditionDialog();}
            }
        })
        container.appendChild(this.conditionBtn);
    }

    storeConditionInputFocusPosition(){
        let conditionInput = this.form.querySelector('[name="CONDITION"]');

        conditionInput.selectPosition = 0;

        conditionInput.addEventListener('focusout', () => {
            conditionInput.selectPosition = conditionInput.selectionStart;
        })

    }

    setValueInLastFocusPosition(value){
        let conditionInput = this.form.querySelector('[name="CONDITION"]');

        let valueStart = conditionInput.value.substr(0, conditionInput.selectPosition);
        let valueEnd = conditionInput.value.substr(conditionInput.selectPosition, conditionInput.value.length);


        conditionInput.value = `${valueStart}${value}${valueEnd}`;
    }


    showPushConditionDialog(){


        this.box = new BX.UI.Dialogs.MessageBox({
            title: 'Новое условие',
            message: this.getNewConditionContext(),
            buttons: BX.UI.Dialogs.MessageBoxButtons.OK_CANCEL,
            okCaption: "Добавить",
            onOk : () => {
                return this.onAddCondition();
            },
            modal: false,
            minWidth: 400,
            maxWidth: 600,
            offsetTop: 50,
            popupOptions: {
                bindElement: this.conditionBtn,
                closeIcon: true,
                cacheable: false,
                events: {
                    onPopupClose: () => {
                        this.box = false;
                    }
                },
            },
        });
        this.checkEntityFieldPropSelectItems();



        this.box.show();
    }

    getNewConditionContext(){

        let entityFieldPropSelector =  this.createFormRow({
            label: 'Поле сущности',
            content: [this.createEntityFieldPropSelect()]
        });

        let entityFieldConditionIssue = this.createFormRow({
            label: 'Условие',
            content: [this.createEntityFieldConditionIssue()]
        });

        let entityFieldPropValues = this.createFormRow({
            label: 'Значение',
            content: [this.createEntityFieldPropValues()]
        });

        entityFieldPropSelector.style.width = '40%';
        entityFieldConditionIssue.style.width = '20%';
        entityFieldPropValues.style.width = '40%';

        let condidion = BX.create({
            tag: 'form',
            attrs: {
                className: 'ui-form',
                style: 'padding: 0;',
            },
            children:[
                BX.create({
                   tag: 'div',
                   attrs: {
                       className : 'ui-form-row',
                   },
                   children: [
                       BX.create({
                           tag: 'div',
                           attrs: {className:'ui-ctl ui-ctl-checkbox'},
                           children: [
                                BX.create({
                                    tag: 'input',
                                    attrs: {className:'ui-ctl-element', type: 'checkbox'},
                                    events: {
                                        click: (evt) => {
                                            this.onEntityFieldEntriesChange(evt);
                                        }
                                    }
                                }),
                               BX.create({
                                   tag: 'div',
                                   attrs: {className: 'ui-ctl-label-text', style: 'text-wrap:nowrap;'},
                                   text: 'В условие записать значение поля краточки сущности',
                                   events: {
                                       click: (evt) => {
                                            evt.target.parentNode.childNodes[0].click();
                                       }
                                   }
                               })
                           ]
                       })
                   ]
                }),
                BX.create({
                    tag: 'div',
                    attrs: {
                        className: 'ui-form-row-inline'
                    },
                    children: [
                        entityFieldPropSelector,
                        entityFieldConditionIssue,
                        entityFieldPropValues,
                    ]
                })
            ]
        })

        return condidion;
    }

    createFormRow(options){

        return BX.create({
            tag: 'div',
            attrs: {
                className: 'ui-form-row'
            },
            children:[
                BX.create({
                    tag: 'div',
                    attrs: {
                        className: 'ui-form-label', style : options.label ==''? 'display:none;' : '',
                    },
                    children: [
                        BX.create({
                            tag: 'div',
                            attrs: {
                                className: 'ui-ctl-label-text',
                            },
                            text: options.label
                        })
                    ]
                }),
                BX.create({
                    tag: 'div',
                    attrs: {
                        className: 'ui-form-content',
                    },
                    children: options.content
                })
            ]
        });

    }

    createEntityFieldConditionIssue(){
        let conditionsContext = BX.create({
            tag: 'div',
            attrs: {
                className: 'ui-ctl ui-ctl-after-icon ui-ctl-dropdown ui-ctl-w100'
            },
            children: [
                BX.create({
                    tag: 'div',
                    attrs: {
                        className:'ui-ctl-after ui-ctl-icon-angle'
                    }
                }),
                BX.create({
                    tag: 'select',
                    attrs: {
                        className:'ui-ctl-element', name: 'ISSUE'
                    },
                    children: [
                        BX.create({
                            tag: 'option',
                            attrs: {
                                value: '=='
                            },
                            text: '=='
                        }),
                        BX.create({
                            tag: 'option',
                            attrs: {
                                value: '!='
                            },
                            text: '!='
                        }),
                        BX.create({
                            tag: 'option',
                            attrs: {
                                value: '>'
                            },
                            text: '>'
                        }),
                        BX.create({
                            tag: 'option',
                            attrs: {
                                value: '>='
                            },
                            text: '>='
                        }),
                        BX.create({
                            tag: 'option',
                            attrs: {
                                value: '<'
                            },
                            text: '<'
                        }),
                        BX.create({
                            tag: 'option',
                            attrs: {
                                value: '<='
                            },
                            text: '<='
                        })
                    ]
                })
            ]
        });

        this.boxConditionsContext = conditionsContext;

        return conditionsContext;
    }

    createEntityFieldPropSelect(){

        let selectContext = BX.create({
            tag: 'div',
            attrs: {
                className: 'ui-ctl ui-ctl-after-icon ui-ctl-dropdown ui-ctl-w100'
            },
            children: [
                BX.create({
                    tag: 'div',
                    attrs: {
                        className:'ui-ctl-after ui-ctl-icon-angle'
                    }
                }),
                BX.create({
                    tag: 'select',
                    attrs: {
                        className:'ui-ctl-element', name: 'FIELD'
                    },
                })
            ]
        });

        this.boxEntityPropSelectContext = selectContext;

        return selectContext;
    }

    checkEntityFieldPropSelectItems(){
        let option = Array.from(this.form.querySelector('[name=FIELD_CODE]').selectedOptions)[0],
            select = this.boxEntityPropSelectContext.querySelector('select');

        if(option.fields)
            this.setEntityFieldPropSelectItems(select, option.fields);
        else
            this.setEntityFieldPropSelectItemsFromQuery(select, option);
    }

    setEntityFieldPropSelectItemsFromQuery(select, option){

        if(!option.dataset.info)
            return;

        let propInfo = JSON.parse(option.dataset.info),
            entity = Object.values(Object.entries(propInfo.SETTINGS).filter(x => x[1] == 'Y'))[0][0],
            self = this;

        BX.ajax.runAction('troya:fiemanager.Dynamic.getFields', {
            data: {
                entity : entity
            },
        }).then(function (response) {
            if(response.data.fields){
                self.setEntityFieldPropSelectItems(select, response.data.fields);
            }else
                showNotyMessage('Ошибка получения свойств сущности. Обратитесь к администратору.');
        }, function (response) {
            showNotyMessage('Ошибка получения свойств сущности. Обратитесь к администратору.');
        });
    }

    setEntityFieldPropSelectItems(select, fields){
        let option;

        select.innerHTML = '';
        for(let fieldCode in fields){
            option = BX.create({
                tag: 'option',
                attrs: {value : fieldCode},
                text: fields[fieldCode].TITLE,
            })
            option.fieldData = fields[fieldCode];
            select.appendChild(option);
        }

        if(!select.evented){
            select.evented = true;
            select.addEventListener('change', () => {
                this.resetEntityFieldPropValues();
            })
        }


        this.resetEntityFieldPropValues();
    }

    createEntityFieldPropValues(){
        let valuesContext = BX.create({
            tag: 'div',
            attrs: {
                className: 'ui-ctl ui-ctl-textbox ui-ctl-w100'
            },
            children: [
                BX.create({
                    tag: 'div',
                    attrs: {className: 'value-push', style: 'width:100%;'},
                    text: 'Необходимо выбрать поле сущности'
                }),
            ]
        });

        this.boxValuesContext = valuesContext;

        return valuesContext;
    }

    resetEntityFieldPropValues(){
        let option = this.boxEntityPropSelectContext.querySelector('select').selectedOptions[0];

        option.fieldData.CODE = 'VALUE';
        option.fieldData.MULTIPLE = false;

        let fieldEditor = new CoolFieldEditor(option.fieldData);

        let context = this.boxValuesContext.querySelector('.value-push');
        context.innerHTML = '';

        context.appendChild(fieldEditor.element);
    }


    onEntityFieldEntriesChange(evt){

        if(evt.target.checked){

            let items = [];
            for(let i in window.addManagerFields){
                items.push({
                    ID: `CARD_FIELD["${i}"]`,
                    VALUE: window.addManagerFields[i].TITLE,
                })
            }

            let fieldEditor = new CoolFieldEditor({
                TYPE: 'enumeration',
                ITEMS: items,
                CODE: 'VALUE',
                MULTIPLE: false,
            });

            let context = this.boxValuesContext.querySelector('.value-push');
            context.innerHTML = '';
            context.appendChild(fieldEditor.element);

        }else{
            this.resetEntityFieldPropValues();
        }

    }


    onAddCondition(){
        let conditionForm = this.box.popupWindow.contentContainer.querySelector('form');

        let formData = new FormData(conditionForm),
            data ={},
            input,
            error = false;

        for(let [name, value] of formData)
        {
            input = conditionForm.querySelector(`[name="${name}"]`);

            if(value == ''){

                input.closest('.ui-ctl').classList.add('ui-ctl-danger');
                error=true;

                if(!input.changel){
                    input.changel = true;
                    input.addEventListener('change', (evt) => {
                        evt.target.closest('.ui-ctl').classList.remove('ui-ctl-danger');
                    })
                }

            }

            data[name] = value;
        }

        if(error)
            return false;

        if(typeof data["VALUE"] == 'string' && !data["VALUE"].startsWith('CARD_FIELD'))
            data["VALUE"] = `"${data["VALUE"]}"`;

        let condition = `FIELD["${data["FIELD"]}"]  ${data["ISSUE"]}  ${data["VALUE"]}`;
        let conditionInput = this.form.querySelector('[name="CONDITION"]');
        conditionInput.value = conditionInput.value+" "+condition;

         return true;
    }

    onEntityChange(evt){

    }


    checkFormErrors(){
        let fieldSelect = this.form.querySelector('[name=FIELD_CODE]');
        if(Array.from(fieldSelect.options).length>0)
            return;

        showNotyMessage('Пользовательские поля с типом "Строка" отсутствуют или ко всем доступым полям уже применены правила.', () => {
            BX.SidePanel.Instance.close();
        })
    }


    onFormSaveClick(){
        let formData = new FormData(this.form),
            data ={},
            input,
            error = false;

        for(let [name, value] of formData)
        {
            input = this.form.querySelector(`[name=${name}]`);

            if(input.required && value == ''){

                input.parentNode.classList.add('ui-ctl-danger');
                error=true;

                if(!input.changel){
                    input.changel = true;
                    input.addEventListener('change', (evt) => {
                        evt.target.parentNode.classList.remove('ui-ctl-danger');
                    })
                }

            }

            data[name] = value;
        }

        if(error)
            return;

        BX.ajax.runAction('troya:fiemanager.EntityLimits.save', {
            data: {
                fields : data
            },
        }).then(function (response) {
            if(response.data.id)
                BX.SidePanel.Instance.close();
            else
                showNotyMessage('Ошибка сохранения. Обратитесь к администратору.');
	    }, function (response) {
            showNotyMessage('Ошибка сохранения. Обратитесь к администратору.');
        });
    }

    onFormDeleteClick(evt){
        showNotyMessage('Удалить правило?', () => {
            BX.ajax.runAction('troya:fiemanager.EntityLimits.delete', {
                data: {
                    id : evt.target.dataset.id
                },
            }).then(function (response) {
                if(response.data.success)
                    BX.SidePanel.Instance.close();
                else
                    showNotyMessage('Ошибка удаления. Обратитесь к администратору.');

            }, function (response) {
                showNotyMessage('Ошибка сохранения. Обратитесь к администратору.');
            });
        });
    }

    onFormCancelClick(){
        BX.SidePanel.Instance.close();
    }
}

BX.ready(() => {
    BX.UI.ConfigAddManager = new configAddManager();
})