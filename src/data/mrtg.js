var mrtgConfig = {
    percentWidth:100,
    percentHeight:100,
    //height:160,
    type:"chart",
    xFocusLine:{visible:true},
    //yFocusLine:{visible:true},
    //hSlider:{visible:true},
    xSplitLine:{
        visible:true, 
        style:{stroke:"red"},
        filter:function(domain) {
        	var result = [];
        	if(domain.length < 2) return result;
        	var start = domain[0], 
        	    end = domain[1], 
                day = 1000*60*60*24, //一天时间长度ms
                offset = new Date().getTimezoneOffset() * 1000*60,//时差ms
        	    nextDay = new Date(Math.floor((start.getTime() + day - 1) / day) * day + offset);
        	for(var i = nextDay.getTime(), len = end.getTime(); i <= len; i += day) {
        		result.push(new Date(i));
        	}
        	return result;
        }
    },
    legend:{
        xPos:"center",
        yPos:"bottom",
        onlyOneColumn:true,
        keyPath:"data",
        key:"name",
        /*支持{#script#},其中script为js脚本内容；支持{v},相当于{#d[key]#},labelFormat默认值为{v};
                                这里data代表config.series[n].data,d代表config.series[n].data[n];*/
        labelFormat:"{#d.name#}   "+
        "平均值:"+"{#d.avg#}   "+
        "最大值:"+"{#d.max#}",
        colors:["#00d107", "#0000ff"],
        visible:true
    },
    axis:{
        xAxis:[
            {
                type:"time", 
                position:"bottom",
                keyPath:"data",
                key:"time",
                tick:{
                	tickArguments:[24],
                	tickFormat:function(d) {return d3.timeFormat('%H:%M')(d);}
                },
                gridLine:{
                    tickLine: {
                        show: true,
                        style: {
                            stroke: "#ddd",
                            strokeWidth: 1
                        }
                    },
                    innerLine:{show:true, gapNum:5, style:{stroke:"#eee", strokeWidth:1, strokeDasharray:"4,4"}}
                },
                label:{text:"时间", pos:"right", padding:0, style:{fontSize:14}},
                padding:{left:80, bottom:80, right:70, top:30},
                tickLabel:{
                    attr:{transform:"translate(-10,2)"},
                    style:{fontSize:"12px",textAnchor:"start"}
                }
//                tickLabel:{style:{fontSize:"12px"}}
            }
        ],
        yAxis:[
            {
                type:"value", 
                position:"left",
                keyPath:"data",
                key:"value",
                //domain:[0, 400],
                tick:{
                    tickFormat:function(d) {
                        return d+window.mrgtUint;
                    }
                },
                gridLine:{
                    tickLine:{show:true, style:{stroke:"#ddd", strokeWidth:1}},
                    innerLine:{show:true, gapNum:1, style:{stroke:"#eee", strokeWidth:1, strokeDasharray:"4,4"}}
                },
                label:{text:"流量", pos:"top", style:{fontSize:14}},
                padding:{left:80, bottom:80, right:70, top:30}
            }
        ]
    },
    toolTip:{
        trigger:"xAxis",//触发条件，值可为xAxis|yAxis|item
        //labelFormat:"Time:{#d3.timeFormat('%Y-%m-%d %H:%M:%S')(d.time)#}\nValue:{#d.value#}"//标签内容格式
        //style:{}
        labelFormat:{
            xAxisFormat:"时间:{#d3.timeFormat('%Y-%m-%d %H:%M:%S')(d.time)#}",//标签x轴对应数据内容相关格式
            yAxisFormat:"{#d.name#}:{#d.value#} {#window.mrgtUint#}"//标签y轴对应数据内容相关格式
        }
    },
    series:[
        {
            type:"area",
            tension:1,
            scaleType:-1,
            dragable:false,
            percentWidth:100,
            percentHeight:100,
            layout:{type:"scatterlayout"},
            renderers:{
                "1":""
            },
            data:[
                //{renderer:"1", time:"2016-01-01 12:00:00", value:5}
            ]
        },
        {
            type:"line",
            tension:1,
            scaleType:-1,
            dragable:false,
            percentWidth:100,
            percentHeight:100,
            layout:{type:"scatterlayout"},
            nodeShow:false,
            renderers:{
                "1":""
            },
            data:[
                //{renderer:"1", time:"2016-01-01 12:00:00", value:5}
            ]
        }
    ]
};

function createData(data,  minValue, maxValue, name) {
    data.length = 0;
    var formatDateTime = d3.timeFormat('%Y-%m-%d %H:%M:%S');
    var parseDateTime = d3.timeParse('%Y-%m-%d %H:%M:%S');
    var startTime = formatDateTime(new Date());
    var interval = 5;//min
    var n=24*(60/interval);
    for(var i = 0; i < n; i++) {
        var d = parseDateTime(startTime);
        var obj = {
            renderer:"1", 
            time:formatDateTime(d.setTime(d.getTime() - interval*60 * 1000 * i)), 
            value:minValue + Math.floor(Math.random() * (maxValue - minValue)),
            name:name
        }
        data.push(obj);
    }
}
createData(mrtgConfig.series[0].data,  150, 300, "流入");
createData(mrtgConfig.series[1].data,  50, 150, "流出");

module.exports=mrtgConfig;