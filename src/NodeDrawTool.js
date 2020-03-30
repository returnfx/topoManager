
/**
 * 节点绘制工具
 */
function NodeDrawTool(toolData){
    const EditorEvent=require("./EditorEvent");
    const EventUtil = ghca_charts.view.util.eventUtil;
    const ToolName=require("./ToolName");
    var configData=toolData[0];//因为用的编辑器的配置格式所以用第一组
    var height=configData.nodes[0].height;
    var panel=$easyui('#node_tool')
    var drawData;
    $easyui('#editor').layout('panel','south').panel("resize",{height:height});
    $easyui('#editor').layout();
    var editIcon="./res/img/icon/pencil.png";
    var lockIcon="./res/img/icon/lock.png";
    
    var num=configData.nodes.length;
    for(var i=0;i<num;i++){
        if(configData.nodes[i].type==="portnode"){
            continue;
        }
        var a=document.createElement("a");
        configData.nodes[i].iconCls='icon-search';
        $easyui(a).linkbutton({iconCls:'icon-search'});
        $easyui(a).tooltip({
            content: configData.nodes[i].name
        });
        var spanBorder=$easyui(a).context.children[0].children[0];
        $easyui(spanBorder).css("width","42px");
        $easyui(spanBorder).css("line-height","42px");
        var spanIcon=$easyui(a).context.children[0].children[1];
        $easyui(spanIcon).css("background-image","url("+configData.nodes[i].icon+")");
        $easyui(spanIcon).removeClass("icon-search");
        $easyui(spanIcon).addClass("node-draw-icon");
        $easyui(spanIcon).css("left","7px");
        $easyui(spanIcon).data("optiondata",configData.nodes[i]);
        panel.append(a);
    }
    var wP=$easyui('#edit_tool');
    $easyui(wP).css("overflow","hidden");
    var editBtn=document.createElement("a");
    $easyui(editBtn).linkbutton({iconCls:'icon-search'});
    var spanBorder=$easyui(editBtn).context.children[0].children[0];
    $easyui(spanBorder).css("width","60px");
    $easyui(spanBorder).css("line-height","60px");
    var editBtnIcon=$easyui(editBtn).context.children[0].children[1];
    $easyui(editBtnIcon).css("background-image","url("+lockIcon+")");
    $easyui(editBtnIcon).css("background-size","36px 36px");
    $easyui(editBtnIcon).css("width","36px");
    $easyui(editBtnIcon).css("height","36px");
    $easyui(editBtnIcon).css("background-position-x","center");
    $easyui(editBtnIcon).css("background-position-y","center");
    $easyui(editBtnIcon).css("margin-top","-18px");
    $easyui(editBtnIcon).css("left","12px");
    wP.append(editBtn);
    $easyui(editBtn).bind('click',changeEditState);
    $easyui(editBtnIcon).tooltip({
        content: "锁定"
    });
    

    // var exportBtn=document.createElement("a");
    // exportBtn.id="exportBtn";
    // $easyui(exportBtn).linkbutton({text:'导 出'});
    // wP.append(exportBtn);
    // $easyui(exportBtn).addClass("export_btn");
    // $easyui(exportBtn).bind('click',toExportIdc);

    function toExportIdc(){
        if($easyui(exportBtn).linkbutton("options").disabled){
            return;
        }
        var evt=EventUtil.createCustomEvent(EditorEvent.NET_EXPORT_IDC,true,true);
        d3.selectAll("body").node().dispatchEvent(evt);     
    }

    
    var editState=true;
    function changeEditState(){
        editState=!editState;
        updateTool();     
    }
    function updateTool(){
        if(editState){
            $easyui(panel).fadeIn();
            $easyui(editBtnIcon).css("background-image","url("+lockIcon+")");
            $easyui(editBtnIcon).css("background-size","36px 36px");
            $easyui(editBtnIcon).css("left","12px");
            $easyui(editBtnIcon).tooltip({
                content: "锁定"
            });
        }else{
            $easyui(editBtnIcon).tooltip({
                content: "编辑"
            });
            $easyui(editBtnIcon).css("background-image","url("+editIcon+")");
            $easyui(editBtnIcon).css("background-size","36px 36px");
            $easyui(editBtnIcon).css("left","12px");
            $easyui(panel).fadeOut();
        }

        var evt=EventUtil.createCustomEvent(EditorEvent.CHANGE_EDIT_STATE_TOOL,true,true,editState);
        d3.selectAll("body").node().dispatchEvent(evt);     
    }

    this.changeEditMode=function(mode){
        editState=mode;
        updateTool();
    }

    $easyui(".node-draw-icon").draggable({
        revert: true,
        onStartDrag: function () {
            $easyui(this).draggable('options').cursor = 'move';
            var optionData={};
            optionData.toolName=ToolName.ADD_NODE;
            var evt=EventUtil.createCustomEvent(EditorEvent.CHANGE_OPTION_TOOL,true,true,optionData);
            d3.selectAll("body").node().dispatchEvent(evt);          
        },
        onStopDrag: function () {
            $easyui(this).draggable('options').cursor = 'move';   
            var evt=EventUtil.createCustomEvent(EditorEvent.DRAG_STOP,true,true);//告诉外界拖结束了
            d3.selectAll("body").node().dispatchEvent(evt);      
        },
        proxy: function (source) {
            var p = $easyui('<div style="pointer-events: none"></div>');
            p.appendTo('body');
            $easyui(p).css('z-index', 60);
            var img = document.createElement("img");
            drawData=$easyui(source).data("optiondata");
            img.src =drawData.icon;
            img.width=height;
            img.height=height;
            // drawData.image=img.src;
            p.append(img);
            return p;
        }
    });

    //class="easyui-slider" value="50" data-options="showTip:true,min:100,max:500,step:100"
    var sd=$easyui("#slider").slider({
        mode: 'v',
        min:30,
        max:300,
        step:10,
        showTip:true,
        tipFormatter: function(value){
            return value + '%';
        },
        onSlideEnd:function(value){
            var evt=EventUtil.createCustomEvent(EditorEvent.CHANGE_EDIT_SCALE,true,false,value);
            d3.selectAll("body").node().dispatchEvent(evt);      
        }
    });
    d3.select("body").node().addEventListener(EditorEvent.CHANGE_ZOOM, changeScale);

    function changeScale(e){
        var scale=Math.floor(e.detail*100);
        $easyui("#slider").slider("setValue",scale);
    }

    $easyui(".slider-inner>a").removeAttr("href");


    $easyui("#topo_edit").droppable({
        accept: ".node-draw-icon",
        onDragEnter:function(e,source){
            var evt = EventUtil.createCustomEvent(EditorEvent.CHANGE_NODE_DATA,true,false,drawData);
            d3.selectAll("body").node().dispatchEvent(evt);
        },
        onDragLeave:function(e,source){
            var evt = EventUtil.createCustomEvent(EditorEvent.CHANGE_NODE_DATA,true,false,null);
            d3.selectAll("body").node().dispatchEvent(evt);
        },
        onDrop:function(e,source){
            var evt=EventUtil.createCustomEvent(EditorEvent.DRAG_DRAW_STOP,true,true);//告诉外界拖结束了
            d3.selectAll("body").node().dispatchEvent(evt);   
        }
    });
}

module.exports=NodeDrawTool;