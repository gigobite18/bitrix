class configManager{
    constructor() {
        this.applyEars();
        this.handleButtons();
        this.handleItemLinks();
        this.handleItemRemoveBtns();
        this.initFormMagic();
    }


    applyEars(){
        this.ears = new BX.UI.Ears({
            container: document.querySelector('.ears-container'),
            smallSize: true,
            noScrollbar: true
        });
        this.ears.init();
    }

    handleButtons(){

        this.addBtn = document.querySelector('.ui-form-section-button-container .add-btn');
        if(this.addBtn)
            this.addBtn.addEventListener('click', () => {this.onAddClick();});

    }

    handleItemLinks(){
        let links = Array.from(document.querySelectorAll('.config-table tbody td a'));

        for(let link of links){
            link.addEventListener('click', (evt) => {this.onLinkClick(evt)});
        }
    }

    handleItemRemoveBtns(){
        let btns = Array.from(document.querySelectorAll('.config-table tbody td .popup-window-close-icon'));

        for(let btn of btns){
            btn.addEventListener('click', (evt) => {this.onDeleteClick(evt)});
        }
    }

    initFormMagic(){
        new BX.UI.LayoutForm();
        BX.UI.Hint.init(document.querySelector('.config-table'));
    }

    onLinkClick(evt){
        let link = `/local/modules/troya.fiemanager/install/fields/?type=${troyaControlParams['~VARIABLES'].type}&entity=${troyaControlParams['~VARIABLES'].entity}&id=${evt.target.dataset.id}`;

        BX.SidePanel.Instance.open(link, {
            allowChangeHistory: false,
            width:800,
            cacheable: false,
            label: {
                text: evt.target.innerText,
                bgColor: `rgb(0 0 0 / 95%)`,
            },
            events: {
                onCloseComplete: function(event) {
                    BX.SidePanel.Instance.reload();
                }
            }
        });
    }

    onDeleteClick(evt) {
        showNotyMessage('Удалить правило?', () => {
            BX.ajax.runAction('troya:fiemanager.StringFillment.delete', {
                data: {
                    id : evt.target.dataset.id
                },
            }).then(function (response) {
                if(response.data.success)
                    BX.SidePanel.Instance.reload();
                else
                    showNotyMessage('Ошибка удаления. Обратитесь к администратору.');

            }, function (response) {
                showNotyMessage('Ошибка сохранения. Обратитесь к администратору.');
            });
        });
    }

    onAddClick(){
        let link = `/local/modules/troya.fiemanager/install/fields/?type=${troyaControlParams['~VARIABLES'].type}&entity=${troyaControlParams['~VARIABLES'].entity}&id=0`;

        BX.SidePanel.Instance.open(link, {
            allowChangeHistory: false,
            width:800,
            cacheable: false,
            label: {
                text: `Добавление правила`,
                bgColor: `rgb(0 0 0 / 95%)`,
            },
            events: {
                onCloseComplete: function(event) {
                    BX.SidePanel.Instance.reload();
                }
            }
        });
    }
}

BX.ready(() => {
    new configManager();
})