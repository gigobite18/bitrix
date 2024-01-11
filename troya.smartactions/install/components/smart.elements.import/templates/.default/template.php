<form class="ui-form ui-form-section" id="TROYA_IMPORT_FORM" style="max-width: fit-content;">
    <div class="ui-form-row">
        <div class="ui-form-label">
            <div class="ui-ctl-label-text">
                Смарт-процесс
            </div>
        </div>
        <div class="ui-form-content">
            <div class="ui-form-row">
                <div class="ui-ctl ui-ctl-after-icon ui-ctl-dropdown">
                    <div class="ui-ctl-after ui-ctl-icon-angle"></div>
                    <select required class="ui-ctl-element" name="SMART">

                        <?foreach ($arResult['SMARTS'] as $smart):?>
                        
                        <option data-info='<?=Bitrix\Main\Web\Json::encode($smart)?>' value="<?=$smart['ID']?>"><?=$smart['TITLE']?></option>
                        
                        <?endforeach;?>
                        
                    </select>
                </div>
            </div>
        </div>
    </div>

    <div class="ui-form-row">
        <div class="ui-form-label">
            <div class="ui-ctl-label-text">Файл импорта</div>
        </div>
        <div class="ui-form-content">

            <div class="ui-form-row">

                <label class="ui-ctl ui-ctl-file-drop" style="width: 100%; height: 125px;">
                    <div class="ui-ctl-label-text">
                        <span>Файл импорта</span>
                        <small>Перетащить с помощью drag'n'drop</small>
                        <small class="file-name"></small>
                    </div>
                    <input accept=".xlsx" name="FILE" type="file" class="ui-ctl-element">
                </label>
            </div>

        </div>
    </div>
    <div class="ui-alert">
        <span class="ui-alert-message"><strong>Внимание!</strong> Множественные поля заполнять зерез символ ";"</span>
    </div>
</form>

<br>
<div id="TROYA_IMPORT_ALERTS">
    
</div>

<div class="ui-btn-container ui-btn-container-center" id="TROYA_IMPORT_BUTTONS_CONTAINER" hidden>
    <div class="ui-btn ui-btn-success" action="import">Импортировать</div>
</div>