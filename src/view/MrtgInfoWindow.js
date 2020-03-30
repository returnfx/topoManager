function MrtgInfoWindow(){
    const mrtgConfg=require("../data/mrtg");
    var Graph = ghca_charts.view.graph;
   
    var win=document.createElement("div");
    var graph;
    var refreshCD=2*60*1000;

    $easyui(win).window({
        title:"端口分组流量",
        width:"90%",
        height:"90%",
        modal:true,
        resizable:false,
        closed:true,
        collapsible:false,
        minimizable:false,
        maximizable:false,
        closable:true,
        href:"./res/window/MrtgInfoWindow.html",
        onLoad:windowInit,
        onClose:winClose,
        onResize:onResize,
    });

    function onResize(width, height){
        if(graph){
            graph.resize();
        }
    }

    function windowInit(){
        graph = new Graph("mrtgContent", mrtgConfg);
        graph.render();
    }

    function winClose(){
        clearTimeout(refreshTime);
    }

    var refreshTime=0;
    var reqData;
    this.open=function(d){
        $easyui(win).window("open");   
        reqData=d;
        refreshData();
    }

    function refreshData(){
        var formatDateTime = d3.timeFormat('%Y-%m-%d %H:%M:%S');
        $easyui.ajax({
            type:'POST',
            url:ctx+"/nsm/getPortFluxData",
            data:{
                portIds:reqData.ports
            },
            async: false,
            dataType: 'json',
            success: function (data) {
                var list=JSON.parse(data.detail);
                var num=list.length;
                mrtgConfg.series[0].data=[];
                mrtgConfg.series[1].data=[];
                var vs=getUintV(data.inputAvg,data.inputMax);
                var inputAvg=vs[0]+vs[1];
                vs=getUintV(data.outputAvg,data.outputMax);
                var outputAvg=vs[0]+vs[1];
                vs=getUintV(data.inputMax,data.inputMax);
                var inputMax=vs[0]+vs[1];
                vs=getUintV(data.outputMax,data.outputMax);
                var outputMax=vs[0]+vs[1];
                window.mrgtUint=vs[1];
                for(var i=0;i<num;i++){
                    var t=list[i];
                    vs=getUintV(t.input,data.inputMax);
                    mrtgConfg.series[0].data.push({
                        renderer:"1", 
                        time:t.retime, 
                        value:vs[0],
                        avg:inputAvg,
                        max:inputMax,
                        name:"流入"
                    });
                    vs=getUintV(t.output,data.outputMax);
                    mrtgConfg.series[1].data.push({
                        renderer:"1", 
                        time:t.retime, 
                        value:vs[0],
                        total:t.total,
                        avg:outputAvg,
                        max:outputMax,
                        name:"流出"
                    });
                }
                if(graph){
                    graph.setDataAndUpdate(mrtgConfg);
                }
                refreshTime=setTimeout(refreshData,refreshCD);
            }, error: function (data) {
                console.error(data);
                refreshTime=setTimeout(refreshData,refreshCD);
            }
        });
    }

    
function getUintV(v,maxV){
    //1kbps=1000bps=0.001Mpbs;
    //1000bps=1kbps,1000000bps=1Mbps,1000000000=1Gbps
    var vList=[1000,1000000,1000000000,1000000000000];
    var unitList=["bps","K","M","G"];
    var u=unitList[3];
    var per=vList[3]
    for(var i=0;i<vList.length;i++){
        if(maxV<=vList[i]){
            if(i>0){
                u=unitList[i];
                per=vList[i-1];
            }else{
                u=unitList[0];
                per=1;
            }
            break;
        }
    }
    return  [(v/per).toFixed(2),u];
}

}

module.exports=MrtgInfoWindow;