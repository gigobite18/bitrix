function showNotyMessage(message, onOk=false){
    let box = new BX.UI.Dialogs.MessageBox({
        message: BX.create({
            tag : 'div',
            attrs : { style : 'font: 17px "OpenSans", "Helvetica Neue", Helvetica, Arial, sans-serif;text-align: center;'},
            html : message,
        }),
        buttons: BX.UI.Dialogs.MessageBoxButtons.OK,
        okCaption: "ОК",
        onOk : function (messageBox){
            messageBox.close();
            if(onOk)
                onOk();
        },
        modal: true,
    })

    box.show();
    return box;
}

function openSidePanel(link, afterScript=false, width = 1000){
    console.log(123);
    BX.SidePanel.Instance.open(
        link, {
            width: width,
            allowChangeHistory:false,
            events: {
                onCloseComplete: function(event) {
                    BX.SidePanel.Instance.reload();
                }
            }
        }
    )
}