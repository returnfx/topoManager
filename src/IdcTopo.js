/**
 * idc拓扑图主入口
 */
function IdcTopo(){
    const EditorEvent=require("./EditorEvent");
    const NodeDrawTool=require("./NodeDrawTool");
    const OptionTool=require("./OptionTool");
    const TopoEditor=require("./TopoEditor");
    const IDCNode=require("./plugin/IDCNode");
    const PortGroupNode=require("./plugin/PortGroupNode");
    const toolData=require("./data/toolData");
    const topoConfig=require("./data/topoEditorData");
    const Rect=require("./plugin/NodeBg");
    var nodeDrawTool,optionTool,topoEditor;
    ghca_charts.global.outerPlugins.pluginMap["rect_bg"]=Rect;
    ghca_charts.global.outerPlugins.pluginMap["idc_node"]=IDCNode;
    ghca_charts.global.outerPlugins.pluginMap["port_group_node"]=PortGroupNode;

    this.EditorEvent=EditorEvent;

    /**
     * 初始化编辑器
     * @param {*} topoData 
     */
    this.initEditor=function(topoData){
        if(!topoData){
            // console.log("未传递初始化数据信息!!");
        }
        nodeDrawTool=new NodeDrawTool(toolData.drawToolData);
        topoConfig.series[0].nodes=topoData&&topoData.nodes?topoData.nodes:[];
        topoConfig.series[0].links=topoData&&topoData.links?topoData.links:[];
        topoConfig.series[0].groups=topoData&&topoData.groups?topoData.groups:[];
        optionTool=new OptionTool(toolData.optionToolData);
        topoEditor=new TopoEditor(topoConfig,optionTool); 
        if(topoData&&topoData.ctx){
            window.ctx=topoData.ctx;
        }
        // console.log("jquery版本："+$.fn.jquery);
        // console.log("EasyUI jquery版本："+$easyui.fn.jquery);
    }

    this.toolData=function(){
        return toolData;
    }

    this.editor=function(){
        if(!topoEditor){
            return null;
        }
        return topoEditor;
    }

    this.showPortGroup=function(data){
        if(!topoEditor){
            return ;
        }
        topoEditor.showPortGroup(data);
    }


    /**
     * 添加节点
     */
    this.addNode=function(nodeData){
        if(!topoEditor){
            return;
        }

        topoEditor.addNode(nodeData);
    }

    this.changeEditMode=function(mode){
        if(!topoEditor){
            return;
        }
        nodeDrawTool.changeEditMode(mode);
    }

    /**
     * 获取当前拓扑图数据
     * {
     *      nodes:topoData.nodes,
     *      links:topoData.links,
     *      groups:topoData.groups,
     *  }
     */
    this.getCurrentTopoData=function(){
        if(!topoEditor){
            return null;
        }
       return topoEditor.getCurrentTopoData();
    }

    /**
     * 添加组
     * @param {*} data 
     */
    this.addGroup=function(data){
        if(!topoEditor){
            return;
        }
        topoEditor.addGroup(data);
    }


    /**
     * 删除被选中节点
     */
    this.deleteSelectedNodes=function(){
        if(!topoEditor){
            return;
        }
        topoEditor.deleteSelectedNode();
    }

    /**
     * 添加连线
     * @param {*} datas 
     */
    this.addLinks=function(datas){
        if(!topoEditor){
            return;
        }
        topoEditor.addLinks(datas);
    }

    /**
     * 改变节点图
     * @param {*} data 
     */
    this.changeNodeImage=function(id,img){
        if(!topoEditor){
            return;
        }
        var data={
            id:id,
            icon:img
        }
        topoEditor.updateNodeByData(data);
    }

    /**
     * 更新节点警告类型
     * @param {*} data 
     */
    this.updateNodeWarnType=function(id,warnType){
        if(!topoEditor){
            return;
        }
        var data={
            id:id,
            warnType:warnType
        }
        topoEditor.updateNodeByData(data);
    }

    /**
     * 更新节点指定的属性数据
     * @param {*} data 
     */
    this.updateNodeByData=function(data){
        if(!topoEditor){
            return;
        }
        topoEditor.updateNodeByData(data);
    }

    /**
     * 显示节点警告
     * @param {*} state 
     */
    this.showNodeWarn=function(state){
        if(!topoEditor){
            return;
        }
        topoEditor.showNodeWarn(state);
    }
    
    /**
     * 显示图例窗口
     * 如果数据为空关闭掉
     * @param {*} data 
     */
    this.showLegendWin=function(data){
        if(!topoEditor){
            return;
        }
        topoEditor.showLegendWin(data);
    }

    /**
     * 更新连线
     * @param {*} datas 
     */
    this.updateLinks=function(datas){
        if(!topoEditor){
            return;
        }
        topoEditor.updateLinks(datas);
    }

    /**
     * 更新数据
     * @param {*} topoData 
     */
    this.updateData=function(topoData){
        if(!topoEditor){
            return;
        }
        topoEditor.updateData(topoData);
    }

    /**
     * 获取节点数据
     * @param {*} id 
     */
    this.findNodeData=function(id){
        if(!topoEditor){
            return null;
        }

        return topoEditor.findNodeData(id);
    }

    /**
     * 获取连线数据
     * @param {*} id 
     */
    this.findLinkData=function(id){
        if(!topoEditor){
            return null;
        }

        return topoEditor.findLinkData(id);
    }

    /**
     * 聚焦到指定点上去
     * @param {*} id 
     */
    this.focusOnNode=function(id){
        if(!topoEditor){
            return null;
        }

        return topoEditor.focusOnNode(id);
    }

    /**
     * 选择连线
     */
    this.selectLink=function(id){
        if(!topoEditor){
            return null;
        }

        return topoEditor.selectLink(id);
    }

    /**
     * 合并连线
     */
    this.mergeLinks=function(){
        if(!topoEditor){
            return ;
        }

        return topoEditor.mergeLinks();
    }

    /**
     * 显示合并连线
     */
    this.showMergeLinks=function(data){
        if(!topoEditor){
            return ;
        }

        return topoEditor.showMergeLinks(data);
    }

    /**
     * 分离连线
     */
    this.separateLinks=function(){
        if(!topoEditor){
            return ;
        }

        return topoEditor.showSeparateLinks();
    }

    /**
     * 获取合并的数据
     */
    this.getMergeData=function(){
        if(!topoEditor){
            return null;
        } 

        return topoEditor.getMergeData();
    }
}

module.exports=IdcTopo;