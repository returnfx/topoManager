function TreeTopoFindingWindow(data){
    const EditorEvent=require("../EditorEvent");
    const EventUtil = ghca_charts.view.util.eventUtil;
    var win=document.createElement("div");
    win.id="TreeTopoFindingWindow";
    var selfWin=this;
    var bgDiv;
    var saveBtn;
    var stopBtn;
    $easyui(win).window({
        width:"100%",
        height:160,
        modal:false,
        resizable:false,
        closed:true,
        collapsible:false,
        minimizable:false,
        maximizable:false,
        closable:false,
        draggable:false,
        title:"",
        href:"./res/window/FindTreeTopoWindow.html",
        onLoad:windowInit
    });

    $easyui(win).css("overflow","hidden");
    function windowInit(){
        bgDiv= d3.select("#treeTopoFindingPanel");
        bgDiv.style("background-color","#555");
        bgDiv.append("div")
        .attr("class","find_progress")
        .append("img")
        .attr("src","./res/img/progress.gif")
      
        stopBtn=document.createElement("a");
        bgDiv.node().append(stopBtn);
        saveBtn=document.createElement("a");
        bgDiv.node().append(stopBtn);
        bgDiv.node().append(saveBtn);
        $easyui(stopBtn).linkbutton({
            text:"停止"
        })
        $easyui(saveBtn).linkbutton({
            text:"保存"
        })
        $easyui(stopBtn).addClass("stop_find");
        $easyui(saveBtn).addClass("save_find");
        selfWin.layout();
        $easyui(stopBtn).bind('click',toStop);
        $easyui(saveBtn).bind('click',toSave);
        selfWin.showSaveBtn(false);
    }

    this.showSaveBtn=function(show){
        $easyui(saveBtn).css("display",show?"":"none");
        // $easyui(stopBtn).css("display",show?"":"none");
        // if(!show){

        // }

        // $easyui(stopBtn).removeClass("stop_find");
        // $easyui(stopBtn).removeClass("save_find");
        // $easyui(saveBtn).removeClass("save_find");
        // $easyui(saveBtn).removeClass("stop_find");
        // if(show){
        //     $easyui(stopBtn).addClass("save_find");
        //     $easyui(saveBtn).addClass("stop_find");
        // }else{
        //     $easyui(stopBtn).addClass("save_find");
        //     $easyui(saveBtn).addClass("stop_find");
        // }
    }

    function toSave(){
        var evt = EventUtil.createCustomEvent(EditorEvent.SAVE_FIND, true, true);
        d3.selectAll("body").node().dispatchEvent(evt);
    }
    function toStop(){
        var evt = EventUtil.createCustomEvent(EditorEvent.STOP_FIND, true, true);//告诉外部停止发现topo
        d3.selectAll("body").node().dispatchEvent(evt);
    }

    this.open=function(data){
        $easyui(win).window("open");
        selfWin.layout();
    }

    this.close=function(){
        $easyui(win).window("close");
    }

    this.layout=function(){
        $easyui(win).window("move",{top:document.body.clientHeight-160});
    }

    $easyui("#TreeTopoFindingWindow").panel({
        onResize: function (w, h) {
            selfWin.layout();
        }
    })

}

module.exports=TreeTopoFindingWindow;