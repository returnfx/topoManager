// const CustomNodeWindow=require("./CustomNodeWindow");
// const SelectNodeBgWindow=require("./SelectNodeBgWindow");
const EventUtil = ghca_charts.view.util.eventUtil;
const EditorEvent=require("./EditorEvent");
// var customNodeWindow=new CustomNodeWindow();
// var selectNodeBgWindow=new SelectNodeBgWindow();
const PortGroupWindow=require("./view/PortGroupWindow");
var portGroupWindow=new PortGroupWindow();
var IDCWindowManager={};



IDCWindowManager.showSetNodeImgWin=function(data,callBack){
    switch(data.type){
        // case "customnode":
        //     customNodeWindow.open(data,callBack);
        // break;
        // case "bgnode":
        //     selectNodeBgWindow.open(data,callBack);
        // break;    
        default://普通节点
            callBack();
        break
    }
}

IDCWindowManager.showPortGroupWindow=function(data){
    portGroupWindow.open(data);
}


IDCWindowManager.updatePortGroupLinkAndNode=function(data){
    portGroupWindow.updateLinkAndNode(data);
}

IDCWindowManager.showOutWindow=function(item){
    var evt=EventUtil.createCustomEvent(EditorEvent.NET_RIGHT_MENU,true,true,item);
    d3.selectAll("body").node().dispatchEvent(evt); 
}

module.exports=IDCWindowManager;