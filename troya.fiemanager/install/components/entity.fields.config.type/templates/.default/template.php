<div class="table-content">

    <div class="crm-type-presets-category-list">
        <?foreach ($arResult['TYPES'] as $code => $type):?>
            <div onclick="BX.configManager.showTab('<?=$code?>')" data-sim="<?=$code?>" class="crm-type-preset" data-role="preset" data-preset-id="bitrix:list">
                <!--div class="crm-type-preset-icon" style="background-image: url(<?=$type['image']?>)"></div-->
                <div style="max-width: 100%" class="crm-type-preset-text">
                    <div class="crm-type-preset-text-title"><?=$type['title']?></div>
                    <div class="crm-type-preset-text-description"><?=$type['desc']?></div>
                </div>
            </div>
        <?endforeach;?>
    </div>

    <div class="types-list">
        <?foreach ($arResult['TYPES'] as $code => $type):?>

            <div class="ears-upprs-container hide" data-type="<?=$code?>">
                <div class="ui-form ui-form-section ears-container">
                    <table class="config-table">

                        <thead>
                        <tr class="ui-form-row">
                            <th>
                                <div class="ui-form-label">
                                    <div class="ui-ctl-label-text">
                                        Поля
                                    </div>
                                </div>
                            <th>
                                <div class="ui-form-label">
                                    <div class="ui-ctl-label-text">
                                        Описание
                                    </div>
                                </div>
                            </th>
                            <th>
                                <div class="ui-form-label">
                                    <div class="ui-ctl-label-text">
                                        Условие
                                    </div>
                                </div>
                            </th>
                            <th>
                                <div class="ui-form-label">
                                    <div class="ui-ctl-label-text">
                                        Сообщение для пользователя
                                    </div>
                                </div>
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        <?foreach ($type['items'] as $item):?>

                            <tr class="ui-form-row" style="position: relative">

                                <td>
                                    <a onclick="event.preventDefault();openSidePanel('<?=$item['link']?>');" href="<?=$item['link']?>" data-id="<?=$item['ID']?>" class="ui-form-link"><?=$item['name']?></a>
                                </td>

                                <td>
                                    <div class="ui-form-label">
                                        <div class="ui-ctl-label-text">

                                            <?=$item['DESCRIPTION']?>

                                        </div>
                                    </div>

                                </td>

                                <td>
                                    <div class="ui-form-label">
                                        <div class="ui-ctl-label-text">

                                            <?=$item['CONDITION']??$item['PATTERN']?>

                                        </div>
                                    </div>

                                </td>

                                <td>
                                    <div class="ui-form-label">
                                        <div class="ui-ctl-label-text">

                                            <?=$item['USER_MESSAGE']?>

                                        </div>
                                    </div>

                                </td>

                            </tr>
                        <?endforeach;?>
                        </tbody>
                    </table>

                    <div class="ui-btn-container ui-btn-container-center ui-form-section-button-container">
                        <a href="<?=$type['link']?>" onclick="event.preventDefault();openSidePanel('<?=$type['link']?>')" class="ui-btn ui-btn-light-border add-btn">Добавить</a>
                    </div>
                </div>
            </div>


        <?endforeach;?>
    </div>


</div>