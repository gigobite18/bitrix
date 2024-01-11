
<?if($arResult['CONFIG']):?>
    <div class="ears-upprs-container">
        <div class="ui-form ui-form-section ears-container">
            <table class="config-table">

                <thead>
                    <tr class="ui-form-row">
                        <th>
                            <div class="ui-form-label">
                                <div class="ui-ctl-label-text">
                                    Поле
                                </div>
                            </div>
                        <th>
                            <div class="ui-form-label">
                                <div class="ui-ctl-label-text">
                                    Правило
                                </div>
                            </div>
                        </th>
                        <th>
                            <div class="ui-form-label">
                                <div class="ui-ctl-label-text">
                                    Описание
                                </div>
                            </div>
                        </th>
                    </tr>
                </thead>

                <tbody>
                <?foreach ($arResult['CONFIG'] as $item):?>

                    <tr class="ui-form-row" style="position: relative">

                        <td>
                            <a href="#" data-id="<?=$item['ID']?>" class="ui-form-link"><?=$arResult['FIELDS'][$item['FIELD_CODE']]['TITLE']?></a>
                        </td>

                        <td>
                            <div class="ui-form-label">
                                <div class="ui-ctl-label-text" style="white-space: nowrap; max-width: 131px; text-overflow: ellipsis; overflow: hidden;">

                                    <?=$item['PATTERN']?>

                                </div>
                            </div>

                        </td>

                        <td>
                            <div class="ui-form-label">
                                <div class="ui-ctl-label-text">

                                    <?=$item['DESCRIPTION']?>

                                </div>
                            </div>

                        </td>

                    </tr>
                <?endforeach;?>
                </tbody>
            </table>
        </div>
    </div>
<?endif;?>

<div class="ui-btn-container ui-form-section-button-container">
    <input type="submit" class="ui-btn ui-btn-light-border add-btn"  name="submit"  value="Добавить">
</div>
