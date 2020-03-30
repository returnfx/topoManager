function CustomNodeWindow(){
    var win=document.createElement("div");
    var self=this;
    var oldSelected;
    var optionData;
    $easyui(win).window({
        title:"选择节点图",
        width:600,
        height:400,
        modal:true,
        resizable:false,
        closed:true,
        collapsible:false,
        minimizable:false,
        maximizable:false,
        closable:false,
        href:"./res/window/CustomNodeWindow.html",
        onLoad:windowInit
    });

    function windowInit(){
        $easyui("#ok_node").bind("click", clickOK);
        $easyui("#cancel_node").bind("click", self.close);
        var list=["1","2","3","4"];
        d3.select("#imglist").select("ul").selectAll("img").data(list).enter()
        .append("a")
        .append("img").attr("src","./res/img/node/48/1.png")     
        .attr("class","imglist-item")   
        .on("click",function(d){
            if(oldSelected){
                d3.select(oldSelected).attr("class","imglist-item");
            }
           d3.select(this).attr("class","imglist-item-selected");
           oldSelected=this;
        })

        oldSelected=d3.select("#imglist").select("ul").select("img")._groups[0][0];
        d3.select(oldSelected).attr("class","imglist-item-selected");

    }

    function clickOK(){
        optionData.image=d3.select(oldSelected).attr("src");
        self.close();
        if(okCall){
            okCall();
        }
    }

    this.open=function(data,callBack){
        optionData=data;
        okCall=callBack;
        $easyui(win).window("open");
    }

    this.close=function(){
        $easyui(win).window("close");
    }
}

module.exports=CustomNodeWindow;