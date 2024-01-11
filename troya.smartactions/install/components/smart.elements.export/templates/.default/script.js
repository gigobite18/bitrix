class ElementsExport{


    constructor() {

        this.form = document.getElementById('TROYA_EXPORT_FORM');
        this.smartSelector = document.querySelector('[name=SMART]');
        this.fieldsConteiner = document.getElementById('TROYA_FIELDS_HERE');
        this.buttonsConteiner = document.getElementById('TROYA_EXPORT_BUTTONS_CONTAINER');
        this.exportButton = document.querySelector('#TROYA_EXPORT_BUTTONS_CONTAINER [action=export]');
        this.addFilterButton = this.form.querySelector('[action=add-filter]');
        this.filterList = this.form.querySelector('.filter-list');

        if(this.smartSelector) this.smartSelector.addEventListener('change', () => {this.renderFieldSelector();this.checkCanExport();this.filterList.innerHTML='';})
        if(this.exportButton) this.exportButton.addEventListener('click', () => {this.exportData()})
        if(this.addFilterButton) this.addFilterButton.addEventListener('click', () => {this.addFilter()})
        this.renderFieldSelector();
    }

    getCurrentSmartInfo(){

        let option = this.smartSelector.selectedOptions[0],
            fields = [];


        if(option){
            return BX.parseJSON(option.dataset.info);
        }

        return false;

    }

    getCurrentSmartFields(){
        let fields = [],
            info = this.getCurrentSmartInfo();

        if(!info)
            return fields;

        if(typeof info.FIELDS != 'object')
            info.FIELDS = [];

        if(typeof info.USER_FIELDS != 'object')
            info.USER_FIELDS = [];

        for(let code in info.FIELDS){
            fields.push({
                tabs: ['list'],
                id: code,
                entityId: 'list',
                title: info.FIELDS[code].TITLE,
            })
        }

        for(let code in info.USER_FIELDS){
            fields.push({
                tabs: ['list'],
                id: code,
                entityId: 'list',
                title: info.USER_FIELDS[code].TITLE,
            })
        }

        return fields;
    }

    renderFieldSelector(){

        if(!this.fieldsConteiner || !BX.UI.EntitySelector.TagSelector)
            return;

        this.fieldsConteiner.innerHTML = '';

        let selector = new BX.UI.EntitySelector.TagSelector({
            multiple: 'Y',
            dialogOptions: {
                tabs : [
                    { id : 'list', title: 'Список'}
                ],
                items: this.getCurrentSmartFields(),
                recentTabOptions: {
                    visible:false,
                }
            },
            id: 'FIELDS',
            events: {
                onAfterTagAdd: function(event){
                    event.target.setInput(event);
                    event.target.onchange();
                },
                onTagRemove: function(event){
                    event.target.setInput(event);
                    event.target.onchange();
                }
            }
        });

        selector.onchange = (event) => {
            this.checkCanExport();
        }
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

        selector.renderTo(this.fieldsConteiner);

    }

    getFormData(){
        let formData = new FormData(this.form),
            data ={},
            item;

        for(let [name, value] of formData)
        {
            item = this.form.querySelector(`[name=${name}]`);

            if(item.tagName == 'SELECT' && item.multiple){
                value = Array.from(item.selectedOptions).map((x) => {return x.value});
            }else if(item.tagName == 'SELECT'){
                value = item.value;
            }

            data[name] = value;
        }

        data['filter'] = this.getFilterObject();

        return data;
    }

    checkCanExport(){

        return;

        let data = this.getFormData();

        if(typeof data.FIELDS != "object")
            data.FIELDS = [];

        if(data.SMART && data.FIELDS.length>0)
            this.buttonsConteiner.removeAttribute('hidden');
        else
            this.buttonsConteiner.setAttribute('hidden', true);

    }

    addFilter(){

        let smartInfo = this.getCurrentSmartInfo();

        if(typeof smartInfo.FIELDS != 'object')
            smartInfo.FIELDS = [];

        if(typeof smartInfo.USER_FIELDS != 'object')
            smartInfo.USER_FIELDS = [];

        let fieldsSelect = BX.create({
            tag: 'div',
            attrs: {className: 'ui-ctl ui-ctl-after-icon ui-ctl-dropdown', style: 'display: block;height: 38px;'},
            children: [
                BX.create({
                    tag: 'div',
                    attrs: {className: 'ui-ctl-after ui-ctl-icon-angle'},
                }), BX.create({
                    tag: 'select',
                    attrs: {className: 'FIELD_CODE ui-ctl-element'},
                })
            ]
        });

        for(let fieldCode in smartInfo.FIELDS){
            fieldsSelect.querySelector('select').appendChild(BX.create({
                tag: 'option',
                attrs: {value: fieldCode},
                text: smartInfo.FIELDS[fieldCode].TITLE
            }))
        }

        for(let fieldCode in smartInfo.USER_FIELDS){
            fieldsSelect.querySelector('select').appendChild(BX.create({
                tag: 'option',
                attrs: {value: fieldCode},
                text: smartInfo.USER_FIELDS[fieldCode].TITLE
            }))
        }

        let conditionSelect = BX.create({
            tag: 'div',
            attrs: { className: 'ui-ctl ui-ctl-after-icon ui-ctl-dropdown'},
            children: [
                BX.create({
                   tag: 'div',
                   attrs: {className: 'ui-ctl-after ui-ctl-icon-angle'},
                }),
                BX.create({
                    tag: 'select',
                    attrs: {className: 'FIELD_CONDITION ui-ctl-element'},
                    children: [
                        {value: ' ', title: 'Равно'},
                        {value: '!', title: 'Не равно'},
                        {value: '>', title: 'Больше'},
                        {value: '>=', title: 'Больше или равно'},
                        {value: '<', title: 'Меньше'},
                        {value: '<=', title: 'Меньш или равно'},
                    ].map((x) => {
                            return BX.create({
                                tag: 'option',
                                attrs: {value: x.value},
                                text: x.title
                            });
                        })
                    })
            ]
        });

        let value = BX.create({
            tag: 'div',
            attrs: {className: 'ui-ctl'},
            children: [
                BX.create({
                    tag: 'input',
                    attrs: {className: 'ui-ctl-element FIELD_VALUE'}
                })
            ]
        });

        let filterItem = BX.create({
            tag: 'div',
            attrs: {className: 'filter-list-item', style: 'position: relative;'},
            children: [
                fieldsSelect,
                conditionSelect,
                value,
                BX.create({
                    tag: 'div',
                    attrs: {className: 'popup-window-close-icon', style: 'z-index: 333; right: -5px;'},
                    events: {
                        click: (event) => {
                            event.target.closest('.filter-list-item').remove();
                        }
                    }
                })
            ]
        })

        this.filterList.appendChild(filterItem);

    }

    getFilterObject(){

        let filterItems = Array.from(this.filterList.querySelectorAll('.filter-list-item'));
        let filterObject = {},
            code,
            condition,
            value;

        for(let item of filterItems){
            code = item.querySelector('.FIELD_CODE').value;
            condition = item.querySelector('.FIELD_CONDITION').value.trim();
            value = item.querySelector('.FIELD_VALUE').value;

            if(filterObject[`${condition}${code}`] && typeof filterObject[`${condition}${code}`] == 'string')
                filterObject[`${condition}${code}`] = [filterObject[`${condition}${code}`], value];
            else if(typeof filterObject[`${condition}${code}`] == 'object')
                filterObject[`${condition}${code}`].push(value??'');
            else
                filterObject[`${condition}${code}`] = value??'';

        }

        return filterObject;

    }

    exportData(){

        if(this.exportButton.classList.contains('ui-btn-wait'))
            return;

        let data = this.getFormData(),
            self = this;
        this.exportButton.classList.add('ui-btn-wait');

        BX.ajax.runAction('troya:smartactions.Xlsx.exportSmartElements', {
            data: data,
        }).then(function (response) {

            self.exportButton.classList.remove('ui-btn-wait');
            let a = BX.create({
                tag: 'a',
                attrs: {download: 'Файл экспорта smart - '+self.getCurrentSmartInfo().TITLE+' .xlsx', href: response.data.file, target: '_blank', hidden: true},
            });
            a.click();
            a.remove();

        }, function (response) {

            self.exportButton.classList.remove('ui-btn-wait');

            BX.UI.Notification.Center.notify({
                content: "Ошибка экспорта",
                position: "top-right"
            });

        });
    }
}

