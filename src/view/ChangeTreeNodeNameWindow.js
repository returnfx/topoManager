function ChangeTreeNodeNameWindow(){
    var win=document.createElement("div");
    win.id="ChangeTreeNodeNameWindow";
    var selfWin=this;
    $easyui(win).window({
        width:"300px",
        height:"180px",
        modal:true,
        resizable:false,
        closed:true,
        collapsible:false,
        minimizable:false,
        maximizable:false,
        closable:false,
        draggable:true,
        title:"修改名称",
        href:"./res/window/ChangeTreeNodeName.html",
        onLoad:windowInit
    });

    function windowInit(){
        $easyui("#changeNodeName_okBtn").bind("click", okClick);
        $easyui("#changeNodeName_cancelBtn").bind("click", cancelClick);
        $easyui("#changeNodeNameFrom_oldName").textbox("setText",selfWin.data.node.data.name);
        $easyui("#changeNodeNameFrom_newName").textbox("setText","");
        selfWin.isLoaded=true;
    }

    function okClick(){
        var newName=$easyui('#changeNodeNameFrom_newName').textbox("getText");
        if(newName.length!=0){
            selfWin.data.submitHandler({node:selfWin.data.node,newName:newName});
        }
        cancelClick();
    }

    function cancelClick(){
        selfWin.close();
    }

    this.open=function(data){
        selfWin.data=data;
        $easyui(win).window("open");
        $easyui("#changeNodeNameFrom_oldName").textbox("setText",selfWin.data.node.data.name);
        $easyui("#changeNodeNameFrom_newName").textbox("setText","");
    }

    this.close=function(){
        $easyui(win).window("close");
    }
}


module.exports=ChangeTreeNodeNameWindow;