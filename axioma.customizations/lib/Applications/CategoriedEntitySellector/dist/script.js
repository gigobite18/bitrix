class CategoriedEntitySellector{
    constructor(selector) {
        this.config = categoriedEntitySellectorConfig;
        this.renderDialogCustomizations(selector);
    }

    renderDialogCustomizations(selector) {

        if(!this.config)
            return;

        this.dialog = selector;
        window.dialog = selector;

        this.propCode = this.dialog.bindNode.parentNode.parentNode.parentNode.parentNode.dataset.cid;
        this.dialogConfig = this.config.find((x) => x.MAIN_PROPERTY == this.propCode);

        if(!this.dialogConfig)
            return;

        setTimeout(() => {
            this.dialog.bindNode.querySelector('.ui-tile-selector-selector-wrap').append(this.dialog.bindNode.querySelector('.ui-tile-selector-select-container'));
            this.dialog.bindNode.querySelector('.ui-tile-selector-select-container').outerHTML = this.dialog.bindNode.querySelector('.ui-tile-selector-select-container').outerHTML;
            this.bindNode = this.dialog.bindNode.querySelector('.ui-tile-selector-select-container');
            this.bindNode.addEventListener('click', () => {this.showDialog()});
            this.createDialogContent();
            document.body.appendChild(BX.create({
                tag: 'div',
                html: "<style>#bx-selector-dialog-"+this.dialog.id+",#bx-selector-dialog-"+this.dialog.id+"-search{display: none!important;}</style>"
            }))
        }, 200)
    }

    showDialog(){
        this.popUp.show();
    }

    createDialogContent(){
        let catSelsBlock = this.createCatSelsBlock();
        let catSelectorBlock = this.createCatSelectorBlock();

        this.popUp = new BX.PopupWindow(false, this.bindNode, {
            content: BX.create({
                tag: 'div',
                attrs: {className: 'more-container'},
                children: [
                    catSelsBlock,
                    catSelectorBlock,
                ]
            }),
            titleBar: this.bindNode.closest('.ui-entity-editor-content-block[data-cid]').querySelector('.ui-entity-editor-block-title-text').innerText,
            minWidth:'300px',
            zIndex: 0,
            offsetLeft: 0,
            offsetTop: 0,
            draggable: {
                restrict: true
            },
            closeByEsc: true,
            autoHide: true,
            draggable: true,
            resizable: true,
        });
        this.container = this.popUp.contentContainer;

        this.setTagsInSelects();
        this.initChoises();

    }

    createCatSelsBlock(){
        let categoriesSelectsContainer = null,
            categoriesSelects = [];


        for(let categoryId in this.dialogConfig.CATEGORIES){
            categoriesSelects.push(this.createCategorySelectBlock(this.dialogConfig.CATEGORIES[categoryId]));
        }


        categoriesSelectsContainer = BX.create({
            tag: 'div',
            attrs: {className: 'categories-select-container'},
            children: categoriesSelects,
        })

        return categoriesSelectsContainer;
    }

    createCategorySelectBlock(category){
        let options = [];
        let optionsV2 = [];

        for(let itemId in category.ITEMS){
            options.push(BX.create({
                tag: 'option',
                attrs: {value : itemId, value_s : 's_'+itemId},
                text: category.ITEMS[itemId]
            }))
        }

       return  BX.create({
            tag: 'div',
            attrs: {className: 'category', hidden: true, category : 'C_'+category.ID, categoryId: category.ID},
            children: [
                BX.create({
                    tag : 'span',
                    attrs: {className: 'popup-window-close-icon'},
                    events: {
                        click: (evt) => { this.onCategoryHide(category.ID)}
                    }
                }),
                BX.create({
                    tag: 'div',
                    attrs: {className : 'name'},
                    text: category.TITLE
                }),
                BX.create({
                    tag : 'div',
                    attrs : {className : 'select-container select-'+category.ID, multiple: true},
                    children: [
                        BX.create({
                            tag: 'div',
                            attrs: {className: 'ui-ctl ui-ctl-multiple-select'},
                            children: [
                                BX.create({
                                    tag: 'select',
                                    attrs: {className: 'ui-ctl-element', 'multiple' : true, size: 10},
                                    children: options,
                                    events: {
                                        change : (evt) => {this.onItemsChanged(evt)}
                                    }
                                })
                            ]
                        })
                    ]
                })
            ]
        });

    }

    createCatSelectorBlock(){
        let options = [];

        for(let categoryId in this.dialogConfig.CATEGORIES){
            options.push(BX.create({
                tag: 'option',
                attrs: {value : categoryId, value_s : 's_'+categoryId},
                text: this.dialogConfig.CATEGORIES[categoryId].TITLE
            }))
        }

        return BX.create({
            tag: 'div',
            attrs: {className: 'categories-container'},
            children:[
                BX.create({
                   tag: 'div',
                   attrs: {className: 'ui-entity-editor-block-title', style: 'font-size: 15px;color: #514e4e;'},
                   text: BX.message('CATEGORIES')+":",
                }),
                BX.create({
                    tag: 'div',
                    attrs: {className: 'ui-ctl ui-ctl-multiple-select'},
                    children: [
                        BX.create({
                            tag: 'select',
                            attrs: {className: 'ui-ctl-element', 'multiple' : true, size: 10},
                            children: options,
                            events: {
                                change : (evt) => {this.onCategoriesChanged(evt)}
                            }
                        })
                    ]
                })
            ]
        })
    }

    initChoises(){
        this.container.style.overflow = 'visible';
        this.container.style.maxHeight = 'initial';
        this.container.style.marginBottom = '20px';

        let selects = Array.from(this.container.querySelectorAll('select'));

        for(let i in selects){
            this.initChoisesToSelecte(selects[i]);
        }
    }

    initChoisesToSelecte(select){
        window.choices = new Choices(select, {
            silent: true,
            items: [],
            choices: [],
            renderChoiceLimit: -1,
            maxItemCount: -1,
            addItems: true,
            addItemFilter: null,
            removeItems: true,
            removeItemButton: true,
            editItems: true,
            allowHTML: true,
            duplicateItemsAllowed: false,
            delimiter: ',',
            paste: true,
            searchEnabled: true,
            searchChoices: true,
            searchFloor: 1,
            searchResultLimit: 100,
            searchFields: ['label', 'value'],
            position: 'auto',
            placeholder: true,
            renderSelectedChoices: 'auto',
            loadingText: '',
            noResultsText: '',
            noChoicesText: '',
            itemSelectText: '',
            uniqueItemText: '',
            customAddItemText: '',
            addItemText : '',
        });

        select.choise = window.choices;
    }

    showCategoryById(id){
        let category = this.container.querySelector('.category[category=C_'+id+']');
        if(!category)
            return;

        category.setAttribute('hidden', false);
    }

    hideCategoryById(id){
        let category = this.container.querySelector('.category[category=C_'+id+']');
        if(!category)
            return;

        category.setAttribute('hidden', true);

        let select = category.querySelector('select');
        let selectChoices = select.choise.getValue();
        let serachString='';
        for(let i in selectChoices){
            serachString='[data-bx-id="'+selectChoices[i].value+'"] .ui-tile-selector-item-remove';
            this.dialog.bindNode.querySelector(serachString).click();
        }
    }

    setTagsInSelects(){
        let ids = Object.keys(this.dialog.selectorInstance.itemsSelected).map((x) => {
            return x.split('_')[1];
        })
        let options = Array.from(this.container.querySelectorAll('.categories-select-container option'));
        let selectedCategories = {};
        let category = null;

        for (let i in options){
            if(!ids.includes(options[i].value))
                continue;

            options[i].setAttribute('selected', true);
            category = options[i].closest('.category');
            category.removeAttribute('hidden');
            selectedCategories[category.getAttribute('categoryId')] = category.getAttribute('categoryId');
        }

        let mainSelectOptions = Array.from(this.container.querySelectorAll('.categories-container option'));

        for(let i in mainSelectOptions){
            if(!selectedCategories[mainSelectOptions[i].value])
                continue;

            mainSelectOptions[i].setAttribute('selected', true);
        }
    }

    setSelectsInTags(items){

        let entityType = Object.keys(this.dialog.selectorInstance.entities)[Object.keys(this.dialog.selectorInstance.entities).length-1];
        let tileContainer = this.dialog.bindNode.querySelector('.ui-tile-selector-selector');
        let inputs = Array.from(tileContainer.parentNode.querySelectorAll('[name='+this.propCode+']'));
        for(let i in inputs){
            inputs[i].remove();
        }



        let confItems = {};
        let searchString;

        tileContainer.innerHTML = '';
        for(let i in items){

            tileContainer.appendChild(BX.create({
                tag : 'span',
                attrs: {
                    'data-role': "tile-item",
                    'data-bx-id': items[i].id,
                    className: 'ui-tile-selector-item ui-tile-selector-item-dynamics_160 ui-tile-selector-item-readonly-no'
                },
                children: [
                    BX.create({
                        tag: 'span',
                        attrs: {'data-role' : "tile-item-name"},
                        text: items[i].text,
                    }),
                    BX.create({
                        tag: 'span',
                        attrs: {'data-role' : "remove", className: 'ui-tile-selector-item-remove'},
                        events: {
                            click: () => {

                                this.removeTileElementById(items[i].id);
                            }
                        }
                    })
                ]
            }));

            confItems["Ta0_"+items[i].id] = entityType;

            tileContainer.parentNode.appendChild(BX.create({
                tag: 'input',
                attrs: { type: 'hidden', value: items[i].id, name: this.propCode+'[]'},
            }))
        }

        let control = BX.Crm.EntityEditor.defaultInstance.getActiveControlById(this.propCode);

        let field = control._model.getField(this.propCode);
        field.VALUE = confItems;
        field.IS_EMPTY = false;
        control._model.setField(this.propCode, field);
        control.markAsChanged();

        window.control = control;

        this.dialog.selectorInstance.itemsSelected = confItems;
    }

    removeTileElementById(id){
        let searchString = '.categories-select-container option[value="'+id+'"]';
        var select = this.container.querySelector(searchString).parentNode;


        select.choise._removeItem(select.choise.getValue().filter((x) => x.value == id)[0]);
        this.onItemsChanged({
            target:select,
            detail : {value : id}
        });
    }

    onCategoriesChanged(event){
        let addedStatus=false;
        let selectedOptions = Array.from(event.target.options);

        for(let i in selectedOptions){
            if(event.detail.value == selectedOptions[i].value)
                addedStatus = true;
            this.showCategoryById(selectedOptions[i].value);
        }

        if(addedStatus == false && event.detail.value)
            this.hideCategoryById(event.detail.value);

    }

    onItemsChanged(event){
        let selects = Array.from(this.container.querySelectorAll('.categories-select-container select'));
        let ids = [];
        for(let i in selects){
            ids = ids.concat(Array.from(selects[i].options).map((x) => {
                return {id: x.value, text: x.innerText};
            }));
        }

        this.setSelectsInTags(ids);
    }

    onCategoryHide(categoryId){
        let categoriesChoices = Array.from(this.container.querySelectorAll('.categories-container .choices__item--selectable'));
        let categoriesOptions = Array.from(this.container.querySelectorAll('.categories-container select option'));
        let select = this.container.querySelector('.categories-container select');

        let curentCategoryChoise = categoriesChoices.find((x) => x.dataset.value == categoryId);
        let curentCategoryOption = categoriesOptions.find((x) => x.value == categoryId);

        select.choise._removeItem(select.choise.getValue().filter((x) => x.value == categoryId)[0]);

        this.onCategoriesChanged({
            target:select,
            detail : {value : categoryId}
        });
    }
}

BX.ready(() => {

    BX.addCustomEvent('BX.Main.SelectorV2:onGetEntityTypes', BX.delegate(function (params) {
        new CategoriedEntitySellector(params.selector);
    }));

})