BX.ready(() => {
    new ElementsExport();
})

var mess_SESS_EXPIRED = 'Ошибка файлового диалога: Сессия пользователя истекла';
var mess_ACCESS_DENIED = 'Ошибка файлового диалога: У вас недостаточно прав для использования диалога выбора файла';
window.BtnClick = function(bLoadJS, Params) {
    if (!Params)
        Params = {};

    var UserConfig;
    UserConfig = {
        site: 'ru',
        path: '/upload',
        view: "list",
        sort: "type",
        sort_order: "asc"
    };
    if (!window.BXFileDialog) {
        if (bLoadJS !== false)
            BX.loadScript('/bitrix/js/main/file_dialog.js?17023948677359');
        return setTimeout(function() {
            window['BtnClick'](false, Params)
        }, 50);
    }

    var oConfig = {
        submitFuncName: 'BtnClickResult',
        select: 'D',
        operation: 'O',
        showUploadTab: true,
        showAddToMenuTab: false,
        site: 'ru',
        path: '/',
        lang: 'ru',
        saveConfig: true,
        sessid: "a78f1317802fb39830dd5f3bbdb29a26",
        checkChildren: true,
        genThumb: true,
        zIndex: 2500
    };

    if (window.oBXFileDialog && window.oBXFileDialog.UserConfig) {
        UserConfig = oBXFileDialog.UserConfig;
        oConfig.path = UserConfig.path;
        oConfig.site = UserConfig.site;
    }

    if (Params.path)
        oConfig.path = Params.path;
    if (Params.site)
        oConfig.site = Params.site;

    oBXFileDialog = new BXFileDialog();
    window.dialog = oBXFileDialog;
    oBXFileDialog.Open(oConfig, UserConfig);
}
;
window.BtnClickResult = function(filename, path, site, title, menu) {
    path = jsUtils.trim(path);
    path = path.replace(/\\/ig, "/");
    path = path.replace(/\/\//ig, "/");
    if (path.substr(path.length - 1) == "/")
        path = path.substr(0, path.length - 1);
    var full = (path + '/' + filename).replace(/\/\//ig, '/');
    if (path == '')
        path = '/';

    var arBuckets = [];
    if (arBuckets[site]) {
        full = arBuckets[site] + filename;
        path = arBuckets[site] + path;
    }

    if ('F' == 'D')
        name = full;

    document.querySelector('[name=FILES_DIRECTORY]').value = full;
    BX.fireEvent(document.querySelector('[name=FILES_DIRECTORY]'), 'change');
    console.log(menu);
}
;
if (window.jsUtils) {
    jsUtils.addEvent(window, 'load', function() {
        jsUtils.loadJSFile('/bitrix/js/main/file_dialog.js?17023948677359');
    }, false);
}