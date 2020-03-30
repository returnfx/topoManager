function PortGroupWindow(){
    var win=document.createElement("div");
    const BaseEvent = ghca_charts.events.BaseEvent;
    const EventUtil = ghca_charts.view.util.eventUtil;
    const EditorEvent=require("../EditorEvent");
    const topoConfig=require("../data/portGroupTopo");
    const ToolData=require("../data/toolData");
    const MrtgInfoWindow=require("./MrtgInfoWindow");
    var mrtgInfoWindow=new MrtgInfoWindow();
    var graph;
    var freshSeat=0;
    var linksData;
    var freshCD=2*60*1000;
    $easyui(win).window({
        title:"端口分组",
        width:"90%",
        height:"90%",
        modal:true,
        resizable:false,
        closed:true,
        collapsible:false,
        minimizable:false,
        maximizable:false,
        closable:true,
        href:"./res/window/PortGroupWindow.html",
        onLoad:windowInit,
        onClose:winClose,
    });

    function windowInit(){
        graph=new ghca_charts.view.graph("portGroupTopo", topoConfig);
        graph.autoResize(false);
        graph.render(); 
        topo = graph.getChildChart().children()[0];
        topo.dragNodeAble(true);
        var evt= EventUtil.createCustomEvent(BaseEvent.MODE_CHANGE, true, true, false);
        d3.selectAll("#portGroupTopo").selectAll("g.seriesTopo").node().dispatchEvent(evt);
        linksData = topo.getVisibleLinks(topo.links);
        if(!isRunFresh){
            toFreshFluxAndAlarm();
        }

        topo.addNodeClickHandler(nodeClick);
    }

    function nodeClick(event){
        var d=event.currentTarget.__data__;
        if(!d||d.ports===undefined){
            return;
        }
        mrtgInfoWindow.open(d);
    }

    this.open=function(d){
        $easyui(win).window("open");
        isClose=false;
        var nodes=[];
        var links=[];
        var reqD=d.reqNode;
        var data=d.data;
        var sourceNode={
            id:data.length!=0?data[0].fromID:reqD.id,
            name:reqD.name,
            renderer:reqD.renderer,
            width: 48.0,
            height: 48.0,
            icon: reqD.icon,
            visible:true,
            type:reqD.type,
        }
        nodes.push(sourceNode);
        //datas
        for(var i=0;i<data.length;i++){//返回的全是端口
            var d=data[i];
            var node={
                id:d.id,
                name:d.name,
                ports:d.ports,
                fromID:d.fromID,
                toID:d.toID,
                edgeLabel:d.edgeLabel,
                renderer: "imageNode",
                visible: "true",
                width: 48.0,
                height: 48.0,
                icon: "./res/img/node/32/8.png",
                visible:true,
                type:"portnode"
            }
            nodes.push(node);
            var link = {
                id: node.toID, //link的id就是目标节点的id，因为这儿没有多重连接
                name: "",
                source: node.fromID,
                target: node.toID,
                visible: true,
                ports: node.ports,
                renderer: "link"
            }
            links.push(link);
        }

        //test
        // if (data.length == 0) {
        //     var num=Math.ceil(Math.random()*20)+20;
        //     for (var i = 0; i < num; i++) {
        //         var node = {
        //             id: 1777 + i,
        //             name: "name" + i,
        //             ports: "1,2,30",
        //             fromID: sourceNode.id,
        //             toID: 1777 + i,
        //             edgeLabel: "0/80",
        //             renderer: "imageNode",
        //             visible: "true",
        //             width: 48.0,
        //             height: 48.0,
        //             icon: "./res/img/node/32/3.png",
        //             visible: true,
        //             type: "portnode"
        //         }
        //         var link = {
        //             id: node.id,
        //             name: "",
        //             source: node.fromID,
        //             target: node.toID,
        //             ports: node.ports,
        //             visible: true,
        //             renderer: "link"
        //         }
        //         links.push(link);
        //         nodes.push(node);
        //     }
        // }
       
        topoConfig.series[0].nodes=nodes;
        topoConfig.series[0].links=links;
        ToolData.addDefaultData(topoConfig.series[0]);
        sourceNode.type="portnode";
        if(graph){
            graph.setDataAndUpdate(topoConfig);
            if(!topo){
                topo = graph.getChildChart().children()[0];
            }
            linksData = topo.getVisibleLinks(topo.links);
            topo.x(0);
            topo.y(0);
            topo.scaleX(1);
            topo.scaleY(1);
            topo.renderTransform();
        }

        if(!isRunFresh){
            toFreshFluxAndAlarm();
        }
    }

    var currentLinkData;
    var currentNodeData;
    var isRunFresh=false;
    function toFreshFluxAndAlarm(){
        if(!graph){
            return;
        }
        if(isClose){
            return;
        }
        isRunFresh=true;
        if(freshSeat<linksData.length){
            currentLinkData=linksData[freshSeat];
            currentNodeData=findNodeData(currentLinkData.id);
            var portIds=currentLinkData.ports;
            var evt=EventUtil.createCustomEvent(EditorEvent.NET_PORTGROUP_FLUX,true,true,portIds);
            d3.selectAll("body").node().dispatchEvent(evt);   
        }

    }

    function findNodeData(id){
        var nodes=topo.nodes;
        for(var i=0;i<nodes.length;i++){
            var node=nodes[i];
            if(node.id===id){
              return  node;
            }
        }
        return null;
    }

    var timerout;
    this.updateLinkAndNode=function(d){
        freshSeat++;
        var data=JSON.parse(d);
        if(data.input===undefined){
            data.input=Math.ceil(Math.random()*20);
        }
        if(data.output===undefined){
            data.output=Math.ceil(Math.random()*30);
        }
        if(data.unit===undefined){
            data.unit="bps";
        }
        if(data.portNum===undefined||data.portNum===0){
            data.portNum=Math.ceil(Math.random()*80);
        }
        if(data.alarmPortNum===undefined){
            data.alarmPortNum=Math.ceil(Math.random()*data.portNum);
        }

        currentNodeData.warnDatas=[data];
        currentNodeData.ins.update();
        // currentLinkData.name="流入:"+data.input+data.unit+" 流出:"+data.output+data.unit;
        // currentLinkData.ins.update();

        if(freshSeat>=linksData.length){
            freshSeat=0;
            timerout=setTimeout(toFreshFluxAndAlarm,freshCD);
        }else{
            toFreshFluxAndAlarm();
        }

    }

    var isClose=true;
    function winClose(){
        clearTimeout(timerout);
        isRunFresh=false;
        freshSeat=0;
        isClose=true;
    }
}

module.exports=PortGroupWindow;