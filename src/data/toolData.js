var linkDrawData = {
    type: "link",
    renderer: 'link',
    lbBgColor: "#e3dec8",
    lbBgOpa: "1",
    fontColor: "#070607",
    borderWidth: 2,
    fill: "#999",
    borderOpacity: 1,
    dottedStep: "0,0",
}

var dottedLikeDrawData = {
    type: "link",
    renderer: 'link',
    lbBgColor: "#e3dec8",
    lbBgOpa: "1",
    fontColor: "#070607",
    borderWidth: 2,
    fill: "#999",
    borderOpacity: 1,
    dottedStep: "5,5",
}

var groupData = {
    renderer: 'groupNode',
    radius: 20,
    fill: "#e3dec8",
    fillOp: 0.3,
    lbBgFill: "#f8f8f8",
    lbFill: "#2c2c2c",
    lbOp: 1,
    type: "group"
}

var optionToolData = [{
        iconCls: 'icon-select',
        tooltip: "选择工具"
    },
    {
        iconCls: 'icon-move',
        tooltip: "移动工具"
    },
    {
        iconCls: 'icon-line',
        tooltip: "线条工具",
        data: linkDrawData
    },
    {
        iconCls: 'icon-print',
        tooltip: "虚线工具",
        data: dottedLikeDrawData
    },
    {
        iconCls: 'icon-rect',
        tooltip: "组合工具",
        data: groupData
    },
    {
        iconCls: 'icon-delete',
        tooltip: "删除工具",
    },
    {
        iconCls: 'icon-cancel',
        tooltip: "撤销工具",
    },
    {
        iconCls: 'icon-redo',
        tooltip: "重做工具",
    },
    {
        iconCls: 'icon-save',
        tooltip: "保存工具",
    },
];

/**
 *  icons:{critical:"./res/img/icon/warn/low.png",warning:"./res/img/icon/warn/middle.png",immediate:"./res/img/icon/warn/high.png",information:"./res/img/icon/warn/high.png"},
    bgColors:{critical:"#06F67E",warning:"#F8E406",immediate:"#F9060A",information:"#F9060A"},
    lbColors:{critical:"#333333",warning:"#333333",immediate:"#333333",information:"#333333"},
    bgOps:{critical:"0.5",warning:"0.5",immediate:"0.5",information:"0.5"}
 */


var warnInfoData = {
    icons: {
        "critical": "./res/img/icon/warn/alam.png",
        "warning": "./res/img/icon/warn/alam.png",
        "immediate": "./res/img/icon/warn/alam.png",
        "information": "./res/img/icon/warn/alam.png",
    },
    bgColors: {
        "critical": "#DF4C4D",
        "warning": "#FFA64C",
        "immediate": "#FFE966",
        "information": "#388E19",
    },
    lbColors: {
        "critical": "#333333",
        "warning": "#333333",
        "immediate": "#333333",
        "information": "#333333",
    },
    bgOps: {
        "critical": "1",
        "warning": "1",
        "immediate": "1",
        "information": "1",
    },
    names: {
        "critical": "紧急",
        "warning": "主要",
        "immediate": "次要",
        "information": "警告",
    },

}

var drawToolData = [{
    title: "基本节点",
    nodes: [{
            icon: "./res/img/node/32/1.png",
            name: "防火墙",
            type: "firewallnode",
            renderer: "imageNode",
            width: 48,
            height: 48,
            opacity: 1,
            lbBgColor: "#000000",
            lbBgOpa: "0",
            fontColor: "#000000"
        },
        {
            icon: "./res/img/node/32/2.png",
            name: "交换机",
            type: "fbxnode",
            renderer: "imageNode",
            width: 48,
            height: 48,
            opacity: 1,
            lbBgColor: "#000000",
            lbBgOpa: "0",
            fontColor: "#000000"
        },
        {
            icon: "./res/img/node/32/3.png",
            name: "路由器",
            type: "routenode",
            renderer: "imageNode",
            width: 48,
            height: 48,
            opacity: 1,
            lbBgColor: "#000000",
            lbBgOpa: "0",
            fontColor: "#000000"
        },
        {
            icon: "./res/img/node/32/4.png",
            name: "主机",
            type: "mainnode",
            renderer: "imageNode",
            width: 48,
            height: 48,
            opacity: 1,
            lbBgColor: "#000000",
            lbBgOpa: "0",
            fontColor: "#000000"
        },
        {
            icon: "./res/img/node/32/5.png",
            name: "云",
            type: "cloudnode",
            renderer: "imageNode",
            width: 48,
            height: 48,
            opacity: 1,
            lbBgColor: "#000000",
            lbBgOpa: "0",
            fontColor: "#000000"
        },
        {
            icon: "./res/img/node/32/8.png",
            name: "端口",
            type: "portnode",
            renderer: "imageNode",
            width: 48,
            height: 48,
            opacity: 1,
            lbBgColor: "#000000",
            lbBgOpa: "0",
            fontColor: "#000000"
        },
        {
            icon: "./res/img/node/32/7.png",
            name: "自定义",
            type: "customnode",
            renderer: "imageNode",
            width: 48,
            height: 48,
            opacity: 1,
            lbBgColor: "#000000",
            lbBgOpa: "0",
            fontColor: "#000000"
        },
        {
            icon: "./res/img/node/32/6.png",
            name: "背景",
            type: "bgnode",
            renderer: "imageBgNode",
            width: 458,
            height: 353,
            opacity: 1,
            lbBgColor: "#000000",
            lbBgOpa: "0",
            fontColor: "#000000",
            isBg: true,
            noToolTip: true,
        }
    ]
}, ];


