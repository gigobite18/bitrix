<form class="ui-form ui-form-section" id="TROYA_EXPORT_FORM" style="max-width: fit-content;">
    <div class="ui-form-row">
        <div class="ui-form-label">
            <div class="ui-ctl-label-text">
                Смарт-процесс:
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
            <div class="ui-ctl-label-text">Учитывать поля:</div>
        </div>
        <div class="ui-form-content">
            <div class="ui-form-row">
                <div class="ui-ctl" id="TROYA_FIELDS_HERE">

                </div>
            </div>

        </div>
    </div>

    <div class="ui-form-row" style="display: flex; flex-direction: column;">

        <div class="ui-form-label" style="margin-bottom: 20px;">
            <div class="ui-ctl-label-text">Фильтрация данных:</div>
        </div>

        <div class="ui-form-content" style="width: 100%">
            <div class="ui-form-row" style="width: 100%">
                <div class="ui-ctl" style="display: flex; flex-direction: column; row-gap: 10px;width: 100%;">
                    <div class="filter-list">

                    </div>
                    <div class="ui-btn ui-btn-sm" action="add-filter">Добавить</div>
                </div>
            </div>
        </div>

    </div>

    <!--div class="ui-form-row">
        <div class="ui-form-label">
            <div class="ui-ctl-label-text">Выгрузить файлы в директорию</div>
        </div>
        <div class="ui-form-content">
            <div class="ui-form-row">
                <div class="ui-ctl" style="display: flex; flex-direction: column; row-gap: 10px;">
                    <input style="width: 100%;min-height: 39px;" class="ui-ctl-element" name="FILES_DIRECTORY"><div onclick="BtnClick();" class="ui-btn ui-btn-sm">Открыть</div>
                </div>
            </div>

        </div>
    </div-->
</form>



<div class="ui-btn-container ui-btn-container-center" id="TROYA_EXPORT_BUTTONS_CONTAINER">
    <div class="ui-btn ui-btn-success" action="export">Экспортировать</div>
</div>