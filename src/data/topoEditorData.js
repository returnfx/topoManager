var topoEditorData={
    percentWidth:100,
    percentHeight:100,
    autoResize:false,
    background:{fill:"#FFFFFF"},
    type:"chart",
    legend:{
        xPos:"center",
        yPos:"top",
        key:"name",
        labelFormat:"{v}",
        visible:false
    },  
    toolTip : {
        trigger: "item",
        labelFormat: `{#toolTipHandler(d)#}`
    },
    series:[
        {
            percentWidth:100,
            percentHeight:100,
            scaleType:0,
            type:"topology_edit",
            focusEffect:true,
            dragable:true,
            diffKey:"id",
            mode:"edit",
            layout:{
                type:"topolayout",
                fixed:true, 
                isAutoLayout:false,
                distance:60, 
                chargeStrength:-10, 
                distanceMin:40, 
                alphaMin:0.5,
                distanceMax:1000, 
                collideRadius:150,
                collideStrength:0.1
            },
            renderers:{
                "link" :{
                    "clazz" : "configlink",
                    "config" :{
                        "source" : "{source}",
                        "target" : "{target}",
                        "math" : 2,
                        "num" : "{lineIndex}",
                        "besselX" : true,
                        "flux":"{flux}",
                        "path":{
                            "fill" : "none",
                            "dasharray" : "{dottedStep}",
                            "borderWidth" : "{borderWidth}",
                            "borderColor" : "{fill}",
                            "borderOpacity" : "{borderOpacity}",
                            "overDasharray" : "{dottedStep}",
                            "overBorderWidth" : 5,
                            "overBorderColor" : "{fill}",
                            "overBorderOpacity" : 1,
                            "arrow" : {
                                visible:true,
                                position:"end"
                            }
                        },
                        "label" : {
                            "clazz" : "topolabel",
                            "config" : {
                                "text" : "{name}",
                                "maxWidth" : 80,
                                "backGroundColor" : "{lbBgColor}",
                                "backGroundOpacity" : "{lbBgOpa}",
                                "borderRadius" : 2,
                                "padding" : 2,
                                "fontColor" : "{fontColor}",
                                "fontFamily" : "Microsoft YaHei",
                                "fontSize" : 12,
                                "textLine" : 1,
                                "visible" : true
                            }
                        },
                        "plugins" : [
                            {
                                "xPos":"right",
                                "yPos":"bottom",
                                "clazz":"verTool",
                                "config":{
                                    "xlink":"#{xlink}",
                                    "width":"{width}",
                                    "height":"{height}",
                                    "data":"{value}",
                                    "events":"verTool_alaremtOpen",
                                }
                            }
                        ]
                    }
                },
                'groupNode':{
                    clazz:"configgroupnode",
                    radius:"{radius}",
                    extendedSize:15,
                    autoGroupKeys:"state",
                    nodeProperties:{
                        "fill":"{fill}",
                        "fill-opacity":"{fillOp}",
                        "stroke":"#2b2c30",
                        "stroke-opacity":1,
                        "dasharray":"5,5",
                        "stroke-dasharray-error":"5,5"
                    },
                    labelPosition:"top",
                    label:{
                        // name:"测试01",
                        clazz:"grouplabel",
                        backGroundProperties:{
                            "fill":"{lbBgFill}",
                            "opacity":"{lbOp}"
                        },
                        labelProperties:{
                            "fill":"{lbFill}",
                            "font-size":16,
                            "pointer-events":"none"}
                    }
                },
                "imageBgNode":{
                    "clazz" : "node",
                    "config" :{
                        "main" :{
                            "clazz" : "IconNode",
                            "config" : {
                                "imageWidth" : "{width}",
                                "imageHeight" : "{height}",
                                "url" : "{icon}",                               
                            }
                        },
                        "backGround" : {
                            "clazz" : "rect_bg",
                            "config" : {
                                "width" : "{width}",
                                "height" : "{height}",
                                "borderColor" : "#0011dd",
                                "color" : "#ff3333",
                                "opacity":"0.5",
                            }
                        },
                    }                    
                },
                "imageNode" : {
                    "clazz" : "node",
                    "config" : {
                        "main" : {
                            "clazz" : "idc_node",
                            "config" : {
                                "imageWidth" : "{width}",
                                "imageHeight" : "{height}",
                                "opacity" : "{opacity}",
                                "url" : "{icon}",                               
                            }
                        },
                        "backGround" : {
                            "clazz" : "rect_bg",
                            "config" : {
                                "width" : "{width}",
                                "height" :"{height}",
                                "borderColor" : "#0011dd",
                                "color" : "#ff3333",
                                "opacity":"0.5"
                            }
                        },
                        "label" : {
                            "clazz" : "topolabel",
                            "rotate" : "0",
                            "position" : "bottom",
                            "gap" : 0,
                            "config" : {
                                "text" : "{name}",
                                "maxWidth" : 80,
                                "backGroundColor" : "{lbBgColor}",
                                "backGroundOpacity" : "{lbBgOpa}",
                                "borderRadius" : 4,
                                "padding" : 0,
                                "fontColor" : "{fontColor}",
                                "fontFamily" : "Microsoft YaHei",
                                "fontSize" : 12,
                                "textLine" : 1,
                                "visible" : true
                            },
                            "warn":{
                                "text" : "{name}",
                                "maxWidth" : 80,
                                "backGroundColor" : "#000000",
                                "backGroundOpacity" : "0",
                                "color" : "{lbBgColor}",
                                "opacity" : "{lbBgOpa}",
                                "rx" : 4,
                                "ry" : 4,
                                "padding" : 0,
                                "fontColor" : "{fontColor}",
                                "fontFamily" : "Microsoft YaHei",
                                "fontSize" : 12,
                                "textLine" : 1,
                                "visible" : true
                            }
                        },
                        "plugins" :[
                           
                        ]
                    }
                }
            },
            groups:[],
            nodes:[],
            links:[]
        }
    ]
}

module.exports=topoEditorData;