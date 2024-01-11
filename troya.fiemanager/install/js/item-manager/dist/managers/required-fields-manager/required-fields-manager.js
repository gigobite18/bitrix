class RequirementsManager{

    regulations;

    constructor(regulations = []) {

        this.regulations = regulations;

        BX.Troya.RequirementsManager.data.push(this);

    }


    validate(){

        let userFieldManager,
            condition_result,
            FIELD = this.parent.getEntityData(),
            validateResult = true;

        for(let regulation of this.regulations){

            condition_result = eval(regulation.CONDITION);

            for(let FIELD_CODE of regulation.FIELD_CODES){


                if((FIELD[FIELD_CODE] == '' || FIELD[FIELD_CODE] == undefined || FIELD[FIELD_CODE] == null) && condition_result == true){
                    this.parent.showFieldError(FIELD_CODE, regulation.USER_MESSAGE != ""? regulation.USER_MESSAGE : 'Поле обязательно к заполнению');
                    validateResult = false;
                }

            }

        }

        return validateResult;

    }


}

BX.ready(() => {
    if(!BX.Troya)
        BX.Troya = {};

    BX.Troya.RequirementsManager = RequirementsManager;
    BX.Troya.RequirementsManager.data = [];
})