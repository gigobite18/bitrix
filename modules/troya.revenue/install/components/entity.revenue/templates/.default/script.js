class ElementRevenues{
    container;
    revenues;
    entityId;
    entityTypeId;
    minOffset;
    maxOffset;
    thead;
    tbody;
    docDescs;
    revenueSnipet;
    addBtn;
    saveBtn;
    errors;
    to_remove;


    constructor(revenues, minOffset, maxOffset, entityId, entityTypeId, categories, settings) {
        BX.Main.ElementRevenues = this;
        this.revenues = revenues;
        this.minOffset = minOffset;
        this.entityId = entityId;
        this.entityTypeId = entityTypeId;
        this.maxOffset = maxOffset;
        this.categories = categories;
        this.settings = settings;
        this.container = document.querySelector('.element-revenues');
        this.thead = document.querySelector('.element-revenues thead');
        this.tbody = document.querySelector('.element-revenues tbody');

        this.addBtn = document.querySelector('.element-revenues-buttons .add-product');
        this.addBtn.addEventListener('click', () => {this.addProduct();});
        this.saveBtn = document.querySelector('.element-revenues-buttons .save');
        this.saveBtn.addEventListener('click', () => {this.save();});
        this.addQuartalBtn = document.querySelector('.element-revenues-buttons .add-quartal');
        this.addQuartalBtn.addEventListener('click', () => {this.addQuartal();});
        this.settingsBtn = document.querySelector('.element-revenues-buttons .ui-btn-icon-setting');
        if(this.settingsBtn)
            this.renderSettingsPopUp();

        this.docDescs = {
            1 : 'Акты',
            2 : 'Платежи',
        };
        this.revenueSnipet = {
            ID: false,
            ENTITY_TYPE_ID: this.entitytypeId,
            ENTITY_ID: this.entityId,
            PRODUCT_ID: false,
            DOCUMENT_TYPE: 1,
            QUARTER_PRICES: {},
        }
        this.errors = [];
        this.to_remove = [];

        this.buildRevenuesView();
    }

    buildRevenuesView(){

        let headerBlockSnipet = this.getHeaderBlockSnipet();
        this.thead.innerHTML = '';
        this.thead.appendChild(headerBlockSnipet);

        this.createRevenuesElementsView();
    }


    createRevenuesElementsView(){

        for(let i in this.revenues){
            this.createElementDoc(this.revenues[i]);
        }
    }

    createElementDoc(revenue = this.revenueSnipet){

        let quarters=revenue.QUARTER_PRICES;

        let tds = [
            BX.create({
                tag: 'td',
                attrs: { 'data-type' : 'name'},

                children: [
                    this.getProuctSelectInput(revenue),
                    BX.create({
                        tag: 'input',
                        attrs: {type: 'hidden', name: 'ENTITY_TYPE_ID', value: this.entityTypeId}
                    }),
                    BX.create({
                        tag: 'input',
                        attrs: {type: 'hidden', name: 'ENTITY_ID', value: this.entityId}
                    }),
                    BX.create({
                        tag: 'input',
                        attrs: {type: 'hidden', name: 'DOCUMENT_TYPE', value: revenue.DOCUMENT_TYPE}
                    }),
                ]
            }),
            BX.create({
                tag: 'td',
                attrs: { 'data-type' : 'type'},
                text: this.docDescs[revenue.DOCUMENT_TYPE],
            }),
            BX.create({
                tag: 'td',
                attrs: { 'data-type' : 'summary'},
                children: [
                    BX.create({
                        tag: 'input',
                        attrs: {type: 'number', min: '0', value: revenue.SUMMARY, name: 'SUMMARY', className: 'ui-ctl-element', disabled:true},
                        events: {
                            change : (evt) => {this.onRowSummaryPriceChange(evt)}
                        }
                    }),
                ]
            }),
        ];




        let littleMouse = this.minOffset;

        while(Number(littleMouse) <= Number(this.maxOffset)){

            tds.push(BX.create({
                tag: 'td',
                attrs: { 'data-type' : 'quarter', 'data-quarter' : littleMouse},
                children: [
                    BX.create({
                        tag: 'input',
                        attrs: {type: 'number', min: '0', value: quarters[littleMouse]? quarters[littleMouse] : '', className: 'ui-ctl-element', name: 'QUARTER_PRICES', 'data-quarter' : littleMouse},
                        events: {
                            input : (evt) => {this.onQuarterInput(evt)}
                        }
                    }),
                ],
            }))

            littleMouse = this.getNextYaerQuarterSplit(littleMouse);

        }

        let row = BX.create({
            tag: 'tr',
            children: tds,
            attrs: {'data-type' : revenue.DOCUMENT_TYPE, 'data-id': revenue.ID}
        });

        this.calculateRowSummary(row);

        this.tbody.appendChild(row);
    }


    getProuctSelectInput(quartersAr={PRODUCT_ID: ''}){
        let inputContainer = BX.create({
            tag: 'div',
            attrs: {className: 'product-select'},
            children: [
                BX.create({
                    tag: 'input',
                    attrs: {type: 'hidden', name: 'PRODUCT_ID', value: quartersAr.PRODUCT_ID}
                }),
                BX.create({
                    tag : 'div',
                    attrs: {className: 'ui-btn ui-btn-icon-remove ui-btn-primary'},
                    events: {
                        click : (evt) => {
                            this.removeMainRowElements(evt.target.closest('tr'));
                        }
                    }
                })
            ]
        })
        let seleted = [];

        if(quartersAr.PRODUCT_NAME){
            seleted.push({
                id: quartersAr.PRODUCT_ID,
                entityId: 'product',
                entityType: "default",
                title: quartersAr.PRODUCT_NAME
            });
        }


        let productSelector = new BX.UI.EntitySelector.TagSelector({
            multiple: false,
            showAddButton: true,
            minWidth: '108px',
            dialogOptions: {
                context: 'MY_MODULE_CONTEXT',
                entities: [
                    {
                        "id": "product",
                        "options": {
                            "iblockId": 14,
                            "basePriceId": 1,
                            "currency": "RUB",
                            "restrictedProductTypes": [
                                2
                            ]
                        },
                        "searchable": true,
                        "dynamicLoad": true,
                        "dynamicSearch": true,
                        "filters": []
                    }
                ],
            },
            events: {
                onTagAdd: (event) => {
                    let selector = event.getTarget();
                    let data = event.getData();
                    let input = selector.getAddButton().closest('tr').querySelector('input[name=PRODUCT_ID]');
                    input.value = data.tag.id;
                    this.onProductTagSelectorChange(event);
                },
            },
            items: seleted,
        });
        productSelector.renderTo(inputContainer);

        inputContainer.children[0].tagSelector = productSelector;

        return inputContainer;
    }

    getHeaderBlockSnipet(){
        let ths = [
            BX.create({
                tag: 'th',
                attrs: { 'data-type' : 'name'},
                text: 'Товар',
            }),
            BX.create({
                tag: 'th',
                attrs: { 'data-type' : 'type'},
                text: 'Акт/Платеж',
            }),
            BX.create({
                tag: 'th',
                attrs: { 'data-type' : 'summ'},
                text: 'Сумма по строке',
            })
        ];

        let littleMouse = this.minOffset,
            split = null;

        while(Number(littleMouse) <= Number(this.maxOffset)){

            split = String(littleMouse).split('.');

            ths.push(BX.create({
                tag: 'th',
                attrs: {'data-type' : 'quarter', 'data-quarter' : littleMouse},
                text: `${split[1]} кв. ${split[0]}`,
            }))

            littleMouse = this.getNextYaerQuarterSplit(littleMouse);
        }

        return BX.create({
            tag: 'tr',
            children: ths,
        })
    }



    onProductTagSelectorChange(event){
        let selector = event.getTarget();
        let data = event.getData();
        let row = selector.getAddButton().closest('tr');
        row.setAttribute('changed', true);
        this.saveBtn.hidden = false;
        if(row.dataset.type==1){
            this.setMainTypeProductToOthers(row, event);
        }
    }

    onQuarterInput(evt){
        this.saveBtn.hidden = false;
        let tr = evt.target.closest('tr');
        tr.setAttribute('changed', true);

        this.calculateRowSummary(tr);
    }


    addProduct(){
        let snipet = null;
        this.saveBtn.hidden = false;

        for(let i in this.docDescs){
            snipet = this.revenueSnipet;
            snipet.DOCUMENT_TYPE = i;

            this.createElementDoc(snipet);
        }
    }

    addQuartal(){
        let headRow = this.thead.querySelector('tr'),
            bodyRow = null,
            bRows = Array.from(this.tbody.querySelectorAll('tr')),
            nextQuarter = this.getNextYaerQuarterSplit(this.maxOffset),
            split = String(nextQuarter).split('.');

        headRow.appendChild(BX.create({
            tag: 'th',
            attrs: { 'data-type' : 'quarter', 'data-quarter' : nextQuarter},
            text: `${split[1]} кв. ${split[0]}`,
        }))

        for(let i in bRows){
            bRows[i].appendChild(BX.create({
                tag: 'td',
                attrs: { 'data-type' : 'quarter', 'data-quarter' : nextQuarter},
                children: [
                    BX.create({
                        tag: 'input',
                        attrs: {type: 'number', min: '0', value: '', className: 'ui-ctl-element', name: 'QUARTER_PRICES', 'data-quarter' : nextQuarter},
                        events: {
                            input : (evt) => {this.onQuarterInput(evt)}
                        }
                    }),
                ],
            }))
        }

        this.maxOffset = nextQuarter;
    }

    save(){
        let self = this;
        let dataAr=[];
        let removeAr=this.to_remove;
        let productRows = Array.from(this.tbody.querySelectorAll('tr[changed="true"]:not(.hide)'));

        if(!this.checkErrors())
            return false;

        for (let i in productRows){
            dataAr.push(this.getRowData(productRows[i]));
        }

        this.saveBtn.classList.add('ui-btn-wait');

        if(dataAr || removeAr){
            BX.ajax.runComponentAction('troya:entity.revenue', 'loadData', {
                mode: 'class',
                data: {
                    save : dataAr,
                    remove : removeAr
                }
            }).then(function (data) {
                self.saveBtn.classList.remove('ui-btn-wait');
                self.saveBtn.hidden=true;
                for(let i in productRows){
                    productRows[i].removeAttribute('changed');
                }

            });
        }else{
            self.saveBtn.classList.remove('ui-btn-wait');
            self.saveBtn.hidden=true;
            for(let i in productRows){
                productRows[i].removeAttribute('changed');
            }
        }


    }

    getRowData(row){
        let data = {
            ID : row.dataset.id,
            ENTITY_TYPE_ID : '',
            ENTITY_ID : '',
            PRODUCT_ID : '',
            DOCUMENT_TYPE : '',
            QUARTER_PRICES : {},
            SUMMARY : '',
        };

        let inputs = Array.from(row.querySelectorAll('input'));
        let name = '';
        let value = '';

        for(let i in inputs){
            name = inputs[i].getAttribute('name');
            value = inputs[i].value;
            if(name == 'QUARTER_PRICES'){
                if(value>0 && value!='')
                    data.QUARTER_PRICES[inputs[i].getAttribute('data-quarter')] = value;
            }else if(name in data){
                data[name] = value;
            }
        }
        return data;
    }



    checkErrors(){
        let alert=null;
        this.unsetErrors();
        this.checkMainDocTypesSimilarPrices();
        this.checkDocsSumms();
        this.checkDocsProducts();

        if(this.errors.length==0)
            return true;

        for(let i in this.errors){

            alert = new BX.UI.Alert({
                text: this.errors[i].text,
                inline: true,
                color: BX.UI.Alert.Color.DANGER,
                closeBtn: true,
                animated: true
            });
            alert.renderTo(this.errors[i].object.querySelector('td .product-select'));
        }

        return false;
    }

    unsetErrors(){
        this.errors = [];

        let errorMessages = Array.from(this.tbody.querySelectorAll('.ui-alert.ui-alert-danger'));

        for(let i in errorMessages){
            errorMessages[i].remove();
        }
    }

    checkMainDocTypesSimilarPrices(){
        let rows = Array.from(this.tbody.querySelectorAll('tr[data-type="1"]'));
        let docType = null;
        let docsTypeCount = Object.keys(this.docDescs).length;
        let littleMouse=null;
        let mainSummary=null;
        let mainProduct=null;


        for(let i in rows){
            docType = rows[i];
            mainSummary = rows[i].querySelector('[name=SUMMARY]').value;
            mainProduct = rows[i].querySelector('.ui-tag-selector-tag-title')? rows[i].querySelector('.ui-tag-selector-tag-title').innerText : 'Товар не выбран';
            for(let i in this.docDescs){
                if(i == 1)
                    continue;

                docType = docType.nextElementSibling;

                if(docType.querySelector('[name=SUMMARY]').value != mainSummary)
                    this.errors.push({
                        text : `Сумма по строке должна быть равна сумме по строке документа ${this.docDescs[1]}.`,
                        object : docType,
                    });

            }


        }
    }

    checkDocsSumms(){
        let summaries = Array.from(this.tbody.querySelectorAll(['[name=SUMMARY]']));
        let productName;
        let docType;
        let row;

        for(let i in summaries){

            if(parseFloat(summaries[i].value)<1){

                let row = summaries[i].closest('tr');
                this.errors.push({
                    text : `Сумма по строке должна быть отличной от нуля.`,
                    object : row,
                });
            }

        }
    }

    checkDocsProducts(){
        let rows = Array.from(this.tbody.querySelectorAll('tr'));
        let row;

        for(let i in rows){

            if(!rows[i].querySelector('.ui-tag-selector-tag-title')){
                this.errors.push({
                    text : `Необходимо выбрать товар.`,
                    object : rows[i],
                });
            }

        }
    }



    calculateRowSummary(row){
        let quarters = Array.from(row.querySelectorAll('input[name=QUARTER_PRICES]'));
        let summary = 0;
        for(let i in quarters){
            if(quarters[i].value)
                summary=summary+parseFloat(quarters[i].value);
        }

        row.querySelector('[name=SUMMARY]').value = summary;
    }

    setMainTypeProductToOthers(row, event){

        let selector = event.getTarget();
        let data = event.getData();
        let elements = [row];
        let input = null;
        let nextElement = row;

        for(let i in this.docDescs){
            if(i != 1){
                input = nextElement.querySelector('input[name=PRODUCT_ID]');
                input.value = data.tag.id;
                input.tagSelector.addTag({
                    id: data.tag.id,
                    entityId: data.tag.entityId,
                    entityType: data.tag.entityType,
                    title: data.tag.title.text
                });
            }

            nextElement = nextElement.nextElementSibling;
        }
    }

    removeMainRowElements(row){
        let nextElement = row;
        let previusElement = row;

        for(let i in this.docDescs){
            previusElement = nextElement;
            nextElement = nextElement.nextElementSibling;
            previusElement.classList.add('hide');

            if(previusElement.dataset.id != undefined)
                this.to_remove.push(previusElement.dataset.id);
        }

        this.saveBtn.hidden = false;
    }

    getNextYaerQuarterSplit(quarter){
        let split = String(quarter).split('.'),
            nextYear=null,
            nextQuarter=null,
            nextYaerQuarterSplit;

        if(split[1]==4){
            nextYear=Number(split[0])+1;
            nextYaerQuarterSplit=nextYear+'.'+1;
        }else{
            nextQuarter=Number(split[1])+1;
            nextYaerQuarterSplit=split[0]+'.'+nextQuarter;
        }

        return nextYaerQuarterSplit;
    }



    renderSettingsPopUp(){

        this.settingsPopup = new BX.PopupWindow(false, this.settingsBtn, {
            content: this.createSettingsContent(),
            titleBar: 'Настройки обязательности заполнения в разных воронках',
            minWidth:'300px',
            zIndex: 0,
            offsetLeft: 0,
            offsetTop: 0,
            closeByEsc: true,
            autoHide: true,
            draggable: true,
            resizable: true,
        });

        this.settingsBtn.addEventListener('click', () => {this.settingsPopup.show()})

    }

    createSettingsContent(){
        let options = [],
            selects = [];

        for(let i in this.categories){
            options = [];

            for(let stageCode in this.categories[i].STAGES){
                options.push(BX.create({
                    tag: 'option',
                    attrs: {value : stageCode, selected : this.settings[`CATEGORY_${i}`] == stageCode},
                    text: this.categories[i].STAGES[stageCode]
                }))
            }

            selects.push(BX.create({
                tag: 'div',
                attrs: {className:'category'},
                children:[
                    BX.create({
                        tag: 'div',
                        attrs: {className: 'name'},
                        text: this.categories[i].CATEGORY_NAME
                    }),
                    BX.create({
                        tag: 'select',
                        attrs: {className: 'ui-ctl-element', 'multiple' : false, name: `CATEGORY_${this.categories[i].CATEGORY_ID}`},
                        children: options,
                        events: {
                            change : (evt) => {this.onSettingsChanged(evt)}
                        }
                    })
                ]
            }));
        }

        selects.push(BX.create({
            tag: 'div',
            attrs: {className: 'ui-alert ui-alert-default', style: "max-width:100%;"},
            children: [
                BX.create({
                    tag: 'span',
                    attrs: {style: 'max-width: 315px;'},
                    text: 'Тут можно задавать обязательности заполнения вкладки на разных воронках с определенной стадии.'
                })
            ]

        }))


        return BX.create({
            tag : 'div',
            attrs: {className: 'element-revenues-settings'},
            children: selects,
        })
    }

    onSettingsChanged(evt){
        BX.ajax.runComponentAction('troya:entity.revenue', 'loadSetting', {
            mode: 'class',
            data: {
                name : evt.target.getAttribute('name'),
                value : evt.target.value
            }
        }).then(function (data) {

        });
    }
}