/**
 * idc业务拓扑图节点
 * @param {*} _element 
 * @param {*} _data 
 */
function IDCNode(_element, _data) {
    const IconNode = ghca_charts.view.elements.plugins.nodes.IconNode;
    const ImageElement = ghca_charts.view.elements.imageElement;
    const TopoLabel = ghca_charts.view.elements.plugins.label.topoLabel;
    const ObjectUtil = ghca_charts.view.util.objectUtil;
    const WarnData = require("../data/toolData").warnData;
    const RectElement = ghca_charts.view.elements.rectElement;
    IconNode.apply(this, arguments);
    var selfNode = this;
    var superUpdate = selfNode.update;
    var superDrawPlugin = selfNode.drawPlugin;
    var warnIcon, warnLabel, rectElement;
    var data = _data;

    var warnLabelList = [];
    var warnIconList = [];
    var warnBgList = [];
    var _g;
  
    //override
    this.nameSpace = function () {
        return "idc_node";
    }

    //override
    this.update = function (g) {
        superUpdate(g);
        updateWarn();

        if (selfNode.data().ins.data().isClose||selfNode.data().data.isClose) { //节点关闭置灰
            _g.select(".icon_image").attr("filter", "url('#svg_gray')");
        } else {
            _g.select(".icon_image").attr("filter", null);
        }
    }

    var superBBox = selfNode.getBBox;
    // this.getBBox=function(){
    //     if(!_g){
    //         return superBBox();
    //     }
    //     return _g.select(".icon_image").node().getBBox();
    // }


    function updateWarn() {
        _g.selectAll(".topolabel").remove();
        while (warnLabelList.length > 0) {
            var item = warnLabelList.pop();
            item.remove();
        }
        while (warnIconList.length > 0) {
            var item = warnIconList.pop();
            item.svgElement.remove();
        }
        while (warnBgList.length > 0) {
            var item = warnBgList.pop();
            item.svgElement.remove();
        }

        var warnDatas = selfNode.data().ins ? selfNode.data().ins.data().warnDatas : null;
        if (selfNode.data().ins === undefined || selfNode.data().ins.data().showWarn === undefined || selfNode.data().ins.data().showWarn === false || !warnDatas) {
            return;
        }

        var halfHeight = selfNode.data().height * 0.5;
        var seatIndex = 0;
        for (var i = 0; i < warnDatas.length; i++) {
            var warnData = warnDatas[i];
            var warnType = warnData.level;
            if (!WarnData.bgColors[warnType]) {
                continue;
            }
            var warnCfg = ObjectUtil.cloneObj(selfNode.data().data.config.label.warn);
            warnCfg.text = "数量:" + warnData.count;
            warnCfg.color = WarnData.bgColors[warnType];
            warnCfg.opacity = WarnData.bgOps[warnType];
            warnCfg.fontColor = WarnData.lbColors[warnType];

            var iconConfig;
            if (WarnData.icons[warnType]) {
                iconConfig = {
                    url: WarnData.icons[warnType],
                    imageHeight: 14,
                    imageWidth: 14
                };
            }


            var rectElement = new RectElement(_g, warnCfg);
            rectElement.render();
            var warnIcon;
            if (iconConfig) {
                warnIcon = new ImageElement(_g, iconConfig);
                warnIcon.render();
                warnIcon.data(iconConfig);
                warnIcon.svgElement.attr("y", -halfHeight + seatIndex * 18);
                warnIcon.svgElement.attr("x", halfHeight);
            }


            var warnLabel = new TopoLabel(_g, _data);
            warnLabel.config(warnCfg);
            warnLabel.render();
            warnLabel.getRectElement().svgElement.attr("pointer-events", "none");
            warnLabel.transform("translate(" + (halfHeight + 18) + "," + (-halfHeight + seatIndex * 18) + ")");

            rectElement.svgElement.attr("pointer-events", "none");
            rectElement.data(warnCfg);
            rectElement.svgElement.attr("width", warnLabel.actualWidth() + (warnIcon ? warnIcon.imageWidth() * 1.5 : 0));
            rectElement.svgElement.attr("height", warnLabel.actualHeight());
            rectElement.attribute("x", halfHeight);
            rectElement.attribute("y", -halfHeight + seatIndex * 18);

            warnLabelList.push(warnLabel);
            warnBgList.push(rectElement);
            warnIcon ? warnIconList.push(warnIcon) : null;
            seatIndex++;
        }

    }

    //override
    this.drawPlugin = function (g) {
        superDrawPlugin(g);
        _g = g;
        updateWarn();
    }
}

module.exports = IDCNode;