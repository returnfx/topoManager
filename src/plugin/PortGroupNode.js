
/**
 * 端口分组节点
 * @param {*} _element 
 * @param {*} _data 
 */
function PortGroupNode(_element,_data){
    const IconNode = ghca_charts.view.elements.plugins.nodes.IconNode;
    const ImageElement = ghca_charts.view.elements.imageElement;
    const TopoLabel = ghca_charts.view.elements.plugins.label.topoLabel;
    const ObjectUtil = ghca_charts.view.util.objectUtil;
    const WarnData=require("../data/toolData").warnData;
    const RectElement=ghca_charts.view.elements.rectElement;
    IconNode.apply(this,arguments);
    var selfNode=this;
    var superUpdate=selfNode.update;
    var superDrawPlugin=selfNode.drawPlugin;
    var data=_data;

    var warnLabelList=[];
    var warnIconList=[];
    var warnBgList=[];
    var _g;

    //override
    this.nameSpace = function(){
        return "idc_node";
    }

    //override
    this.update = function(g){
        superUpdate(g);
        updateWarn();

        if(selfNode.data().isClose){//节点关闭置灰
            _g.select(".icon_image").attr("filter","url('#svg_gray')");
        }else{
            _g.select(".icon_image").attr("filter",null);
        }
    }

    function updateWarn(){
        _g.selectAll(".topolabel").remove();
        while(warnLabelList.length>0){
            var item=warnLabelList.pop();
            item.remove();
        }
        while(warnIconList.length>0){
            var item= warnIconList.pop();
            item.svgElement.remove();
        }
        while(warnBgList.length>0){
            var item=warnBgList.pop();
            item.svgElement.remove();
        }

        var warnDatas=selfNode.data().warnDatas;
        if(!warnDatas){   
            return;
        }
        var list=[
            warnDatas[0],
            warnDatas[0],
            warnDatas[0]
        ];

        var halfHeight=selfNode.data().height*0.5;
        var zone=[0,0.2,0.4,0.6,0.8,1];
        for(var i=0;i<list.length;i++){
            var warnData=list[i];
            var v=(warnData.alarmPortNum/warnData.portNum).toFixed(2);
            for(var j=0;j<zone.length;j++){
                if(v<zone[j]){
                    warnData.level=j;
                    break;
                }
            }
            var warnCfg=ObjectUtil.cloneObj(selfNode.data().data.config.label.warn);
            var warnType;
            if(i==0){
                warnType=warnData.level;
                warnCfg.text="告警:"+warnData.alarmPortNum+"/"+warnData.portNum;
            }else if(i==1){
                warnType="1";
                warnCfg.text="流入:"+(warnData.input/1000000).toFixed(2)+"Mb";
            }else if(i==2){
                warnType="1";
                warnCfg.text="流出:"+(warnData.output/1000000).toFixed(2)+"Mb";
            }

            warnCfg.color=WarnData.bgColors[warnType];
            warnCfg.opacity=WarnData.bgOps[warnType];
            warnCfg.fontColor=WarnData.lbColors[warnType];

            var iconConfig=null;
            if(i==0&&WarnData.icons[warnType]){
                iconConfig = {
                    url: WarnData.icons[warnType],
                    imageHeight: 16,
                    imageWidth: 16
                };
            }
            

            var rectElement = new RectElement(_g, warnCfg);
            rectElement.render();
            var warnIcon=null;
            if(iconConfig){
                warnIcon=new ImageElement(_g,iconConfig);
                warnIcon.render();
                warnIcon.data(iconConfig);
                warnIcon.svgElement.attr("y",-halfHeight+i*18);
                warnIcon.svgElement.attr("x",halfHeight);
            }
            

            var  warnLabel=new TopoLabel(_g,_data);
            warnLabel.config(warnCfg);
            warnLabel.render();
            warnLabel.getRectElement().svgElement.attr("pointer-events","none");
            if(iconConfig){
                warnLabel.transform("translate("+(halfHeight+18)+","+(-halfHeight+i*18)+")");
            }else{
                warnLabel.transform("translate("+(halfHeight)+","+(-halfHeight+i*18)+")");
            }

            rectElement.svgElement.attr("pointer-events", "none");
            rectElement.data(warnCfg);
            rectElement.svgElement.attr("width", warnLabel.actualWidth()+(warnIcon?warnIcon.imageWidth()*1.5:2));
            rectElement.svgElement.attr("height", warnLabel.actualHeight());
            rectElement.attribute("x",halfHeight);
            rectElement.attribute("y",-halfHeight+i*18);

            warnLabelList.push(warnLabel);
            warnBgList.push(rectElement);
            warnIcon?warnIconList.push(warnIcon):null;
        }
 
    }

    //override
    this.drawPlugin = function(g){
        superDrawPlugin(g);
        _g=g;
        updateWarn();
    }
}

module.exports=PortGroupNode;