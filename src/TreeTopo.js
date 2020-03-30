
function TreeTopo(){
    const IDCNode=require("./plugin/IDCNode");
    const Rect=require("./plugin/NodeBg");
    const TopoEyeCanvas=require("./TopoEyeCanvas");
    const BaseEvent = ghca_charts.events.BaseEvent;
    const EventUtil = ghca_charts.view.util.eventUtil;
    const EditorEvent=require("./EditorEvent");
    const TreeTopoFindingWindow=require("./view/TreeTopoFindingWindow");
    const TreeTopoChangeListWindow=require("./view/TreeTopoChangeListWindow");
    const ChangeTreeNodeNameWindow=require("./view/ChangeTreeNodeNameWindow");
    ghca_charts.global.outerPlugins.pluginMap["rect_bg"]=Rect;
    ghca_charts.global.outerPlugins.pluginMap["idc_node"]=IDCNode;
    var treeGraph ,tree,treeData;
    var timeGraph;
    var focusId;
    var self=this;
    var eye;
    var timeLine;
    this.EditorEvent=EditorEvent;
    var findWin=new TreeTopoFindingWindow();
    var listWind=new TreeTopoChangeListWindow();
    var changeNameWin=new ChangeTreeNodeNameWindow();
    var timeLineData;
    var timeID;
    /**
     * 初始化树拓扑
     * @param {String} id 要绑定的容器id
     * @param {Object} data 树拓扑的配置信息
     */
    this.initTreeTopo=function(treeID,timeID,data){
        self.timeID=timeID;
        testData(data);
        treeData=data.tree;
        treeGraph = new ghca_charts.view.graph(treeID, data.tree);
        treeGraph.render();
        tree=treeGraph.getChildChart().children()[0];
        eye=new TopoEyeCanvas(tree);
        tree.mainContainer().node().addEventListener(BaseEvent.CONTENT_CHANGE, changeContent);
        tree.mainContainer().node().addEventListener("topo_tree_node_dbclick", dbClickNode);
        timeLineData=data.timeLine;

        d3.select(".svgContainer").append("filter")
        .attr("id", "svg_gray").append("feColorMatrix")     
        /**
         * R 0 0 0 0
	     * 0 G 0 0 0
	     * 0 0 B 0 0
	     * 0 0 0 A 0
         **/                   
        .attr("values", "245 0 0 0 0 0 171 0 0 0 0 0 52 0 0 0 0 0 1 0");//滤镜245,171,52
        
        // treeData.series[0].nodes=treeList;
        treeGraph.setDataAndUpdate(treeData);
        console.log( "长度"+treeData.series[0].nodes.length);
        // this.addNodes([
        //     {
        //         "id": 10000,
        //         "name": "child",
        //         "nodeRenderer": "imageNode",
        //         "edgeRenderer": "110",
        //         "parentId":"192.168.3.57",
        //         "collapsed": false,
        //         "visible": true,
        //         "x": 0,
        //         "y": 0,
        //         "width": 48.0,
        //         "height": 48.0,
        //         "icon": "./res/img/node/32/no.png",
        //         "type": ""              
        //     }]);
            this.showTimeLine(true);
            this.showFindProgress(false);

            listWind.open();
            var test={
                addDatas:[
                    {
                        name:"test1",
                        value:"test1"
                    },
                    {
                        name:"test2",
                        value:"test2"
                    },
                    {
                        name:"test3",
                        value:"test3"
                    },
                ],
                delDatas:[
                    {
                        name:"testDel1",
                        value:"testDel1"
                    },
                    {
                        name:"testDel2",
                        value:"testDel2"
                    },
                    {
                        name:"testDel3",
                        value:"testDel3"
                    },
                ],
            }
            listWind.updateData(test)
    }

    function dbClickNode(d){
        var node=d.detail;
        changeNameWin.open({submitHandler:submitHandler,node:node});
    }

    function submitHandler(data){
        var evt = EventUtil.createCustomEvent("changetree_node_name", true, true, data);
        d3.selectAll("body").node().dispatchEvent(evt);
    }

    this.showChangeList=function(show)
    {
        if(show){
            listWind.open();
        }else{
            listWind.close();
        }
    }

    this.updateChangeList=function(datas){
        listWind.updateData(datas)
    }

    this.showTimeLine=function(show){
        if(timeGraph){
            timeGraph.destroy();
            timeGraph.getChildChart().removeEventListener(BaseEvent.SLIDER_MOVE_END, nodeClick);
        }

        if(show){
            timeGraph= new ghca_charts.view.graph(self.timeID, timeLineData);
            timeGraph.render();
            timeLine=timeGraph.getChildChart().children()[0];
            timeGraph.getChildChart().addEventListener(BaseEvent.SLIDER_MOVE_END, nodeClick);
        }
    }

    this.showFindProgress=function(show){
        if(show){
            findWin.open();
        }else{
            findWin.close();
        }
        
    }

    this.showSaveFindBtn=function(show){
        findWin.showSaveBtn(show);
    }

    function nodeClick(d){
        if(timeLineData.series[0].data.length===1){
            return;
        }
        var time=d.detail.data.time.getTime();
        var evt = EventUtil.createCustomEvent(EditorEvent.CLICK_TIME_LINE, true, true, time);//把时间节点丢出去
        d3.selectAll("body").node().dispatchEvent(evt);
    }

    function changeContent(){
        // console.log("changeContent");
        // console.log(focusId);
        if(!focusId){
            return;
        }
        self.centerNodesAndSelected(focusId);
        focusId=null;
    }

 
    /**
     * 添加节点
     * @param {Array} nodes 节点数组
     */
    this.addNodes=function(nodes){
        if(!nodes||nodes.length===0){
            return;
        }
        treeData.series[0].nodes=treeData.series[0].nodes.concat(nodes);
        treeGraph.setDataAndUpdate(treeData);
        focusId=nodes[nodes.length-1].id;
    }
    /**
     * 聚焦节点
     * @param {String} id 要聚焦的节点id
     */
    this.centerNodesAndSelected = function (id) {
        tree.centerNodesAndSelected(String(id), true);
    }

    /**
     * 更新数据
     */
    this.updateData=function(data){
        treeData.series[0].nodes=data.nodes;
        treeGraph.setDataAndUpdate(treeData);
        focusId= data.nodes.length>0?data.nodes[0].id:0;
    }
    
    this.update=function(node){
        treeGraph.update();
        if(node){
            focusId=node.id;
            tree.centerNodesAndSelected(String(focusId), true);
        }
    }

    this.updateTimeLineData=function(timeDatas){
        if(timeDatas.length<=0){
            return;
        }
        timeLineData.series[0].data=timeDatas;
        if (timeGraph) {
            timeGraph.destroy();
            timeGraph.getChildChart().removeEventListener(BaseEvent.SLIDER_MOVE_END, nodeClick);
        }
        if(timeDatas.length>1){
            var cd=d3.timeParse('%Y-%m-%d %H:%M:%S')(timeDatas[1].time).getTime()-d3.timeParse('%Y-%m-%d %H:%M:%S')(timeDatas[0].time).getTime();
            timeLineData.axis.xAxis[0].interval=cd/1000;
        }
        timeGraph = new ghca_charts.view.graph(self.timeID, timeLineData);
        timeGraph.render();
        timeLine = timeGraph.getChildChart().children()[0];
        timeGraph.getChildChart().addEventListener(BaseEvent.SLIDER_MOVE_END, nodeClick);
    }

    this.getNodes=function(){
        return treeData.series[0].nodes;
    }

    var isDebug=false;
    function testData(data){
        var types = ["机房", "主机"];
        var tree=data.tree;
        tree.series[0].nodes = [];
        if(isDebug){
            for (var i = 0; i < 500; i++) {
                var ed = Math.floor(Math.random() * 500);
                var end = 500 - ed;
                var d = {
                    "id": i,
                    "name": "root",
                    "nodeRenderer": "imageNode",
                    "collapsed": false,
                    "visible": true,
                    "type": "运维中心",
                    "x": 0,
                    "y": 0,
                    "width": 48.0,
                    "height": 48.0,
                    "icon": "./res/img/node/32/3.png",
                    "linkWidth": 42,
                    "health": {
                        "value": 20
                    },
                    "isClose":Math.random()>0.5?true:false
                };
                if (i > 0) {
                    d.edgeRenderer = "110";
                    d.name = "child" + i;
                    d.type = i % 2 == 0 ? types[0] : types[1];
                    d.parentId = Math.floor(Math.random() * i);
                }
                tree.series[0].nodes.push(d);
            }
        }

        var timeLine=data.timeLine;
        timeLine.series[0].data=[];
        if(isDebug){
            var startTime = "2016-01-01 12:00:00";
            var parseDateTime = d3.timeParse('%Y-%m-%d %H:%M:%S');
            var formatDateTime = d3.timeFormat('%Y-%m-%d %H:%M:%S');
            var maxValue = 100;
            for(var i = 0; i < 3; i++) {
                var d = parseDateTime(startTime);
                var r = Math.random();
                var obj = {
                    renderer:"1", 
                    time:formatDateTime(d.setTime(d.getTime() + 500 * 1000 * i)), 
                    name:"发现拓扑", 
                    value:i%2===0?25:90//计算一个划分值
                }
                timeLine.series[0].data.push(obj);
            }
        }
    }
}

module.exports=TreeTopo;