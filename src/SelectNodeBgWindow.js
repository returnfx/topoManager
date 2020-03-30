function SelectNodeBgWindow(){
    var win=document.createElement("div");
    var self=this;
    var oldSelected;
    var optionData;
    $easyui(win).window({
        title:"选择背景图",
        width:600,
        height:400,
        modal:true,
        resizable:false,
        closed:true,
        collapsible:false,
        minimizable:false,
        maximizable:false,
        closable:false,
        href:"./res/window/SelectNodeBgWindow.html",
        onLoad:windowInit
    });

    function windowInit(){
        $easyui("#ok_bg_node").bind("click", clickOK);
        $easyui("#cancel_bg_node").bind("click", self.close);
        var list=["1","2","3","4"];
        d3.select("#imgBglist").select("ul").selectAll("img").data(list).enter()
        .append("a")
        .append("img").attr("src","./res/img/bg/test.png")     
        .attr("class","imgBglist-item")   
        .on("click",function(d){
            if(oldSelected){
                d3.select(oldSelected).attr("class","imgBglist-item");
            }
           d3.select(this).attr("class","imgBglist-item-selected");
           oldSelected=this;
        })

        oldSelected=d3.select("#imgBglist").select("ul").select("img")._groups[0][0];
        d3.select(oldSelected).attr("class","imgBglist-item-selected");
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

module.exports=SelectNodeBgWindow;