class configAddManager{
    constructor() {
        this.form = document.querySelector('.ui-form-section');
        this.handleButtons();

        this.checkEmptyFields();
        this.listenTestPattern();
        this.listenPattertChanges();
    }

    handleButtons(){

        this.saveBtn = document.querySelector('.ui-form-section-button-container .save-btn');
        if(this.saveBtn)
            this.saveBtn.addEventListener('click', () => {this.onSaveClick();});

        this.cancelBtn = document.querySelector('.ui-form-section-button-container .cancel-btn');
        if(this.cancelBtn)
            this.cancelBtn.addEventListener('click', () => {this.onCancelClick();});

        this.deleteBtn = document.querySelector('.ui-form-section-button-container .delete-btn');
        if(this.deleteBtn)
            this.deleteBtn.addEventListener('click', (evt) => {this.onDeleteClick(evt);});

        this.addPatternBtn = document.querySelector('.ui-form-section .add-pattern-examples');
        if(this.addPatternBtn)
            this.addPatternBtn.addEventListener('click', (evt) => {this.showPatterns(evt);});

    }

    checkEmptyFields(){
        let fieldSelect = this.form.querySelector('[name=FIELD_CODE]');
        if(Array.from(fieldSelect.options).length>0)
            return;

        showNotyMessage('Пользовательские поля с типом "Строка" отсутствуют или ко всем доступым полям уже применены правила.', () => {
            BX.SidePanel.Instance.close();
        })
    }

    listenPattertChanges(){
        let pattern = document.querySelector('[name=PATTERN]'),
            type = document.querySelector('[name=PATTERN_TYPE]');

        pattern.addEventListener('input', () => {this.showPatternDescription()})
        type.addEventListener('change', () => {this.showPatternDescription()})

        this.showPatternDescription();
    }

    showPatternDescription(){
        let pattertTester = document.querySelector('.PETTERN_TEST'),
            type = document.querySelector('[name=PATTERN_TYPE]'),
            pattern = document.querySelector('[name=PATTERN]'),
            regex = new RegExp(""+pattern.value+""),
            text;

        if(type.value=='REPLACE'){
            text = `Конечное выражение: "${regex}". По нему будут фильтроваться вводимые символы. Если в правиле использовать ^(Не), то указанные символы будут защищены от автоматической фильтрации.`;
        }else{
            text = `Конечное выражение: "${regex}". Вводимый текст будет проверяться согласно описанному правилу.`;
        }

        if(!pattertTester.alert){
            let alert =  new BX.UI.Alert({
                text: text,
                color: BX.UI.Alert.Color.DEFAULT,
                icon: BX.UI.Alert.Icon.INFO,
                animated:true,
                closeBtn: false,
                size: BX.UI.Alert.Size.SMALL
            });
            alert.renderTo(pattertTester.parentNode.parentNode);
            alert.container.style.marginTop = '10px';
            pattertTester.alert = alert;
            pattertTester.alert.show();
        }

        if(pattertTester.alert.getText() != text)
            pattertTester.alert.setText(text);

    }

    listenTestPattern(){
        let pattertTester = document.querySelector('.PETTERN_TEST'),
            type = document.querySelector('[name=PATTERN_TYPE]'),
            isCorrect = true;

        pattertTester.addEventListener('input', () => {

            let regex = new RegExp(""+document.querySelector('[name=PATTERN]').value+"");

            if(type.value=='REPLACE'){
                isCorrect = this.checkFirst(pattertTester, regex, false);
            }else{
                isCorrect = this.checkSecond(pattertTester, regex, false);
            }

            if(isCorrect)
                pattertTester.parentNode.classList.remove('ui-ctl-danger');
            else
                pattertTester.parentNode.classList.add('ui-ctl-danger');
        })

        pattertTester.addEventListener('change', () => {

            let regex = new RegExp(""+document.querySelector('[name=PATTERN]').value+"");

            if(type.value=='REPLACE'){
                this.checkFirst(pattertTester, regex);
            }else{
                this.checkSecond(pattertTester, regex);
            }
        })
    }

    checkFirst(input, regex, toReplace=true){
        let replace = input.value.replace(regex, '');
        let result = replace == input.value;

        if(toReplace){
            input.value = replace;
        }

        return result;
    }

    checkSecond(input, regex, toReplace=true){
        let replace = input.value.match(regex);
        let result = replace == input.value;

        if(toReplace){
            if (replace !== null)
                input.value = replace[0];
            else
                input.value = '';

        }

        return result;
    }

    showPatterns(){
        let input = document.querySelector('.ui-form-section [name=PATTERN]'),
            type = document.querySelector('[name=PATTERN_TYPE]'),
            items=[];

        if(type.value == 'REPLACE')
            items = [
                {id: "[^A-Za-z]", entityId: 'list', title: 'Латинские буквы', tabs: ['patterns']},
                {id: "[^А-Яа-я]", entityId: 'list', title: 'Кирилица', tabs: ['patterns']},
                {id: "[^0-9]", entityId: 'list', title: 'Цифры', tabs: ['patterns']},
                {id: "[^A-Za-z0-9]", entityId: 'list', title: 'Кроме спецсимолов', tabs: ['patterns']},
                {id: "[A-Za-z0-9]", entityId: 'list', title: 'Спецсимволы', tabs: ['patterns']},
            ];
        else
            items = [
                {id: "[a-zA-Z]{3}", entityId: 'list', title: 'Три латинские буквы', tabs: ['patterns']},
                {id: "/\\(?([0-9]{3})\\)?([ .-]?)([0-9]{3})\\2([0-9]{4})/", entityId: 'list', title: 'Номер телефона', tabs: ['patterns']},
            ];

        this.parrternDialog = new BX.UI.EntitySelector.Dialog({
            targetNode : this.addPatternBtn,
            id : 'PATTERNS',
            items : items,
            tabs: [
                { id: 'patterns', title: 'Патерны', itemOrder: { title: 'asc' } },
            ],
            multiple : true,
            dropdownMode : true,
            enableSearch : false,
            recentTabOptions : {visible: false},
            events : {
                "Item:onSelect" : (event) => {
                    let item = event.getData().item;
                    item.dialog.deselectAll();
                    input.value = `${input.value}${item.id}`;
                    input.dispatchEvent(new Event('input'));
                }
            },
            hideOnSelect: true,
            hideByEsc : true,
            chacheble: false,
            compactView : true,
        });

        this.parrternDialog.show();
    }

    onSaveClick(){
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

        BX.ajax.runAction('troya:fiemanager.StringFillment.save', {
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

    onDeleteClick(evt){
        showNotyMessage('Удалить правило?', () => {
            BX.ajax.runAction('troya:fiemanager.StringFillment.delete', {
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

    onCancelClick(){
        BX.SidePanel.Instance.close();
    }
}

BX.ready(() => {
    new configAddManager();
})