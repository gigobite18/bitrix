class CategoriedEntitySellectorSettings{


    constructor() {
        this.fields = configuratorEntityFields;
        this.list = document.querySelector('.categoried-entity-configuration .list');
        this.bindAddConfigurationBtn();
    }

    bindAddConfigurationBtn(){
        let self = this;

        this.addConfigurationBtn = document.querySelector('.categoried-entity-configuration .config-add');

        this.addConfigurationBtnDialog = new BX.UI.EntitySelector.Dialog({
            targetNode: this.addConfigurationBtn,
            context: 'categoried-entity-configuration-add-btn',
            recentTabOptions: {
                visible : false
            },
            items:  Object.values(this.fields).map((x) => {
                return {
                    id: x.CODE,
                    entityId: x.CODE,
                    title: x.TITLE,
                    tabs: ['LIST'],
                }
            }),
            enableSearch: true,
            tabs:[
                {
                    id: 'LIST',
                    title: '',
                    itemOrder: {title:'asc'},
                    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiMwMDAwMDAiIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDMyIDMyIiB2ZXJzaW9uPSIxLjEiPg0KICAgIDxwYXRoIGQ9Ik0xNS45OTIgMmMzLjM5NiAwIDYuOTk4IDIuODYgNi45OTggNC45OTV2NC45OTdjMCAxLjkyNC0wLjggNS42MDQtMi45NDUgNy4yOTMtMC41NDcgMC40My0wLjgzMSAxLjExNS0wLjc0OSAxLjgwNyAwLjA4MiAwLjY5MiAwLjUxOCAxLjI5MSAxLjE1MSAxLjU4Mmw4LjcwMyA0LjEyN2MwLjA2OCAwLjAzMSAwLjgzNCAwLjE2IDAuODM0IDEuMjNsMC4wMDEgMS45NTItMjcuOTg0IDAuMDAydi0yLjAyOWMwLTAuNzk1IDAuNTk2LTEuMDQ1IDAuODM1LTEuMTU0bDguNzgyLTQuMTQ1YzAuNjMtMC4yODkgMS4wNjUtMC44ODUgMS4xNDktMS41NzNzLTAuMTkzLTEuMzctMC43MzMtMS44MDNjLTIuMDc4LTEuNjY4LTMuMDQ2LTUuMzM1LTMuMDQ2LTcuMjg3di00Ljk5N2MwLjAwMS0yLjA4OSAzLjYzOC00Ljk5NSA3LjAwNC00Ljk5NXpNMTUuOTkyLTBjLTQuNDE2IDAtOS4wMDQgMy42ODYtOS4wMDQgNi45OTZ2NC45OTdjMCAyLjE4NCAwLjk5NyA2LjYwMSAzLjc5MyA4Ljg0N2wtOC43ODMgNC4xNDVzLTEuOTk4IDAuODktMS45OTggMS45OTl2My4wMDFjMCAxLjEwNSAwLjg5NSAxLjk5OSAxLjk5OCAxLjk5OWgyNy45ODZjMS4xMDUgMCAxLjk5OS0wLjg5NSAxLjk5OS0xLjk5OXYtMy4wMDFjMC0xLjE3NS0xLjk5OS0xLjk5OS0xLjk5OS0xLjk5OWwtOC43MDMtNC4xMjdjMi43Ny0yLjE4IDMuNzA4LTYuNDY0IDMuNzA4LTguODY1di00Ljk5N2MwLTMuMzEtNC41ODItNi45OTUtOC45OTgtNi45OTV2MHoiIHN0eWxlPSImIzEwOyAgICBmaWxsOiAjQUJCMUI4OyYjMTA7Ii8+DQo8L3N2Zz4='
                }
            ],
            events: {
                'Item:onSelect': (event) => {
                    let data = event.getData().item;

                    self.tagSelector = event.target.tagSelector;
                    self.tagSelector.getContainer().querySelector('.ui-tag-selector-tag-remove').click();

                    self.popUp = self.tagSelector.getContainer().closest('.popup-window');

                    self.onConfigAddSelect(data);
                },

            }
        })

       this.addConfigurationBtn.addEventListener('click', () => {this.addConfigurationBtnDialog.show();});

       this.addConfigurationBtnDialog.show();
    }

    onConfigAddSelect(tag){
        let field = this.fields[tag.id];


        this.addConfigRow(field);

        this.addConfigurationBtnDialog.hide();
    }

    addConfigRow(field, element = {INNER_PROPERTY : '', ID: '', MAIN_PROPERTY:''}){

        if(!element.MAIN_PROPERTY)
            element.MAIN_PROPERTY = field.CODE;

        let self = this,
            selectOptions = [
                BX.create('option', {
                    text: ''
                })
            ];

        for(let i in field.PROPS){

            selectOptions.push(BX.create('option', {
                attrs: {value: field.PROPS[i].CODE, selected : element.INNER_PROPERTY == field.PROPS[i].CODE},
                text: field.PROPS[i].TITLE
            }))

        }

        let row = BX.create('tr', {
            props : {className : 'row'},
            children: [
                BX.create('td', {
                    attrs : {hidden : 'true'},
                    children: [
                        BX.create('input', {
                            attrs: {value: element.ID, name: 'ID'}
                        }),
                        BX.create('input', {
                            attrs: {value: element.MAIN_PROPERTY, name: 'MAIN_PROPERTY'}
                        })
                    ],
                }),
                BX.create('td', {
                    props : {className : 'table-data name col-8'},
                    text: field.TITLE,
                }),
                BX.create('td', {
                    props : {className : 'table-data col-3'},
                    children: [
                        BX.create('select', {
                            attrs: {name: 'INNER_PROPERTY'},
                            props: {className : 'link-select'},
                            children : selectOptions,
                            events: {
                                change : function(event){
                                    self.saveElement(event.target.parentNode.parentNode);
                                }
                            }
                        }),
                        BX.create('div', {
                            props : { className : 'ui-btn ui-btn-sm ui-btn-icon-add delete'},
                            events: {
                                click : function(event){
                                    self.removeElement(event.target.parentNode.parentNode);
                                }
                            }
                        }),
                        BX.create('div', {
                            props : { className : 'error-messages'},
                            children : [
                                BX.create({
                                    tag : 'div',
                                    attrs : {className : 'message item inner-prop-empty'},
                                    text : BX.message('CONFIG_ITEM_EMPTY_INNER_PROP'),
                                }),
                                BX.create({
                                    tag : 'div',
                                    attrs : {className : 'loader item'},
                                    children: [
                                        BX.create({
                                            tag : 'img',
                                            attrs : {src: '/local/components/axioma.customizations/categoried.entity.select.settings/templates/.default/images/loader.svg'},
                                        })
                                    ]
                                })
                            ]
                        })
                    ],
                }),
            ]
        })



        this.list.appendChild(row);
    }

    removeElement(row){
        let data = this.getRowData(row);

        if(!data.ID){
            row.remove();
        }

        row.classList.add('in_load');

        BX.ajax.runComponentAction(
            'axioma.customizations:categoried.entity.select.settings',
            'removeElement',
            {
                mode: 'class',
                data: {
                    data : data
                }
            })
            .then(function(response) {

                row.remove();
                row.classList.remove('in_load');
            });
    }

    saveElement(row){
        let data = this.getRowData(row);

        if(!data.INNER_PROPERTY){
            row.classList.add('inner_prop-empty');
            return;
        }else
            row.classList.remove('inner_prop-empty');

        row.classList.add('in_load');



        BX.ajax.runComponentAction(
            'axioma.customizations:categoried.entity.select.settings',
            'saveElement',
            {
                mode: 'class',
                data: {
                    data : data
                }
            })
            .then(function(response) {
                console.log(response);


                row.classList.remove('in_load');
            });
    }

    getRowData(row){

        return {
            MAIN_PROPERTY : row.querySelector('[name="MAIN_PROPERTY"]').value,
            INNER_PROPERTY :row.querySelector('[name="INNER_PROPERTY"]').value,
            ID : row.querySelector('[name="ID"]').value,
        }
    }
}


BX.ready(() => {
    new CategoriedEntitySellectorSettings();
})