class StringFillmentManager{

    regulations;

    constructor(regulations) {

        this.regulations = regulations;
        this.listenEditEvent();

        BX.Troya.StringFillmentManager.data.push(this);
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

            if(params._innerWrapper.querySelector('input'))
                this.setFieldRequlation(regulation, params._innerWrapper.querySelector('input'));

        });
    }

    setFieldRequlation(regulation, input){

        let isCorrect=true,
            control = this.parent.getFieldControl(regulation.FIELD_CODE);

        if(input.string_fillmented)
            return;

        let regex = new RegExp(regulation.PATTERN);

        input.addEventListener('input', () => {

            if(regulation.PATTERN_TYPE=='REPLACE'){
                isCorrect = this.checkFirst(input.value, regex);
            }else{
                isCorrect = this.checkSecond(input.value, regex);
            }

            control._hasError = !isCorrect;

            this.loadError(isCorrect, regulation, control);
        })

        input.addEventListener('change', () => {

            if(regulation.PATTERN_TYPE=='REPLACE'){
                isCorrect = this.checkFirst(input.value, regex);
            }else{
                isCorrect = this.checkSecond(input.value, regex);
            }

            this.loadError(isCorrect, regulation, control);

        })

        input.string_fillmented = true;

    }

    checkFirst(value, regex, toReplace=true){
        let replace = value.replace(regex, '');
        let result = replace == value;


        return result;
    }

    checkSecond(value, regex){
        let replace = value.match(regex);
        let result = replace == value;

        return result;
    }

    loadError(isCorrect, regulation, control) {

        let controlError = control._wrapper.querySelector('.ui-entity-editor-field-error-text');

        if(control._mode != BX.UI.EntityEditorMode.edit){
            control.setMode(BX.UI.EntityEditorMode.edit, {
                notify: true
            });
            control.refreshLayout({
                callback: function() {

                }
            })
        }


        if(!isCorrect && !controlError){

            controlError = BX.create({
                tag: 'div',
                attrs:{className:'ui-entity-editor-field-error-text lazy-field'},
                text: regulation.USER_MESSAGE != ''? regulation.USER_MESSAGE : `Правило заполнения: ${regulation.PATTERN}`,
            });
            control._wrapper.appendChild(controlError);

        } else if(isCorrect && controlError){
            controlError.remove();
        }

    }

    validate(){

        let userFieldManager,
            condition_result,
            FIELD = this.parent.getEntityData(),
            validateResult = true,
            regex=false,
            isCorrect=false,
            control;

        for(let regulation of this.regulations){

            control = this.parent.getFieldControl(regulation.FIELD_CODE);

            if(!control)
                continue;

            regex = new RegExp(regulation.PATTERN);

            if(regulation.PATTERN_TYPE=='REPLACE'){
                isCorrect = this.checkFirst(FIELD[regulation.FIELD_CODE], regex);
            }else{
                isCorrect = this.checkSecond(FIELD[regulation.FIELD_CODE], regex);
            }

            this.loadError(isCorrect, regulation, control);

            if(!isCorrect)
                validateResult = false;

        }

        return validateResult;

    }

}

BX.ready(() => {
    if(!BX.Troya)
        BX.Troya = {};

    BX.Troya.StringFillmentManager = StringFillmentManager;
    BX.Troya.StringFillmentManager.data = [];
})