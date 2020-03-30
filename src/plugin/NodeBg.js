
var NodeBg=function(_element,_data){
    const Plugin = ghca_charts.view.elements.plugins.plugin;
    const ObjectUtil = ghca_charts.view.util.objectUtil;
    const RegexUtil = ghca_charts.view.util.regexUtil;
    const RectElement=ghca_charts.view.elements.rectElement;
    const ElementUtil = ghca_charts.view.util.elementUtil;
    Plugin.apply(this,arguments);
    var self = this,
        rectElement;
    var config = ObjectUtil.cloneObj(self.config());
    self.config({
           
    });

    // this.actualWidth=function (){
    //     return self.el?self.el.node().getBBox().width:0;
    // }

    // this.actualHeight=function (){
    //     return self.el?self.el.node().getBBox().height:0;
    // }

    this.drawPlugin = function(g){
        var cfg=ObjectUtil.cloneObj(self.config());
        config.color = RegexUtil.replace(RegexUtil.dataRegex,cfg.color,self.data());
        config.borderColor = RegexUtil.replace(RegexUtil.dataRegex,cfg.borderColor,self.data());
        config.radius = RegexUtil.replace(RegexUtil.dataRegex,cfg.radius,self.data());
        config.width = RegexUtil.replace(RegexUtil.dataRegex,cfg.width,self.data());
        config.height = RegexUtil.replace(RegexUtil.dataRegex,cfg.height,self.data());
        config.x=config.width*0.5*-1;
        config.y=config.height*0.5*-1;    
        config.opacity=cfg.opacity;  
        rectElement = new RectElement(g,config);
        rectElement.render();
        self.resetBBox(config.x,config.y,config.width,config.height);
    }

    this.update = function(g){
        if(!rectElement){
            return;
        }
        var cfg=ObjectUtil.cloneObj(self.config());
        config.color = RegexUtil.replace(RegexUtil.dataRegex,cfg.color,self.data());
        config.borderColor = RegexUtil.replace(RegexUtil.dataRegex,cfg.borderColor,self.data());
        config.radius = RegexUtil.replace(RegexUtil.dataRegex,cfg.radius,self.data());
        config.width = RegexUtil.replace(RegexUtil.dataRegex,cfg.width,self.data());
        config.height = RegexUtil.replace(RegexUtil.dataRegex,cfg.height,self.data());
        config.x=config.width*0.5*-1;
        config.y=config.height*0.5*-1;    
        config.opacity=cfg.opacity;
        rectElement.data(config);
        rectElement.render();
        self.resetBBox(config.x,config.y,config.width,config.height);
    }
    
}

NodeBg.struct = function(ghca_charts) {
	Plugin.struct(ghca_charts);
    NodeBg.prototype = Object.create(Plugin.prototype);
    NodeBg.prototype.constructor = NodeBg;
};

module.exports = NodeBg;