function TreeTopoChangeListWindow(){
    var win=document.createElement("div");
    win.id="TreeTopoFindingWindow";
    var selfWin=this;

    $easyui(win).window({
        width:"160px",
        height:"80%",
        modal:false,
        resizable:false,
        closed:true,
        collapsible:true,
        minimizable:false,
        maximizable:false,
        closable:false,
        draggable:true,
        title:"改变列表",
        href:"./res/window/TreeTopoChangeListWindow.html",
        onLoad:windowInit,
        onCollapse:onCollapse,
        onExpand:onExpand
    });

    function windowInit(){
        $easyui("#addChangeList").datalist(
            {
                textField:"name",
                valueField:"value",
                onLoadSuccess:onLoadAddSuccess,
                textFormatter:function(value,row,index){
                    return "<a class='easyui-tooltip' title='"+value+"'>"+value+"</a>"
                },
                data:[
                    {name:"test",value:"n"}
                ]
            }
        )
        $easyui("#delChangeList").datalist(
            {
                textField:"name",
                valueField:"value",
                onLoadSuccess:onLoadDelSuccess,
                textFormatter:function(value,row,index){
                    return "<a class='easyui-tooltip' title='"+value+"'>"+value+"</a>"
                },
                data:[
                    {name:"test",value:"n"}
                ]
            }
        );

        selfWin.isLoaded=true;
    }
    function onLoadAddSuccess(data){
        if(selfWin.listData&&selfWin.listData.addDatas){
            var addDatas=selfWin.listData.addDatas;
            selfWin.listData.addDatas=null;
            $easyui("#addChangeList").datalist("loadData",addDatas);
        }
    }

    function onLoadDelSuccess(data){
        if(selfWin.listData&&selfWin.listData.delDatas){
            var delDatas=selfWin.listData.delDatas;
            selfWin.listData.delDatas=null;
            $easyui("#delChangeList").datalist("loadData",delDatas);
        }
    }

    this.updateData=function(data){
        selfWin.listData=data;
        if(selfWin.isLoaded){
            $easyui("#addChangeList").datalist("loadData",selfWin.listData.addDatas);
            $easyui("#delChangeList").datalist("loadData",selfWin.listData.delDatas);
        }
    }

    function onCollapse(){
        $easyui(win).window("move",{top:document.body.clientHeight-45,left:0});
    }

    function onExpand(){
        selfWin.layout();
    }

    this.open=function(data){
        $easyui(win).window("open");
        selfWin.layout();
    }

    this.close=function(){
        $easyui(win).window("close");
    }

    this.layout=function(){
        $easyui(win).window("move",{top:document.body.clientHeight-$easyui(win).height()-45,left:0});
        $easyui(win).window("doLayout");
    }


}

module.exports=TreeTopoChangeListWindow;