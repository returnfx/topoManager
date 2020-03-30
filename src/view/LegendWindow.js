function LegendWindow(data){
    var win=document.createElement("div");
    win.id="tttt";
    var datas=[
        {x1:10,x2:40,y:20,color:"#ff0000",text:"text1",tx:50},
        {x1:10,x2:40,y:40,color:"#ffff00",text:"text2",tx:50},
        {x1:10,x2:40,y:60,color:"#ff00ff",text:"text3",tx:50},
        {x1:10,x2:40,y:80,color:"#00ff00",text:"text4",tx:50},
        {x1:10,x2:40,y:100,color:"#00ff00",text:"text4",tx:50},
    ];
    var selfWin=this;
    $easyui(win).window({
        width:160,
        height:160,
        modal:false,
        resizable:false,
        closed:true,
        collapsible:true,
        minimizable:false,
        maximizable:false,
        closable:false,
        href:"./res/window/LegendWindow.html",
        onLoad:windowInit,
        onCollapse:onCollapse,
        onExpand:onExpand
    });

    $easyui(win).css("overflow","hidden");

    function onCollapse(){
        console.log("onCollapse");
        // selfWin.layout()
    }

    function onExpand(){
        console.log("onExpand");
        // selfWin.layout()
    }

    function windowInit(){
        d3.select("#idc_legend_svg").selectAll("line").remove();
        d3.select("#idc_legend_svg").selectAll("text").remove();
        d3.select("#idc_legend_svg").selectAll("line").data(datas).enter().append("line")
        .attr("x1",function(d){
            return d.x1;
        }).attr("y1",function(d){
            return d.y;
        }).attr("x2",function(d){
            return d.x2;
        }).attr("y2",function(d){
            return d.y;
        }).attr("style",function(d){
            return "stroke:"+d.color+";stroke-width:2"
        });

        d3.select("#idc_legend_svg").selectAll("text").data(datas).enter().append("text")
        .text(function(d){
            return d.text;
        }).attr("x",function(d){
            return d.tx;
        }).attr("y",function(d){
            return d.y+3;
        }).attr("style",function(d){
            return "fill:"+d.color;
        });

        d3.select(".panel-tool>a").attr("href",null);//将链接的提示移除掉
    }

    /**
     * 开启图例窗口
     * {
     * title:"test",
     * infos:[
     *  {color:"#ff0000",text},
     *  {color:"#ff0000",text},
     *  {color:"#ff0000",text},
     *  {color:"#ff0000",text},
     *  {color:"#ff0000",text}
     * ]
     * }
     * @param {*} data 
     */
    this.open=function(data){
        $easyui(win).window("setTitle",data.title);
        $easyui(win).window("open");

        for(var i=0;i<data.infos.length;i++){
            datas[i].color=data.infos[i].color;
            datas[i].text=data.infos[i].text;
        }
        windowInit();
        selfWin.layout();
    }

    this.close=function(){
        $easyui(win).window("close");
    }

    this.layout=function(){
        var panelC=$easyui('#editor').layout('panel','center');
        $easyui(win).window("move",{left:$easyui(panelC).offset().left,top:document.body.clientHeight-330});
    }
}

module.exports=LegendWindow;