var nodesDataMap = {};
for (let index = 0; index < drawToolData.length; index++) {
    const typedata = drawToolData[index];
    for (let i = 0; i < typedata.nodes.length; i++) {
        const element = typedata.nodes[i];
        nodesDataMap[element.type] = element; //类型映射
    }
}

var menuData = {
    "fbxnode": [{//交换机
            title: "详细信息",
            name: "nodeInfo",
            editShow: false
        },
        {
            title: "告警信息",
            name: "nodeAlarm",
            editShow: false
        },
        // {
        //     title: "端口分组",
        //     name: "nodePortGroup",
        //     editShow: false
        // },
        // {
        //     title:"执行Ping",
        //     name:"nodePing",
        //     editShow:false
        // },
        // {
        //     title:"缓存监视",
        //     name:"nodeCacheMonitor",
        //     editShow:false
        // },
        {
            title: "性能视图",
            name: "nodePerformance",
            editShow: false
        },
        {
            title: "查看报表",
            name: "nodeReport",
            editShow: false
        },
        // {
        //     title:"工具集",
        //     name:"nodeTool",
        //     editShow:false
        // },
        // {
        //     title: "配置告警",
        //     name: "nodeConfigAlarm",
        //     editShow: false
        // },
        // {
        //     title:"打开真实背板图",
        //     name:"openRack",
        //     editShow:false
        // },
        {
            title: "更换图标",
            name: "changeImg",
            editShow: true
        }
    ],
    "firewallnode": [{//防火墙
            title: "详细信息",
            name: "nodeInfo",
            editShow: false
        },
        {
            title: "告警信息",
            name: "nodeAlarm",
            editShow: false
        },
        {
            title: "性能视图",
            name: "nodePerformance",
            editShow: false
        },
        // {
        //     title:"执行Ping",
        //     name:"nodePing",
        //     editShow:false
        // },
        // {
        //     title: "实时监控",
        //     name: "nodeRealMonitor",
        //     editShow: false
        // },
        {
            title: "查看报表",
            name: "nodeReport",
            editShow: false
        },
        // {
        //     title:"工具集",
        //     name:"nodeTool",
        //     editShow:false
        // },
        // {
        //     title: "配置告警",
        //     name: "nodeConfigAlarm",
        //     editShow: false
        // },
        // {
        //     title:"打开真实背板图",
        //     name:"openRack",
        //     editShow:false
        // },
        {
            title: "移除",
            name: "nodeDelete",
            editShow: true
        },
        {
            title: "更换图标",
            name: "changeImg",
            editShow: true
        }
    ],
    "routenode": [{//路由器
            title: "详细信息",
            name: "nodeInfo",
            editShow: false
        },
        {
            title: "告警信息",
            name: "nodeAlarm",
            editShow: false
        },
        {
            title: "性能视图",
            name: "nodePerformance",
            editShow: false
        },
        // {
        //     title: "端口分组",
        //     name: "nodePortGroup",
        //     editShow: false
        // },
        // {
        //     title:"执行Ping",
        //     name:"nodePing",
        //     editShow:false
        // },
        // {
        //     title:"缓存监视",
        //     name:"nodeCacheMonitor",
        //     editShow:false
        // },
        // {
        //     title: "性能视图",
        //     name: "nodePerformance",
        //     editShow: false
        // },
        {
            title: "查看报表",
            name: "nodeReport",
            editShow: false
        },
        // {
        //     title:"工具集",
        //     name:"nodeTool",
        //     editShow:false
        // },
        // {
        //     title: "配置告警",
        //     name: "nodeConfigAlarm",
        //     editShow: false
        // },
        // {
        //     title:"打开真实背板图",
        //     name:"openRack",
        //     editShow:false
        // },
        {
            title: "移除",
            name: "nodeDelete",
            editShow: true
        },
        {
            title: "更换图标",
            name: "changeImg",
            editShow: true
        }
    ],
    "cloudnode": [{
            title: "跳转",
            name: "cloudchild",
            editShow: false
        },
        {
            title: "移除",
            name: "nodeDelete",
            editShow: true
        },
        {
            title: "更换图标",
            name: "changeImg",
            editShow: true
        },

    ],
    "mainnode": [{//主机
            title: "详细信息",
            name: "nodeInfo",
            editShow: false
        },
        {
            title: "告警信息",
            name: "nodeAlarm",
            editShow: false
        },
        {
            title: "性能视图",
            name: "nodePerformance",
            editShow: false
        },
        // {
        //     title: "网络监控",
        //     name: "nodeNetMonitor",
        //     editShow: false
        // },
        // {
        //     title: "存储监控",
        //     name: "nodeStoreMonitor",
        //     editShow: false
        // },
        // {
        //     title: "性能视图",
        //     name: "nodePerformance",
        //     editShow: false
        // },
        {
            title: "查看报表",
            name: "nodeReport",
            editShow: false
        },
        // {
        //     title:"工具集",
        //     name:"nodeTool",
        //     editShow:false
        // },
        // {
        //     title: "配置告警",
        //     name: "nodeConfigAlarm",
        //     editShow: false
        // },
        // {
        //     title:"打开真实背板图",
        //     name:"openRack",
        //     editShow:false
        // },
        {
            title: "移除",
            name: "nodeDelete",
            editShow: true
        },
        {
            title: "更换图标",
            name: "changeImg",
            editShow: true
        }
    ],
    "customnode": [{
            title: "移除",
            name: "nodeDelete",
            editShow: true
        },
        {
            title: "更换图标",
            name: "changeImg",
            editShow: true
        }
    ],
    "portnode": [ //端口节点

    ],
    "default": [
        // {
        //     title:"查看信息",
        //     name:"linkInfo"
        // },
        {
            title: "移除",
            name: "linkDelete",
            editShow: true
        },
        {
            title: "更改监控端口",
            name: "linkModifyMonitor",
            editShow: true
        }
    ]
}

