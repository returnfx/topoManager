var interval = 300;//s
var x_tick=10;
var y_tick=5;
var netCfg1 = {
    percentWidth:50,
    percentHeight:100,
    type:"chart",
    //hSlider:{visible:true, thumbToolTip:{style:{"fill":"#000", "font-size":12}}},
    events:[
        // {
        //     eventType:2,                            //1：派发,2：响应(必须)
        //     bindEvent:"noticeRefreshData",          //组件支持的事件类型名称(必须)
        //     eventName:"refresh_line1"                     //自定义事件名称(必须)
        // },
        // // {
        // //     eventType:2,                            //1：派发,2：响应(必须)
        // //     bindEvent:"noticeRefreshData",          //组件支持的事件类型名称(必须)
        // //     eventName:"refresh2"                     //自定义事件名称(必须)
        // // },
        // {
        //     eventType:1,               
        //     bindEvent:"noticeSynToolTip",     
        //     eventName:"synToolTip1",   
        //     defaultParams:null,        
        //     eventParams:null           
        // }
        // ,
        // {
        //     eventType:2,               
        //     bindEvent:"noticeSynToolTip",   
        //     eventName:"synToolTip1"
        // }
   ],
    xFocusLine:{
        visible:true,
        style:{
        	"strokeDasharray": "5,5"
    	}
    },
    legend:{
        xPos:"center",
        yPos:"top",
        keyPath:"data",
        key:"name",
        padding:20,
        mouseOverEffect:true,
        /*支持{#script#},其中script为js脚本内容；支持{v},相当于{#d[key]#},labelFormat默认值为{v};
                                这里data代表config.series[n].data,d代表config.series[n].data[n];*/
        labelFormat:"{v}",
        labels:[{
            fill:"#bee8f0"
        }],
        colors:["#36066c", "#79c5f6"],
        //domain:["A组"],
        visible:true
    },
    axis:{
        xAxis:[
            {
                type:"time", 
                position:"bottom",
                keyPath:"data",
                key:"time",
                interval:interval,//两个数据间隔值，只在type为非enum时有效:若type为time,则为时间间隔，单位秒；若type为value,则为数值间隔；
                gridLine:{
                    tickLine:{show:true, style:{stroke:"#ccc","stroke-opacity": 0.5, strokeWidth:1, strokeDasharray:"4,4"}}
//                    innerLine:{show:true, gapNum:5, style:{stroke:"#eee", strokeWidth:1, strokeDasharray:"4,4"}}
                },
                tick:{
                    tickArguments:[x_tick],
                    style:{
                        stroke:"#1276ca"
                    },
                	tickFormat:function(d) {
                        return d3.timeFormat('%H:%M')(new Date(d));
                    }
                },
                tickLabel:{
                    style:{
                        fill:"#bee8f0",
                    }                    
                },
                label:{text:"时间", pos:500,
                padding:0,
                style:{
                    fontSize:12,
                    fill:"#bee8f0",
                    left:200
                },
            },
                padding:{top:50, left:50, bottom:50, right:50}
            }
        ],
        yAxis:[
            {
                type:"value", 
                position:"left",
                keyPath:"data",
                key:"value",
//                domain:[0, 800],
                tick:{
                    tickArguments:[y_tick],
                    style:{
                        stroke:"#1276ca"
                    }
                },
                tickLabel:{
                    style:{
                        fill:"#bee8f0"
                    }
                },
                gridLine:{
                    tickLine:{show:true, style:{stroke:"#ccc","stroke-opacity": 0.5, strokeWidth:1, strokeDasharray:"4,4"}}
                },
                label:{text:"使用率", pos:"top", style:{
                    fontSize:12,
                    fill:"#bee8f0"
                }},
                padding:{top:50, left:50, bottom:50, right:50}
            }
        ]
    },
    toolTip:{
        trigger:"xAxis",//触发条件，值可为xAxis|yAxis|item
        //labelFormat:"Time:{#d3.timeFormat('%Y-%m-%d %H:%M:%S')(d.time)#}\nValue:{#d.value#}"//标签内容格式
        //style:{}
        labelFormat:{
            xAxisFormat:"时间:{#d3.timeFormat('%Y-%m-%d %H:%M:%S')(new Date(d.time))#}",//标签x轴对应数据内容相关格式
            yAxisFormat:"{#d.name#}:{#parseInt(d.value)#}%"//标签y轴对应数据内容相关格式
        }
    }, 
    series:[
        {
            type:"line",
            tension:1,
            layout:{
                type:"scatterlayout"
            },
            renderers:{
                "1":{
                    clazz:"lineNode",
                    clazzProperties:{
                        "r":2,
                        // "fill":"#ff0000"
                    }
                }
            },
            dragable:false,
            nodeShow:true,
            percentWidth:100,
            percentHeight:100,
            scaleType:-1,
            xAxisIndex:0,
            yAxisIndex:0,
            data:[]
        }
    ]
};
var netCfg2 = {
    percentWidth:50,
    percentHeight:100,
    type:"chart",
    //hSlider:{visible:true, thumbToolTip:{style:{"fill":"#000", "font-size":12}}},
    events:[
        // {
        //     eventType:2,                            //1：派发,2：响应(必须)
        //     bindEvent:"noticeRefreshData",          //组件支持的事件类型名称(必须)
        //     eventName:"refresh_line1"                     //自定义事件名称(必须)
        // },
        // // {
        // //     eventType:2,                            //1：派发,2：响应(必须)
        // //     bindEvent:"noticeRefreshData",          //组件支持的事件类型名称(必须)
        // //     eventName:"refresh2"                     //自定义事件名称(必须)
        // // },
        // {
        //     eventType:1,               
        //     bindEvent:"noticeSynToolTip",     
        //     eventName:"synToolTip1",   
        //     defaultParams:null,        
        //     eventParams:null           
        // }
        // ,
        // {
        //     eventType:2,               
        //     bindEvent:"noticeSynToolTip",   
        //     eventName:"synToolTip1"
        // }
   ],
    xFocusLine:{
        visible:true,
        style:{
        	"strokeDasharray": "5,5"
    	}
    },
    legend:{
        xPos:"center",
        yPos:"top",
        keyPath:"data",
        key:"name",
        padding:20,
        mouseOverEffect:true,
        /*支持{#script#},其中script为js脚本内容；支持{v},相当于{#d[key]#},labelFormat默认值为{v};
                                这里data代表config.series[n].data,d代表config.series[n].data[n];*/
        labelFormat:"{v}",
        labels:[{
            fill:"#bee8f0"
        }],
        colors:["#36066c", "#79c5f6"],
        //domain:["A组"],
        visible:true
    },
    axis:{
        xAxis:[
            {
                type:"time", 
                position:"bottom",
                keyPath:"data",
                key:"time",
                interval:interval,//两个数据间隔值，只在type为非enum时有效:若type为time,则为时间间隔，单位秒；若type为value,则为数值间隔；
                gridLine:{
                    tickLine:{show:true, style:{stroke:"#ccc","stroke-opacity": 0.5, strokeWidth:1, strokeDasharray:"4,4"}}
//                    innerLine:{show:true, gapNum:5, style:{stroke:"#eee", strokeWidth:1, strokeDasharray:"4,4"}}
                },
                tick:{
                    tickArguments:[x_tick],
                    style:{
                        stroke:"#1276ca"
                    },
                	tickFormat:function(d) {
                        return d3.timeFormat('%H:%M')(new Date(d));
                    }
                },
                tickLabel:{
                    style:{
                        fill:"#bee8f0"
                    }
                },
                label:{text:"时间", pos:"right",
                padding:0,
                style:{
                    fontSize:12,
                    fill:"#bee8f0",
                }},
                padding:{top:50, left:50, bottom:50, right:50}
            }
        ],
        yAxis:[
            {
                type:"value", 
                position:"left",
                keyPath:"data",
                key:"value",
//                domain:[0, 800],
                tick:{
                    tickArguments:[y_tick],
                    style:{
                        stroke:"#1276ca"
                    }
                },
                tickLabel:{
                    style:{
                        fill:"#bee8f0"
                    }
                },
                gridLine:{
                    tickLine:{show:true, style:{stroke:"#ccc","stroke-opacity": 0.5, strokeWidth:1, strokeDasharray:"4,4"}}
                },
                label:{text:"使用率", pos:"top", style:{
                    fontSize:12,
                    fill:"#bee8f0"
                }},
                padding:{top:50, left:50, bottom:50, right:50}
            }
        ]
    },
    toolTip:{
        trigger:"xAxis",//触发条件，值可为xAxis|yAxis|item
        //labelFormat:"Time:{#d3.timeFormat('%Y-%m-%d %H:%M:%S')(d.time)#}\nValue:{#d.value#}"//标签内容格式
        //style:{}
        labelFormat:{
            xAxisFormat:"时间:{#d3.timeFormat('%Y-%m-%d %H:%M:%S')(new Date(d.time))#}",//标签x轴对应数据内容相关格式
            yAxisFormat:"{#d.name#}使用率:{#parseInt(d.value)#}%"//标签y轴对应数据内容相关格式
        }
    }, 
    series:[
        {
            type:"line",
            tension:1,
            layout:{
                type:"scatterlayout"
            },
            renderers:{
                "1":{
                    clazz:"lineNode",
                    clazzProperties:{
                        "r":2,
                        // "fill":"#ff0000"
                    }
                }
            },
            dragable:false,
            nodeShow:true,
            percentWidth:100,
            percentHeight:100,
            scaleType:-1,
            xAxisIndex:0,
            yAxisIndex:0,
            data:[]
        }, {
            type:"line",
            tension:1,
            layout:{
                type:"scatterlayout"
            },
            renderers:{
                "1":{
                    clazz:"lineNode",
                    clazzProperties:{
                        "r":2,
                        // "fill":"#ff0000"
                    }
                }
            },
            dragable:false,
            nodeShow:true,
            percentWidth:100,
            percentHeight:100,
            scaleType:-1,
            xAxisIndex:0,
            yAxisIndex:0,
            data:[]
        }
    ]
};

