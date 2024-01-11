class BlocksManager{

    regulations;

    constructor(regulations = []) {

        this.regulations = regulations;

        BX.Troya.BlocksManager.data.push(this);

    }


    validate(){

        let userFieldManager,
            condition_result,
            FIELD = this.parent.getEntityData(),
            INITIAL_FIELD = this.parent.getInitialData(),
            control,
            validateResult = true,
            errorMessage;


        for(let regulation of this.regulations){

            condition_result = eval(regulation.CONDITION);

            for(let FIELD_CODE of regulation.FIELD_CODES){

                control = this.parent.getFieldControl(FIELD_CODE);

                if(!control)
                    continue;

                errorMessage = regulation.USER_MESSAGE != ""? regulation.USER_MESSAGE : 'Поле недоступно для записи';

                switch (typeof FIELD[FIELD_CODE]) {
                    case "function":
                    case "number":
                    case "string":
                    case "symbol":
                    case "undefined":
                    case "bigint":
                    case "boolean":

                        if(FIELD[FIELD_CODE] != INITIAL_FIELD[FIELD_CODE] && condition_result == true && control.isChanged()){
                            this.parent.showFieldError(FIELD_CODE, errorMessage);
                            control._errorContainer.appendChild(BX.create({
                                tag: 'div',
                                attrs: {className:'ui-entity-editor-content-remove-lnk', style:'display: table;color: #3571b7;'},
                                text: 'Отменить редактирование',
                                events: {
                                    click: () => {
                                        control._editor.switchControlMode(control, 2);
                                    }
                                }
                            }));
                            validateResult = false;
                        }

                        break;

                    case "object":

                        if(JSON.stringify(Object.values(FIELD[FIELD_CODE]).sort()) != JSON.stringify(Object.values(INITIAL_FIELD[FIELD_CODE]).sort()) && condition_result == true && control.isChanged()){

                            this.parent.showFieldError(FIELD_CODE, errorMessage);
                            control._errorContainer.appendChild(BX.create({
                                tag: 'div',
                                attrs: {className:'ui-entity-editor-content-remove-lnk', style:'display: table;color: #3571b7;'},
                                text: 'Отменить редактирование',
                                events: {
                                    click: () => {
                                        control._editor.switchControlMode(control, 2);
                                    }
                                }
                            }));
                            validateResult = false;
                        }

                        break;

                }



            }

        }

        return validateResult;

    }

}

BX.ready(() => {
    if(!BX.Troya)
        BX.Troya = {};

    BX.Troya.BlocksManager = BlocksManager;
    BX.Troya.BlocksManager.data = [];
})