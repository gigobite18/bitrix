<?
use Bitrix\Main\Web\Json;
$APPLICATION->SetTitle('Ограничение типа "Диалог сущностей"');
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
                            <option data-info='<?=Json::encode($field)?>' <?=$arResult['ITEM']['FIELD_CODE'] == $code? 'selected' : ''?> value="<?=$code?>"><?=$field['TITLE']?></option>
                        <?endforeach;?>
                    </select>
                </div>
            </div>
            <div class="ui-form-row">
                <div class="ui-form-label">
                    <div class="ui-ctl-label-text">
                        Условие*
                    </div>
                </div>
                <div class="ui-ctl ui-ctl-textbox ui-ctl-w100">
                    <input required name="CONDITION" type="text" class="ui-ctl-element" value='<?=$arResult['ITEM']['CONDITION']?>'>
                </div>

                <div class="ui-ctl ui-ctl-textbox ui-ctl-w100 props-here">
                    
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
            <div class="ui-form-row"  style="display: none">
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

<script>
    window.addManagerFields = <?=Bitrix\Main\Web\Json::encode($arResult['MORE_FIELDS']);?>
</script>