var addDefaultData = function (data) { //给topo相关数据添加默认信息
    var cfg;
    var len=data.nodes?data.nodes.length:0;
    for (var i = 0; i < len; i++) {
        var node = data.nodes[i];
        var type = node.type;
        cfg = nodesDataMap[type];
        for (var key in cfg) {
            if (!node[key] && cfg[key]) {
                node[key] = cfg[key];
            }
        }

        if (node.visible === "true" || node.visible) {
            node.visible = true;
        } else {
            node.visible = false;
        }
    }

    cfg = linkDrawData;
    len=data.links?data.links.length:0;
    for (var i = 0; i < len; i++) {
        var link = data.links[i];
        for (var key in cfg) {
            if (!link[key] && cfg[key]) {
                link[key] = cfg[key];
            }
        }
        if (link.visible === "true" || link.visible) {
            link.visible = true;
        } else {
            link.visible = false;
        }
    }

    cfg = groupData;
    len=data.groups?data.groups.length:0;
    for (var i = 0; i < len; i++) {
        var group = data.groups[i];
        for (var key in cfg) {
            if (!group[key] && cfg[key]) {
                group[key] = cfg[key];
            }
        }
        if (group.nodes instanceof Array) { //后台传递的是字符串 蛋疼的处理
            group.nodes = group.nodes;
        } else {
            group.nodes = JSON.parse(group.nodes);
        }
        if (group.visible === "true" || group.visible) {
            group.visible = true;
        } else {
            group.visible = false;
        }
    }
}

module.exports = {
    name: "toolData",
    optionToolData: optionToolData,
    drawToolData: drawToolData,
    nodesDataMap: nodesDataMap,
    warnData: warnInfoData,
    menuData: menuData,
    linkDrawData: linkDrawData,
    dottedLikeDrawData: dottedLikeDrawData,
    groupData: groupData,
    addDefaultData: addDefaultData
};