var mainCfg={
    type:"component",
    x:0,
    y:0,
    percentWidth:99,
    percentHeight:100,
    layout:{type:"horizontallayout", horizontalAlign:"left", verticalAlign:"top", gap:0},
    background:{fill:"#071f37", "fill-opacity":0.1},
    border:{"stroke":"#1b4861", "stroke-width":1},
    children:[netCfg1, netCfg2]
}


setTestData();

function setTestData(){
    var netDatas0=netCfg1.series[0].data;
    var netDatas3=netCfg2.series[0].data;
    var netDatas4=netCfg2.series[1].data;
    var startTime = new Date().getTime()-2*24*60*60*1000;
    var parseDateTime = d3.timeParse('%Y-%m-%d %H:%M:%S');
    var formatDateTime = d3.timeFormat('%Y-%m-%d %H:%M:%S'); 
    startTime=formatDateTime(startTime);
    var timeNum=30;//时间数量

    for(var i=0;i<timeNum;i++){
        var d = parseDateTime(startTime);
        var r = Math.random();
        if(r>0.5){

        }
        var obj = {
            time:formatDateTime(d.setTime(d.getTime() + interval * 1000 * i)), 
            name:"CPU使用率", 
            value:r*100,
            renderer:"1"
        }
        netDatas0.push(obj);
        // r = Math.random();
        // obj = {
        //     time:obj.time, 
        //     name:"下行", 
        //     value:r*100,
        //     renderer:"1"
        // }
        // netDatas1.push(obj);


        r = Math.random();
        obj = {
            time:obj.time,  
            name:"物理内存", 
            value:r*100,
            renderer:"1"
        }
        netDatas3.push(obj);
        r = Math.random();
        obj = {
            time:obj.time,  
            name:"虚拟内存", 
            value:r*100,
            renderer:"1"
        }
        netDatas4.push(obj);
    }
}