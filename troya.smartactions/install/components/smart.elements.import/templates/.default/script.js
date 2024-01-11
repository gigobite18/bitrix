class ElementsExport{


    constructor() {

        this.form = document.getElementById('TROYA_IMPORT_FORM');
        this.buttonsConteiner = document.getElementById('TROYA_IMPORT_BUTTONS_CONTAINER');
        this.alertsContainer = document.getElementById('TROYA_IMPORT_ALERTS');
        this.importBtn = this.buttonsConteiner.querySelector('[action=import]');
        this.fileInput = this.form.querySelector('[name=FILE]');
        this.dropArea = this.form.querySelector('.ui-ctl-file-drop');
        this.fileName = this.form.querySelector('.file-name')

        this.fileInput.addEventListener('change', () => {this.checkCanImport()})
        this.importBtn.addEventListener('click', () => this.importData())
        this.initDragAndDrop();
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

        return data;
    }

    checkCanImport(){

        let data = this.getFormData();

        console.log(data);

        if(data.SMART && data.FILE)
            this.buttonsConteiner.removeAttribute('hidden');
        else
            this.buttonsConteiner.setAttribute('hidden', true);

    }

    initDragAndDrop(){

        let self = this;

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.dropArea.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });


        this.dropArea.addEventListener('drop', handleDrop, false);

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;

            handleFiles(files);
            self.checkCanImport();
        }

        function handleFiles(files) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                self.fileName.innerText = file.name;
            }
        }

        this.fileInput.addEventListener('change', function() {
            handleFiles(this.files);
        });
    }

    importData(){

        this.alertsContainer.innerHTML='';

        if(this.importBtn.classList.contains('ui-btn-wait'))
            return;

        let self = this,
            data = BX.ajax.prepareForm(this.form).data;

        this.importBtn.classList.add('ui-btn-wait');

        let filesArs = Array.from(this.form.querySelectorAll('input[type=file]')),
            name;

        for(let i in filesArs){

            name = filesArs[i].getAttribute('name');

            for(let index in filesArs[i].files)
            {
                data[name+index] = filesArs[i].files[index];
            }

        }

        const bxFormData = new BX.ajax.FormData();
        for(let name in data)
        {
            bxFormData.append(name, data[name]);
        }

        let result = bxFormData.send(
            '/bitrix/services/main/ajax.php?action=troya%3Asmartactions.Xlsx.importSmartElements&sessid='+BX.bitrix_sessid(),
            function (response)
            {
                self.importBtn.classList.remove('ui-btn-wait');
                let jsonResp = BX.parseJSON(response);
                if(jsonResp.status == 'success'){

                    if(jsonResp.data.error){
                        self.alertsContainer.innerHTML= `
                        <div class="ui-alert ui-alert-danger">
                            <span class="ui-alert-message"><strong>Внимание!</strong> ${jsonResp.data.error}.</span>
                        </div>`;
                    }else{
                        self.alertsContainer.innerHTML= `
                    <div class="ui-alert ui-alert-primary">
                        <span class="ui-alert-message">Импортировано ${jsonResp.data.imported_count} элемент(ов) из ${jsonResp.data.count}.</span>
                    </div>`;
                    }

                }else{
                    self.alertsContainer.innerHTML= `
                    <div class="ui-alert ui-alert-danger">
                        <span class="ui-alert-message"><strong>Внимание!</strong> При импорте произошла ошибка.</span>
                    </div>`;
                }
            },
            null,
            function(error)
            {
                self.importBtn.classList.remove('ui-btn-wait');

                self.alertsContainer.innerHTML= `
                <div class="ui-alert ui-alert-danger">
                    <span class="ui-alert-message"><strong>Внимание!</strong> При импорте произошла ошибка.</span>
                </div>`;
            }
        );


    }

}

BX.ready(() => {
    new ElementsExport();
    new BX.UI.LayoutForm();
})