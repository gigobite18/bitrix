class configManager{
    constructor() {
        this.initFormMagic();
        this.showTab();
    }


    initFormMagic(){
        new BX.UI.LayoutForm();
        BX.UI.Hint.init(document.querySelector('.config-table'));
    }

    showTab(code = BX.getCookie('SELECTED_TROYA_FIELD_TYPE')){
        let tab = document.querySelector('.ears-upprs-container'),
            tabs = Array.from(document.querySelectorAll('.ears-upprs-container')),
            sims = Array.from(document.querySelectorAll('.crm-type-preset'));

        if(code){
            BX.setCookie('SELECTED_TROYA_FIELD_TYPE', code);
            tab = document.querySelector(`.ears-upprs-container[data-type=${code}]`);
            tab = document.querySelector(`.ears-upprs-container[data-type=${code}]`);
        }

        let sim = document.querySelector(`.crm-type-preset[data-sim=${tab.dataset.type}]`)

        for(let alTab of tabs){
            alTab.classList.remove('active');
            if(alTab.closest('.ui-ears-wrapper')) alTab.closest('.ui-ears-wrapper').style.display='none'
        }

        for(let alSim of sims){
            alSim.classList.remove('active');
        }

        tab.classList.add('active');
        sim.classList.add('active');
        if(tab.closest('.ui-ears-wrapper')) tab.closest('.ui-ears-wrapper').style.display='inline-flex'

        if(!tab.ears){
            tab.ears = new BX.UI.Ears({
                container: tab,
                smallSize: true,
                noScrollbar: true
            });
            tab.ears.init();
        }

    }

}

BX.ready(() => {
    BX.configManager = new configManager();
})