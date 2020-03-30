/**
 * 操作工具
 */
function OptionTool(toolData){
    const BaseEvent = ghca_charts.events.BaseEvent;
    const EventUtil = ghca_charts.view.util.eventUtil;
    const ToolName=require("./ToolName");
    const EditorEvent=require("./EditorEvent");
    var div=document.createElement("div");
    div.className="option_tool";
    $easyui("#editor").append(div);
    var btnList=[];

    var configData=toolData;
    var num=configData.length;
    var optionData;
    for(var i=0;i<num;i++){
        var a=document.createElement("a");
        btnList.push(a);
        //统一补齐默认信息
        if(i===0){
             configData[i].selected=true;
             optionData=configData[i];
             optionData.toolName=ToolName.SELECT;
        }
        if(i<=num-3){
            configData[i].toggle=true;
            configData[i].group='option-g';
        }
        $easyui(a).linkbutton(configData[i]);
        $easyui(a).data("optiondata",configData[i]);
        $easyui(a).bind('click',clickTool);
        $easyui(a).tooltip({
            content: configData[i].tooltip
        });
        $easyui(a).addClass("option_btn");
        $easyui(".option_tool").append(a);
    }

    d3.select("body").node().addEventListener(EditorEvent.DRAG_DRAW_STOP, resetOptionTool);
    d3.select("body").node().addEventListener(EditorEvent.DRAG_STOP, resetOptionTool);
    d3.select("body").node().addEventListener(EditorEvent.CHANGE_EDIT_STATE_TOOL, changeEditState);

    $easyui(".option_tool").css("top",$easyui("#editor").offset().top+5);

    function changeEditState(e){
        var state=e.detail;
        if(state){
            $easyui(div).fadeIn();
        }else{
            $easyui(div).fadeOut();
        }
    }

    this.setDefaultState=function(){
        $easyui(btnList[0]).trigger("click");
    }

    function resetOptionTool(){
        if(!optionData){
            return;
        }
        var evt=EventUtil.createCustomEvent(EditorEvent.RESET_OPTION_TOOL,true,true,optionData);
        d3.selectAll("body").node().dispatchEvent(evt);
    }

    function clickTool(e){
        optionData = $easyui(e.currentTarget).data("optiondata");
        var evt;
        if(optionData){
            optionData.toolName=optionData.iconCls 
        }
        evt=EventUtil.createCustomEvent(EditorEvent.CHANGE_OPTION_TOOL,true,true,optionData);
        d3.selectAll("body").node().dispatchEvent(evt);
    }
    
    this.setBtnState=function(toolName,state){
        for(var i=0;i<btnList.length;i++){
            var data=$easyui(btnList[i]).data("optiondata");
            if(data.iconCls===toolName){
                $easyui(btnList[i]).linkbutton(state?'enable':'disable');
                if(!state){
                    $easyui(btnList[i]).addClass("option_btn_disable");
                    $easyui(btnList[i]).removeClass("l-btn-disabled");
                }else{
                    $easyui(btnList[i]).removeClass("option_btn_disable");
                }
                break;
            }
        }
    }
}

module.exports=OptionTool;