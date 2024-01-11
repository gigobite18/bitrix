class CoolFieldEditor{
    constructor(options) {
        this.options = options;

        if(this.options.MULTIPLE == undefined)
            this.options.MULTIPLE = this.options.ATTRIBUTES.includes('MUL');

        if(this.options.CODE)
            this.options.CODE = this.options.MULTIPLE && this.options.TYPE !='enumeration'? `${this.options.CODE}[]` : this.options.CODE;



        this.checkNecessaryClasses();

        this.buildEditor();
    }

    checkNecessaryClasses(){

        try {

            new BX.UI.EntitySelector.TagSelector

        } catch (err) {

            console.log('Нужно подключить расширение ui.entity-selector');

        }

        try {

            new BX.UI.LayoutForm

        } catch (err) {

            console.log('Нужно подключить расширение ui.layout-form');

        }

    }

    buildEditor(){
        switch (this.options.TYPE){
            case "user":
            case "employee":
                this.createEntityDialogEditor({
                    context: 'MY_MODULE_CONTEXT',
                    entities: [
                        {
                            id: 'user',
                        },
                        {
                            id: 'meta-user',
                        },
                    ],
                    recentTabOptions: {
                        visible : false,
                    },
                    dropdownMode: true
                });
                break;

            case "date":
                this.createDateEditor();
                break;

            case "datetime":
                this.createDatetimeEditor();
                break;

            case "boolean":
                this.createBoolEditor();
                break;

            case "integer":
                this.createIntegerEditor();
                break;

            case "enumeration":
                this.createEnumerationEditor();
                break;

            case "crm_company":
                this.createEntityDialogEditor({
                    context: 'CRM_ENTITIES',
                    entities: [
                        {
                            id: 'company',
                            searchable: true,
                            dynamicLoad: true,
                            dynamicSearch: true,
                            searchFields: [
                                {
                                    name : 'TITLE'
                                }
                            ],
                        },
                    ],
                    recentTabOptions: {
                        visible : false,
                    },
                    dropdownMode: true
                });
                break;

            case "crm_contact":
                this.createEntityDialogEditor({
                    context: 'CRM_ENTITIES',
                    entities: [
                        {
                            id: 'contact',
                            searchable: true,
                            dynamicLoad: true,
                            dynamicSearch: true,
                            searchFields: [
                                {
                                    name : 'TITLE'
                                }
                            ],
                        },
                    ],
                    recentTabOptions: {
                        visible : false,
                    },
                    dropdownMode: true
                });
                break;

            case "crm":
                let entity = Object.values(Object.entries(this.options.SETTINGS).filter(x => x[1] == 'Y'))[0][0];
                let splitTry = entity.split('_');
                let options = {};

                if(splitTry[1]){
                    entity = splitTry[0];
                    options.entityTypeId = splitTry[1];
                }

                console.log({
                    context: 'CRM_ENTITIES',
                    entities: [
                        {
                            id: entity,
                            searchable: true,
                            dynamicLoad: true,
                            dynamicSearch: true,
                            searchFields: [
                                {
                                    name : 'title',
                                    type: 'string'
                                }
                            ],
                            addTab: true,
                            options: options
                        },
                    ],
                    recentTabOptions: {
                        visible : false,
                    },
                    dropdownMode: true
                });
                this.createEntityDialogEditor({
                    context: 'CRM_ENTITIES',
                    entities: [
                        {
                            id: entity,
                            searchable: true,
                            dynamicLoad: true,
                            dynamicSearch: true,
                            searchFields: [
                                {
                                    name : 'title',
                                    type: 'string'
                                }
                            ],
                            addTab: true,
                            options: options
                        },
                    ],
                    recentTabOptions: {
                        visible : false,
                    },
                    dropdownMode: true
                });
                break;


            default:
                this.createTextEditor();
                break;
        }
    }

    createEntityDialogEditor(dialogOptions){

        let setInput = function(props){

            let isMulty = props.target.multiple;
            let container = props.target.getContainer();

            for(let input of Array.from(container.querySelectorAll(`[name="${props.target.id}"]`))){
                input.remove();
            }

            for(let tag of props.target.getTags()){

                container.appendChild(BX.create({
                    tag: 'input',
                    attrs: {name: props.target.id, value : tag.getId(), type: 'hidden'}
                }));

            }

            if(Array.from(container.querySelectorAll(`[name="${props.target.id}"]`)).length == 0)
                container.appendChild(BX.create({
                    tag: 'input',
                    attrs: {name: props.target.id, value : '', type: 'hidden'}
                }));

        }

        let selector = new BX.UI.EntitySelector.TagSelector({
            multiple: this.options.MULTIPLE,
            dialogOptions: dialogOptions,
            id: this.options.CODE,
            events: {
                onAfterTagAdd: function(event){
                    setInput(event);
                },
                onTagRemove: function(event){
                    setInput(event);
                }
            }
        });

        selector.getContainer().appendChild(BX.create({
            tag: 'input',
            attrs: {name: selector.id, value : '', type: 'hidden'}
        }));

        let element = BX.create({
            tag: 'div',
            attrs: {className: 'ui-ctl'}
        })

        selector.renderTo(element);

        this.element = element;
        this.control = selector;

    }

    createDateEditor(){

        let element = BX.create({
            tag: 'div',
            attrs: {className: 'ui-ctl'},
            children: [
                BX.create({
                    tag: 'div',
                    attrs: {className : 'ui-ctl-after ui-ctl-icon-calendar'},
                }),
                BX.create({
                    tag: 'input',
                    attrs: {className : 'ui-ctl-element', type: 'text', readonly: true, name: this.options.CODE},
                    events: {
                        click: (evt) => {
                            BX.calendar({node: evt.target, field: evt.target, bTime: false});
                        }
                    }
                })
            ]

        });

        if(this.options.MULTIPLE)
            element = this.propcessMultiple(element);

        this.element = element;
        this.control = null;

    }

    createDatetimeEditor(){

        let element = BX.create({
            tag: 'div',
            attrs: {className: 'ui-ctl'},
            children: [
                BX.create({
                    tag: 'div',
                    attrs: {className : 'ui-ctl-after ui-ctl-icon-calendar'},
                }),
                BX.create({
                    tag: 'input',
                    attrs: {className : 'ui-ctl-element', type: 'text', readonly: true, name: this.options.CODE},
                    events: {
                        click: (evt) => {
                            BX.calendar({node: evt.target, field: evt.target, bTime: true});
                        }
                    }
                })
            ]

        });

        if(this.options.MULTIPLE)
            element = this.propcessMultiple(element);

        this.element = element;
        this.control = null;

    }

    createBoolEditor(){

        let element = BX.create({
            tag: 'div',
            attrs: {className: 'ui-ctl'},
            children: [
                BX.create({
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
                                className:'ui-ctl-element', name: this.options.CODE
                            },
                            children: [
                                BX.create({
                                    tag: 'option',
                                    attrs: {
                                        value: '1'
                                    },
                                    text: 'Да'
                                }),
                                BX.create({
                                    tag: 'option',
                                    attrs: {
                                        value: '0'
                                    },
                                    text: 'Нет'
                                }),
                            ]
                        })
                    ]
                })
            ]

        });

        this.element = element;
        this.control = null;

    }

    createIntegerEditor(){

        let element = BX.create({
            tag: 'div',
            attrs: {className: 'ui-ctl'},
            children: [
                BX.create({
                    tag: 'input',
                    attrs: {className : 'ui-ctl-element', type: 'number', name: this.options.CODE},
                })
            ]
        });

        if(this.options.MULTIPLE)
            element = this.propcessMultiple(element);

        this.element = element;
        this.control = null;
    }

    createTextEditor(){

        let element = BX.create({
            tag: 'div',
            attrs: {className: 'ui-ctl'},
            children: [
                BX.create({
                    tag: 'input',
                    attrs: {className : 'ui-ctl-element', type: 'text', name: this.options.CODE},
                })
            ]
        });

        if(this.options.MULTIPLE)
            element = this.propcessMultiple(element);

        this.element = element;
        this.control = null;

    }

    createEnumerationEditor(items){

        let element = BX.create({
            tag: 'div',
            attrs: {className: 'ui-ctl'},
            children: [
                BX.create({
                    tag: 'div',
                    attrs: {
                        className: this.options.MULTIPLE? 'ui-ctl ui-ctl-multiple-select ui-ctl-w100' : 'ui-ctl ui-ctl-after-icon ui-ctl-dropdown ui-ctl-w100'
                    },
                    children: [
                        BX.create({
                            tag: 'div',
                            attrs: {
                                className:'ui-ctl-after ui-ctl-icon-angle', style :  this.options.MULTIPLE? 'display:none' : ''
                            }
                        }),
                        BX.create({
                            tag: 'select',
                            attrs: {
                                className:'ui-ctl-element', name: this.options.CODE, multiple: this.options.MULTIPLE
                            },
                            children: this.options.ITEMS.map((x) => {
                                return BX.create({
                                    tag: 'option',
                                    attrs: {
                                        value: x.ID
                                    },
                                    text: x.VALUE
                                })
                            })
                        })
                    ]
                })
            ]
        })

        this.element = element;
        this.control = null;

    }

    propcessMultiple(singleElement){


        return  BX.create({
            tag: 'div',
            attrs: {className : 'multiple-container'},
            children: [
                BX.create({
                    tag: 'div',
                    attrs: {className: 'items'},
                    children: [
                        singleElement
                    ]
                }),
                BX.create({
                    tag: 'div',
                    attrs: {className:'ui-btn ui-btn-sm ui-btn-icon-add', style: 'margin-top: 6px;'},
                    events: {
                        click: (evt) => {
                            let list = evt.target.parentNode.querySelector('.items');
                            let clone = singleElement.cloneNode(true);
                            clone.appendChild(BX.create({
                                tag: 'div',
                                attrs: {className: 'popup-window-close-icon', style: 'z-index: 4; right: 0px;top:-4px;'},
                                events: {
                                    click: () => {
                                        clone.remove();
                                    }
                                }
                            }));

                            list.appendChild(clone);
                        }
                    }
                })
            ]
        })
    }
}