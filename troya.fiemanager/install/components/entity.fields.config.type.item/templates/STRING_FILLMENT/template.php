<?php
$APPLICATION->SetTitle('Заполнения типа "Строка"');
?>

<form class="ui-form ui-form-section">
    <input type="hidden" name="ID" value="<?=$arResult['ITEM']['ID']?>">
    <input type="hidden" name="ENTITY" value="<?=$arParams['~VARIABLES']['entity']?>">
    <div class="ui-form-row ui-form-row-middle-input">
        <div class="ui-form-label">
            <div class="ui-ctl-label-text">Основная информация</div>
        </div>
        <div class="ui-form-content">
            <div class="ui-form-row">
                <div class="ui-form-label">
                    <div class="ui-ctl-label-text">
                        Поле*
                    </div>
                </div>
                <div class="ui-ctl ui-ctl-after-icon ui-ctl-dropdown ui-ctl-w100">
                    <div class="ui-ctl-after ui-ctl-icon-angle"></div>
                    <select required name="FIELD_CODE" class="ui-ctl-element">
                        <?foreach ($arResult['FIELDS'] as $code => $field):?>
                            <option <?=$arResult['ITEM']['FIELD_CODE'] == $code? 'selected' : ''?> value="<?=$code?>"><?=$field['TITLE']?></option>
                        <?endforeach;?>
                    </select>
                </div>
            </div>
            <div class="ui-form-row">
                <div class="ui-form-label">
                    <div class="ui-ctl-label-text">
                        Тип*
                    </div>
                </div>
                <div class="ui-ctl ui-ctl-after-icon ui-ctl-dropdown ui-ctl-w100">
                    <div class="ui-ctl-after ui-ctl-icon-angle"></div>
                    <select required name="PATTERN_TYPE" class="ui-ctl-element">

                        <option <?=$arResult['ITEM']['PATTERN_TYPE'] == 'REQEXP'? 'selected' : ''?> value="REQEXP">Регулярное выражение</option>
                        <option <?=$arResult['ITEM']['PATTERN_TYPE'] == 'REPLACE'? 'selected' : ''?> value="REPLACE">Удаление удовлетворяющих условию символов</option>

                    </select>
                </div>
            </div>
            <div class="ui-form-row">
                <div class="ui-form-label">
                    <div class="ui-ctl-label-text">
                        Паттерн заполнения*
                    </div>
                </div>
                <div class="ui-ctl ui-ctl-textbox ui-ctl-w100">
                    <input required name="PATTERN" type="text" class="ui-ctl-element" value="">
                    <script>document.querySelector('.ui-form-section [name=PATTERN]').value="<?=$arResult['ITEM']['PATTERN']?>";</script>
                </div>
                <div style="margin-left: 0; margin-top: 6px" class="ui-btn ui-btn-sm ui-btn-icon-add add-pattern-examples"></div>
            </div>
        </div>
    </div>

    <div class="ui-form-row ui-form-row-middle-input">
        <div class="ui-form-label">
            <div class="ui-ctl-label-text">Тестирование</div>
        </div>
        <div class="ui-form-content">
            <div class="ui-form-row">
                <div class="ui-form-label">
                    <div class="ui-ctl-label-text">
                        Поле для проверки условия
                    </div>
                </div>
                <div class="ui-ctl ui-ctl-textbox ui-ctl-w100">
                    <input autocomplete="false" type="text" class="ui-ctl-element PETTERN_TEST" value="">
                </div>
            </div>
        </div>
    </div>

    <div class="ui-form-row ui-form-row-middle-input">
        <div class="ui-form-label">
            <div class="ui-ctl-label-text">Дополнительная информация</div>
        </div>
        <div class="ui-form-content">
            <div class="ui-form-row">
                <div class="ui-form-label">
                    <div class="ui-ctl-label-text">
                        Описание правила
                    </div>
                </div>
                <div class="ui-ctl ui-ctl-textarea ui-ctl-w100">
                    <textarea name="DESCRIPTION" class="ui-ctl-element"><?=$arResult['ITEM']['DESCRIPTION']?></textarea>
                </div>
            </div>
            <div class="ui-form-row">
                <div class="ui-form-label">
                    <div class="ui-ctl-label-text">
                        Сообщение пользователю
                    </div>
                </div>
                <div class="ui-ctl ui-ctl-textarea ui-ctl-w100">
                    <textarea name="USER_MESSAGE" class="ui-ctl-element"><?=$arResult['ITEM']['USER_MESSAGE']?></textarea>
                </div>
            </div>
        </div>
    </div>
</form>

<div class="ui-btn-container ui-btn-container-center ui-form-section-button-container">
    <div class="ui-btn ui-btn-success save-btn">Сохранить</div>
    
    <div class="ui-btn ui-btn-light-border cancel-btn">Отмена</div>


    <?if($arResult['ITEM']['ID']):?>
        <div class="ui-btn ui-btn-danger delete-btn" data-id="<?=$arResult['ITEM']['ID']?>">Удалить</div>
    <?endif;?>
</div>
