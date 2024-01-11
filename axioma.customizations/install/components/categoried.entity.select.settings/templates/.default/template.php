<form class="categoried-entity-configuration">
    <table class="list">
        <tr>
            <th><?=GetMessage('TABLE_HEAD_MAIN_PROPERTY')?></th>
            <th><?=GetMessage('TABLE_HEAD_INNER_PROPERTY')?></th>
        </tr>
    </table>

    <div class="ui-btn-container ui-btn-container-left">
        <div class="config-add ui-btn ui-btn-light-border ui-btn-icon-add ui-btn-sm"><?=GetMessage('ADD_BTN_TEXT')?></div>
    </div>

</form>

<script>
    BX.message({
        'CONFIG_ITEM_EMPTY_INNER_PROP' : '<?=GetMessage('CONFIG_ITEM_EMPTY_INNER_PROP')?>',
    })
</script>

<div class="ui-btn ui-btn-icon-reload" onclick="location.reload();">Обновляйка</div>