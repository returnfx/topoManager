function EditorMenu(){
    var toolData=require("./data/toolData");
    var IDCWindowManager=require("./IDCWindowManager");
    $easyui("#menu").menu({
        onClick:clickMenu
    });

    function clickMenu(item){
        IDCWindowManager.showOutWindow(item);
    }

    this.showMenu=function(targetIns,editState){
       d3.select("#menu").selectAll("div").data([]).exit().remove();
       var targetMenus=toolData.menuData[targetIns.data().type];//后台给的type是数字...
       if(!targetMenus){
            return;
       }

       var menus=[];
       for(var i=0;i<targetMenus.length;i++){
            if(targetMenus[i].editShow===undefined||targetMenus[i].editShow===editState){
                menus.push(targetMenus[i]);
            }
       }
       if(menus.length===0){
            return;
       }



       for(var i=0;i<menus.length;i++){
            $easyui("#menu").menu("appendItem",{
                text:menus[i].title,
                name:menus[i].name,
                data:targetIns.data()
            })
       }
       
       $easyui("#menu").menu("show",{
            left: d3.event.pageX,
            top: d3.event.pageY
       });

        console.log(targetIns);
    }

    this.hideMenu=function(){
        $easyui("#menu").menu("hide");
    }
}

module.exports=EditorMenu;