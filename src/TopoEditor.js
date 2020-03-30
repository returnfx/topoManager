/**
 * 拓扑展示层
 */
function TopoEditor(configData, optionTool) {
    const EditorEvent = require("./EditorEvent");
    const ToolName = require("./ToolName");
    const BaseEvent = ghca_charts.events.BaseEvent;
    const EventUtil = ghca_charts.view.util.eventUtil;
    const MouseUtil = ghca_charts.view.util.mouseUtil;
    const Node = ghca_charts.view.elements.plugins.nodes.node;
    const Link = ghca_charts.view.elements.plugins.links.configLink;
    const GroupNode = ghca_charts.view.elements.plugins.nodes.configGroupNode;
    const BaseComponent = ghca_charts.view.component.baseComponent;
    const UUIDUtil = ghca_charts.view.util.UUIDUtil;
    const ClassFactory = ghca_charts.view.util.classFactory;
    const ObjectUtil = ghca_charts.view.util.objectUtil;
    const EditorMenu = require("./EditorMenu");
    const IDCWindowManager = require("./IDCWindowManager");
    const LegWin = require("./view/LegendWindow");
    const ToolData = require("./data/toolData");
    const Selector = require("./utils/Selector");
    const TopoEyeCanvas=require("./TopoEyeCanvas");
    const MAX_HISNUM = 10;
    var _topoEditotData = configData;
    var renderObj = {};

    var eye;
    for (var key in _topoEditotData.series[0].renderers) {
        renderObj[key] = [];
        updateKeys(renderObj[key], _topoEditotData.series[0].renderers[key]);
    }

    function updateKeys(keys, obj) {
        for (var nkey in obj) {
            // console.log(nkey);
            if (ObjectUtil.isObject(obj[nkey])) {
                updateKeys(keys, obj[nkey]);
            }
            if (ObjectUtil.isString(obj[nkey]) && obj[nkey].charAt(0) === "{") {
                var name = obj[nkey];
                var v = name.substring(1, name.length - 1);
                // console.log(v);
                keys.push(v);
            }
        }
    }

    var graph, topo;
    var addNodeData;
    var currentTool = ToolName.SELECT;
    var drawLinkSource, drawLinkTarget;
    var editorMenu = new EditorMenu();
    var legenWindow = new LegWin();
    var upSeat;
    var hisDataInfos = [];
    var selfD = this;
    var optionTool = optionTool;
    // console.log(_topoEditotData.series[0].nodes.length);
    // console.log(_topoEditotData.series[0].links.length);
    // _topoEditotData.series[0].nodes.length=10;
    // _topoEditotData.series[0].links.length=0;

    ToolData.addDefaultData(_topoEditotData.series[0]);
    window.addEventListener("mouseup", onWindowMouseUp, true);
    graph = new ghca_charts.view.graph("topo_edit", _topoEditotData);
    graph.autoResize(true);
    graph.render();
    topo = graph.getChildChart().children()[0];
    eye=new TopoEyeCanvas(topo);
    var selector = new Selector($easyui(".seriesTopo"));

    d3.select(".svgContainer").append("filter")
        .attr("id", "svg_gray").append("feColorMatrix")
        .attr("values", "0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0");


    function initEvent() {
        topo.addMouseDownHandler(topoMouseDown);
        topo.addMouseMoveHandler(topoMouseMove);
        topo.addMouseUpHandler(topoMouseUp);
        topo.mainContainer().node().addEventListener(BaseEvent.SCALE_CHANGE, changeZoom);

        d3.select("body").node().addEventListener(EditorEvent.CHANGE_NODE_DATA, changeNodeData);
        d3.select("body").node().addEventListener(EditorEvent.CHANGE_OPTION_TOOL, changeOptionTool);
        d3.select("body").node().addEventListener(EditorEvent.RESET_OPTION_TOOL, resetOptionTool);
        d3.select("body").node().addEventListener(EditorEvent.DRAG_DRAW_STOP, dragStop);
        d3.select("body").node().addEventListener(EditorEvent.CHANGE_EDIT_STATE_TOOL, changeEditState);
        d3.select("body").node().addEventListener(EditorEvent.CHANGE_EDIT_SCALE, changeScale);
        d3.selectAll(".svgContainer").on("click", clickSvg);
        d3.selectAll("g.seriesTopo").node().addEventListener("node_drag_end", nodeDragStop);
        $easyui(document).bind("contextmenu", function (e) { //右键监听
            // console.log("right");
            d3.event = e; //把事件丢给d3
            mouseRightHandler(e.target);
            return false;
        })

        $easyui(document).keyup(onKeyUp);
        $easyui(document).click(editorMenu.hideMenu);
        $easyui("#searchInput").on("input propertychange",doSearch);
        $easyui("#autoGroupCombobox").combobox({
            valueField: 'props',
            textField: 'name',
            editable:false,
            panelHeight:150,
            onSelect:onSelectAutoGroupProps,
        })
        needSave(false);
    }

    function onSelectAutoGroupProps(record){
        // console.log(record,topo);
        // $easyui("#autoGroupCombobox").combobox("select",record);
        if(topo.data().renderers.groupNode){
            topo.data().renderers.groupNode.autoGroupKeys=record.props;
            // topo.data().layout.fixed= false;
            // topo.data().layout.isAutoLayout= true;
            topo.update(true);
        }
    }

    this.resize=function(){
        graph.resizeHandler();
    }

    this.setAutoGroupInfos=function(infos){
        if(topo){
            topo.setAutoGroupInfo(infos);
            topo.update(true);
        }
        $easyui("#autoGroupCombobox").combobox("loadData",infos);
        $easyui("#autoGroupCombobox").combobox("select",infos[0].props);
    }


    var searchTimer;
    function doSearch(){
        var value=$easyui("#searchInput").val();
        clearTimeout(searchTimer);
        searchTimer=setTimeout(function(){
            toSearch(value);
        },500);
    }

    function toSearch(value){
        clearSelected.call(selfD);
        topo.focusOutAllNodes();
        var nodes=topo.nodes;
        var num=nodes.length;
        var results=[];
        for(var i=0;i<num;i++){
            var node=nodes[i];
            var name = node.name;
            var ip = node.ipAddr;
            if(name&&name.indexOf(value)>-1){
                results.push(node);
            }else if(ip&&ip.indexOf(value)>-1){
                results.push(node);
            }
        }
        focusInNodes(results);
    }

    focusInNodes = function(nodes) {
        if(!nodes || nodes.length===0) {
            return;
        }
        var ids=[];
        nodes.forEach(function(v){
            ids.push(v.id);
        });

        var i, len, ins, nodeIns, linkIns, groupIns, nodeData, linkData, links, opacity = 0.1, 
            nodesIns = topo.nodesIns, linksIns = topo.linksIns, groupsIns = topo.groupsIns, insAry = [];
        //找到目标对象，并淡化所有节点、连线、分组的显示效果
        for(i = 0, len = nodesIns.length; i < len; i++) {
            nodeIns = nodesIns[i];
            nodeIns.mainContainer().attr("opacity", opacity);
        }
        for(i = 0, len = linksIns.length; i < len; i++) {
            linkIns = linksIns[i];
            linkIns.mainContainer().attr("opacity", opacity);
        }
        for(i = 0, len = groupsIns.length; i < len; i++) {
            groupIns = groupsIns[i];
            groupIns.mainContainer().attr("opacity", opacity);
        }
        
        //添加要突出显示的对象到数组中
        for(var j=0;j<nodes.length;j++){
            nodeData=nodes[j];
            insAry.push(nodeData.ins);
            links = nodeData.links;
            if(links) {
                for(i = 0, len = links.length; i < len; i++) {
                    linkData = links[i];
                    insAry.push(linkData.ins);
                    if(linkData.target && linkData.target.ins) {
                        insAry.push(linkData.target.ins);
                    }
                    if(linkData.source && linkData.source.ins) {
                        insAry.push(linkData.source.ins);
                    }
                }
            }
        }
       
        //突出显示
        for(i = 0, len = insAry.length; i < len; i++) {
            ins = insAry[i];
            if(ins instanceof BaseComponent) {
                ins = ins.mainContainer();
            } else {
                ins = d3.select(ins.el.node().parentNode);
            }
            ins && ins.attr("opacity", 1);
        }
    };

    function onWindowMouseUp(e) {
        // console.log(e);
        var target = e.target;
        if (topo.isEditMode() === false && target.nodeName === "rect" && target.classList[0] === "bg") {
            clearSelected.call(selfD);
        }
        // d3.selectAll(".combo-p").style("display","none")
        $easyui("#autoGroupCombobox").combobox("hidePanel");//d3drag影响了mousedown事件只能自己关闭
    }

    function clickSvg() {
        var target = d3.event.target;
        if (needSaveMove) {
            // console.log("clickSvg save",needSaveMove)
            needSave(true);
            needSaveMove = false;
        }

        if(editState===false&&topo.isFocusNode()){
            var isNode=target.__data__?(target.__data__.renderer.indexOf("Node")!=-1&&target.__data__.renderer!="groupNode"?true:false):false;
            if(!isNode){
                topo.focusOutAllNodes();
            }
        }


        if (target.nodeName === "rect" && target.classList[0] === "bg" && currentTool === ToolName.SELECT) { //点的背景,且是编辑状态
            clearSelected.call(selfD);
            return true;
        }
        return false;
    }

    var oldScale;

    function changeZoom(e) {
        var scale = topo.scaleX();
        if(topo.scaleType()===1){
            scale=topo.layout().scale();
        }
        if (scale === oldScale) {
            return;
        }
        oldScale = scale;
        // console.log("changeZoom");
        var evt = EventUtil.createCustomEvent(EditorEvent.CHANGE_ZOOM, true, true, scale);
        d3.selectAll("body").node().dispatchEvent(evt);
    }

    var editState = true;

    function changeEditState(e) {
        if (selector) {
            selector.close();
        }
        if (editState != e.detail) {
            editState = e.detail;
            clearSelected.call(selfD);
            topo.dragNodeAble(editState);
            optionTool.setDefaultState();
            var evt = EventUtil.createCustomEvent(EditorEvent.CHANGE_EDIT_STATE, true, true, {
                editState: editState,
                needSave: isNeedSave
            });
            d3.selectAll("body").node().dispatchEvent(evt);
            var evt = EventUtil.createCustomEvent(BaseEvent.MODE_CHANGE, true, true, editState);
            d3.selectAll("g.seriesTopo").node().dispatchEvent(evt);

        }
    }

    /**
     * 是否在编辑状态
     */
    this.getEditState = function () {
        return editState;
    }

    /**
     * 是否需要保存
     */
    this.getIsNeedSave = function () {
        return isNeedSave;
    }

    function clearSelected() {
        // if(topo.isEditMode()===false){
        //     return;
        // }

        if (hasDrawRect) {
            hasDrawRect = false;
            return;
        }
        var items = topo.selectedNodeItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.ins.selected()) {
                item.ins.selected(false);
            }
        }
        if (this.getEditState() && topo.isEditMode() === false && currentTool != ToolName.MOVE) {
            var evt = EventUtil.createCustomEvent(BaseEvent.MODE_CHANGE, true, true, true);
            d3.selectAll("g.seriesTopo").node().dispatchEvent(evt);
        }
    }

    function nodeDragStop() {
        needSave(true);
    }

    var isNeedSave = false;

    function needSave(state) {
        if (!editState) { //非编辑状态不要去保存
            isNeedSave = false;
            return;
        }
        isNeedSave = state;
        // console.log("needSave:"+state);
        if (state) {
            recordHistory();
            optionTool.setBtnState(ToolName.SAVE, state);
        } else {
            optionTool.setBtnState(ToolName.SAVE, state);
        }
    }

    function recordHistory() {
        var saveData = selfD.getCurrentTopoData();
        if (topo.isEditMode() === false&&!editState) {
            return saveData;
        }
        if (hisDataInfos.length >= MAX_HISNUM) {
            hisDataInfos.shift();
        }
        if (hisDataInfos.length - 1 > hisIndex) { //说明这时候经过撤销处理，需要丢弃一部分记录
            hisDataInfos.length = hisIndex + 1;
        }
        // console.log("保存数据了....");
        hisDataInfos.push(saveData); //将数据保存在最后面
        hisIndex = hisDataInfos.length - 1; //只要有新保存的数据进来，历史记录就在最后一步去了
        updateCancelBtnState();
        return saveData;
    }

    var hisIndex = 0; //历史记录位置
    function toCancelTopo() {
        hisIndex--;
        if (hisIndex < 0) {
            hisIndex = 0;
            return;
        }
        var saveData = hisDataInfos[hisIndex];
        if (!saveData) {
            return;
        }
        selfD.updateData(ObjectUtil.cloneObj(saveData), false);
        updateCancelBtnState();
    }

    function toRedoTopo() {
        hisIndex++;

        if (hisIndex > hisDataInfos.length - 1) {
            hisIndex = hisDataInfos.length - 1;
            return;
        }

        var saveData = hisDataInfos[hisIndex];
        selfD.updateData(ObjectUtil.cloneObj(saveData), false);
        updateCancelBtnState();
    }

    function updateCancelBtnState() {
        //更新按钮状态
        optionTool.setBtnState(ToolName.REDO, hisIndex !== hisDataInfos.length - 1);
        optionTool.setBtnState(ToolName.UNDO, hisIndex > 0);
    }

    this.getCurrentTopoData = function () {
        var topoData = JSON.parse(graph.getChildChart().children()[0].toJSON(true));
        toFilterAttr(topoData);
        var saveData = {
            nodes: topoData.nodes,
            links: topoData.links,
            groups: topoData.groups,
        }
        return saveData;
    }

    function toSaveTopo(event) {
        if (!isNeedSave) {
            return;
        }
        var saveData = recordHistory();

        var evt = EventUtil.createCustomEvent(EditorEvent.NET_SAVE_DATA, true, true, saveData);
        d3.selectAll("body").node().dispatchEvent(evt);
    }

    function toFilterAttr(topoData) {
        var keys = ["lbBgOpa", "radius", "fontColor", "opacity", "render", "fx", "fy", "iconCls", "lbBgColor",
        ];
        for (var i = 0; i < topoData.nodes.length; i++) {
            var target = topoData.nodes[i];
            for (var index in keys) {
                delete target[keys[index]];
            }
        }
        for (var i = 0; i < topoData.links.length; i++) {
            var target = topoData.links[i];
            for (var index in keys) {
                delete target[keys[index]];
            }
        }
        for (var i = 0; i < topoData.groups.length; i++) {
            var target = topoData.groups[i];
            for (var index in keys) {
                delete target[keys[index]];
            }
        }

    }

    function onKeyUp(event) {
        if (editState === false) {
            return;
        }
        // console.log(event.keyCode);
        if (event.keyCode === 46) {
            var items = topo.selectedNodeItems();
            var ids = [];
            for (var i = 0; i < items.length; i++) {
                ids.push(items[i].id);
            }
            if (selector.isShow()) {
                ids.push(scaleTraget.id);
            }
            if (ids.length === 0) {
                return;
            }
            var evt = EventUtil.createCustomEvent(EditorEvent.NET_DEL_NODE, true, true, ids);
            d3.selectAll("body").node().dispatchEvent(evt);
        }
    }

    this.deleteSelectedNode = function () {
        var items = topo.selectedNodeItems();
        if (selector.isShow()) {
            items.push(scaleTraget);
        }
        if (selector) {
            selector.close();
        }
        while (items.length != 0) {
            var item = items.pop();
            selfD.deleteTopo(item);
        }
        needSave(true);
    }

    function dragStop(evt) {
        if (!addNodeData) {
            return;
        }

        IDCWindowManager.showSetNodeImgWin(addNodeData, setImgComplete);
    }

    function setImgComplete() {
        var evt = EventUtil.createCustomEvent(EditorEvent.NET_ADD_NODE, true, true, addNodeData); //告诉外侧要添加节点了
        d3.selectAll("body").node().dispatchEvent(evt);
        // toAddNode();
    }

    function resetOptionTool(evt) {
        var oldToolName = currentTool;
        var oldData = optionData;
        optionData = evt.detail;
        currentTool = optionData.toolName;
        if (selector) {
            selector.close();
        }

        switch (currentTool) {
            case ToolName.RESET:
                // resetTopoScale();
                currentTool = oldToolName;
                optionData = oldData;
                break;
            case ToolName.UNDO:
                // toCancelTopo();
                currentTool = oldToolName;
                optionData = oldData;
                break;
            case ToolName.REDO:
                // toRedoTopo();
                currentTool = oldToolName;
                optionData = oldData;
                break;
            case ToolName.SAVE:
                // toSaveTopo();
                currentTool = oldToolName;
                optionData = oldData;
                break;
        }
    }


    var optionData;

    function changeOptionTool(evt) {
        var oldToolName = currentTool;
        var oldData = optionData;
        optionData = evt.detail;
        currentTool = optionData.toolName;
        if (selector) {
            selector.close();
        }

        switch (currentTool) {
            case ToolName.RESET:
                resetTopoScale();
                currentTool = oldToolName;
                optionData = oldData;
                break;
            case ToolName.UNDO:
                toCancelTopo();
                currentTool = oldToolName;
                optionData = oldData;
                break;
            case ToolName.REDO:
                toRedoTopo();
                currentTool = oldToolName;
                optionData = oldData;
                break;
            case ToolName.SAVE:
                toSaveTopo();
                currentTool = oldToolName;
                optionData = oldData;
                break;
        }

        var evt;
        if (currentTool != ToolName.MOVE) {
            evt = EventUtil.createCustomEvent(BaseEvent.MODE_CHANGE, true, true, true);
        } else {
            evt = EventUtil.createCustomEvent(BaseEvent.MODE_CHANGE, true, true, false);
            topo.multSelectMode(false);
        }
        d3.selectAll("g.seriesTopo").node().dispatchEvent(evt);
    }

    function changeNodeData(evt) {
        addNodeData = evt.detail;
    }

    $easyui("#topo_edit").panel({
        onResize: function (w, h) {
            // graph.resizeHandler();
            // console.log("resize");
            legenWindow.layout();
        }
    })

    function topoMouseDown(target) {
        if (topo.isEditMode() === false) {
            var items = topo.selectedNodeItems();
            if (items.length != 0) {
                clickSvg();
            } else {
                return;
            }
        }
        var event = d3.event;
        if (event.which === 3) {
            return;
        }
        editorMenu.hideMenu();
        switch (currentTool) {
            case ToolName.LINE:
                startDrawLink();
                break;
            case ToolName.DOTTEDLINE:
                startDrawLink();
                break;
            case ToolName.RECT:
                topo.createSelectRect();
                break;
            case ToolName.SELECT:
                downSelect();
                break;
        }
    }

    function topoMouseMove(target) {
        if (topo.isEditMode() === false) {
            return;
        }
        switch (currentTool) {
            case ToolName.LINE:
                var seat = getTargetSeat(topo);
                changeDrawLink(seat);
                break;
            case ToolName.DOTTEDLINE:
                var seat = getTargetSeat(topo);
                changeDrawLink(seat);
                break;
            case ToolName.RECT:
                topo.drawSelectRect();
                break;
            case ToolName.SELECT:
                if (hasDrawRect) {
                    topo.drawSelectRect();
                }
                break;
        }
    }

    function mouseRightHandler(target) {
        // return;//南京版本屏蔽右键先
        if (!target) {
            return
        }
        var d = target.__data__;
        if (ObjectUtil.isString(d)) {
            d = target.parentNode ? target.parentNode.__data__ : null;
        }
        var downTargetD;
        if (d && d.ins) {
            downTargetD = d;
        }
        if (downTargetD) {
            var ins = downTargetD.ins;
            editorMenu.showMenu(ins, editState);
        }
    }

    function topoMouseUp(target) {
        if (topo.isEditMode() === false&&!editState) {//拓扑图是编辑模式并且也设置了编辑模式
            var items = topo.selectedNodeItems();
            if (items.length != 0) {
                clickSvg();
            } else {
                return;
            }
        }
        var event = d3.event;
        if (event.which === 3) {
            // mouseRightHandler();
            return;
        }
        switch (currentTool) {
            case ToolName.LINE:
                stopDrawLink(currentTool);
                break;
            case ToolName.DOTTEDLINE:
                stopDrawLink(currentTool);
                break;
            case ToolName.ADD_NODE:
                if (!addNodeData) {
                    return;
                }
                upSeat = getTargetSeat(topo);
                break;
            case ToolName.DELETE:
                var data = getTargetSeat(topo);
                var d3Target = d3.event.target;
                var d = d3Target.__data__;
                while (d3Target.parentNode) {
                    d = d3Target.__data__;
                    if ((typeof d3Target.__data__) == "object") {
                        break;
                    }
                    d3Target = d3Target.parentNode;
                }

                if (d && d.ins) {
                    data.ins = d.ins;
                }
                selfD.deleteTopo(data);
                needSave(true);
                break;
            case  ToolName.MOVE:
                needSave(true);
                break;
            case ToolName.RECT:
                groupNodes();
                break;
            case ToolName.SELECT:
                upSelect();
                break;
        }
    }

    var hasDrawRect = false;

    function downSelect() {
        if (topo.isEditMode() === false) {
            return;
        }
        var target = d3.event.target;
        if (target.nodeName === "rect" && target.classList[0] === "bg") { //点的背景
            topo.createSelectRect();
            hasDrawRect = true;
            if (selector.isClick(target) === false) {
                selector.close();
            }
        } else {
            selectHandler();
        }
    }

    function upSelect() {
        if (topo.isEditMode() === false) {
            return;
        }
        if (hasDrawRect) { //点的背景
            var items = topo.setSelectedItemsInSelectArea();
            topo.removeSelectRect();
            items.forEach(function (n) {
                n.ins.selected(true);
            });
            if (items.length > 1) { //选了多个
                var evt = EventUtil.createCustomEvent(BaseEvent.MODE_CHANGE, true, true, false);
                d3.selectAll("g.seriesTopo").node().dispatchEvent(evt);
                topo.multSelectMode(true);
                // console.log("选了多个，切换到移动模式");
            } else {
                var evt = EventUtil.createCustomEvent(BaseEvent.MODE_CHANGE, true, true, true);
                d3.selectAll("g.seriesTopo").node().dispatchEvent(evt);
            }
        } else {
            selectHandler();
            // if (selector.isShow()) {
            //     needSave(true);
            // }
        }
    }

    var selectNode;
    var scaleTraget;

    function selectHandler() {
        var target = d3.event.target;
        var d = target.__data__;
        clearSelected.call(selfD);
        if (editState && d3.event.ctrlKey === false && d && d.ins && d.ins instanceof Node) {
            scaleTraget = d;
            d.ins.selected(true);
            selectNode = d.ins.el._groups[0][0].parentNode;
            if (d.renderer === "imageNode") {
                targetClass = ".icon_image";
            } else if (d.renderer === "imageBgNode") {
                targetClass = ".iconNode";
            }
            if (selector.getSelectedElement() === selectNode) {
                return;
            }
            d.ins.update();
            selector.setSelectedElement(selectNode, targetClass, updateSeat);
            scaleTraget.ins.selected(true);
        } else if (selector.isClick(target) === false) {
            selector.close();
        }
    }

    var needSaveMove;

    function updateSeat(dx, dy, w, h) {
        scaleTraget.ins.selected(true);
        // console.log(d3.event.type)
        if (d3.event.type === "mouseup" && needSaveMove) {
            // console.log("updateSeat save",needSaveMove)
            needSave(true);
            needSaveMove = false;
        }
        if (dx === 0 && dy === 0 && scaleTraget.width === w && scaleTraget.height === h) {
            return;
        }
        var updataData = scaleTraget.ins.data();
        updataData.x += dx;
        updataData.y += dy;
        updataData.width = w;
        updataData.height = h;
        topo.updateDragedObjectPos(updataData);
        scaleTraget.ins.update(scaleTraget.ins.el);

        needSaveMove = true;

        // topo.update();
    }

    function groupNodes() {
        var items = topo.setSelectedItemsInSelectArea();
        topo.removeSelectRect();

        // var items = topo.selectedNodeItems();
        var groups = [];
        items.forEach(function (n) {
            if (!n.isBg) {
                groups.push(n.id);
            }
        });


        if (groups.length < 2) {
            $easyui.messager.alert({
                ok: "确定",
                msg: "一个组至少包含两个节点！",
                title: "提示",
                closable: false
            });
            return;
        }
        var data = {
            id: UUIDUtil.generateUUID(),
            renderer: optionData.data.renderer,
            name: "",
            nodes: groups,
            visible: true,
            radius: 20,
            fill: optionData.data.fill,
            fillOp: optionData.data.fillOp,
            lbBgFill: optionData.data.lbBgFill,
            lbFill: optionData.data.lbFill,
            lbOp: optionData.data.lbOp,
            type: optionData.data.type
        };
        var evt = EventUtil.createCustomEvent(EditorEvent.NET_ADD_GROUP, true, true, data);
        d3.selectAll("body").node().dispatchEvent(evt);
    }

    this.addGroup = function (data) {
        var evt = EventUtil.createCustomEvent(BaseEvent.ADD_ITEMS, true, true, {
            type: "group",
            data: [data]
        });
        d3.selectAll("g.seriesTopo").node().dispatchEvent(evt);
        needSave(true);
    }

    this.deleteTopo = function (data) {
        var target = data.ins;
        if (!target) {
            return;
        }

        if (target instanceof Node) {
            topo.removeNodeInUI(target.data());
            var evt = EventUtil.createCustomEvent(BaseEvent.HIDE_TOOL_TIP, true, true);
            topo.dispatchEvent(evt);
        } else if (target instanceof Link) {
            topo.removeLinkInUI(target.data());
            var evt = EventUtil.createCustomEvent(BaseEvent.HIDE_TOOL_TIP, true, true);
            topo.dispatchEvent(evt);
        } else if (target instanceof GroupNode) {
            topo.removeGroupsInUI([target.itemData()]);
        }
        needSave(true);
    }

    function changeDrawLink(data) {
        if (drawLinkSource) {
            topo.drawLink(drawLinkSource.x, drawLinkSource.y, data.x, data.y);
        }
    }

    function startDrawLink() {
        topo.endDrawLink();
        var target = d3.event.target;
        var d = target.__data__;
        var downTargetD;
        if (d && d.ins) {
            downTargetD = d;
        }
        drawLinkSource = undefined;
        if (downTargetD) {
            var ins = downTargetD.ins;
            var linkData = {
                renderer: optionData.data.renderer,
                name: "",
                lineIndex: 0,
                visible: true,
                lbBgColor: optionData.data.lbBgColor,
                lbBgOpa: optionData.data.lbBgOpa,
                fontColor: optionData.data.fontColor,
                borderWidth: optionData.data.borderWidth,
                fill: optionData.data.fill,
                borderOpacity: optionData.data.borderOpacity,
                dottedStep: optionData.data.dottedStep,
            };
            if (ins instanceof Node) {
                if (ins.isBg) {
                    return;
                }
                drawLinkSource = d;
                topo.startDrawLink(d.x, d.y, linkData);
            }
        }
    }

    function stopDrawLink(currentTool) {
        var target = d3.event.target;
        var d = target.__data__;
        if (d && d.ins && d.ins instanceof Node && !d.ins.isBg) {
            drawLinkTarget = d;
            var evt = EventUtil.createCustomEvent(EditorEvent.NET_ADD_LINK, true, true, {
                source: drawLinkSource,
                target: drawLinkTarget,
                tool: currentTool,
            });
            d3.selectAll("body").node().dispatchEvent(evt);
        }
        topo.endDrawLink();
    }

    this.showLegendWin = function (data) {
        if (!data) {
            legenWindow.close();
            return;
        }
        legenWindow.open(data);
    }

    this.addLinks = function (datas) {
        if (drawLinkSource && drawLinkTarget && drawLinkTarget.ins instanceof Node && drawLinkSource !== drawLinkTarget) {
            var links = [];
            for (var i = 0; i < datas.length; i++) {
                var data = datas[i];
                var linkData = {
                    id: UUIDUtil.generateUUID(),
                    renderer: optionData.data.renderer,
                    name: "",
                    lineIndex: 0,
                    visible: true,
                    source: drawLinkSource.id,
                    target: drawLinkTarget.id,
                    lbBgColor: optionData.data.lbBgColor,
                    lbBgOpa: optionData.data.lbBgOpa,
                    fontColor: optionData.data.fontColor,
                    borderWidth: optionData.data.borderWidth,
                    fill: optionData.data.fill,
                    borderOpacity: optionData.data.borderOpacity,
                    dottedStep: optionData.data.dottedStep,
                    type: optionData.data.type,
                    position: optionData.data.position
                }
                for (var key in data) {
                    linkData[key] = data[key];
                }

                links.push(linkData);
            }
            var evt = EventUtil.createCustomEvent(BaseEvent.ADD_ITEMS, true, true, {
                type: optionData.data.type,
                data: links
            });
            d3.selectAll("g.seriesTopo").node().dispatchEvent(evt);
            needSave(true);
        }else{
            var links = [];
            var d = {
                links: datas,
                nodes: [],
                groups: []
            };
            ToolData.addDefaultData(d);
            for (var i = 0; i < datas.length; i++) {
                var data = datas[i];
                var linkData = {
                    id: data.id?data.id: UUIDUtil.generateUUID(),
                    renderer: data.renderer?data.renderer:"link",
                    name: "",
                    lineIndex: 0,
                    visible: true,
                    source: data.source,
                    target: data.target,  
                    type: "default",
                }
                if(!topo.findNode(linkData.source)||!topo.findNode(linkData.target)||linkData.target===linkData.source){
                    continue;
                }

                for (var key in data) {
                    if(key!=="visible"){
                        linkData[key] = data[key];
                    }
                }

                links.push(linkData);
            }
            var evt = EventUtil.createCustomEvent(BaseEvent.ADD_ITEMS, true, true, {
                type: "link",
                data: links
            });
            d3.selectAll("g.seriesTopo").node().dispatchEvent(evt);
        }
    }


    this.addNode = function (addData) {
        var seat = upSeat;
        var evt;
        if (currentTool === ToolName.MOVE) {
            evt = EventUtil.createCustomEvent(BaseEvent.MODE_CHANGE, true, true, true);
            d3.selectAll("g.seriesTopo").node().dispatchEvent(evt);
        } else if (currentTool === ToolName.ADD_NODE) {
            currentTool = ToolName.SELECT;
        }
        if(!addNodeData){
            addData.type=addData.type?addData.type:"routenode";
            var d = {
                links: [],
                nodes: [addData],
                groups: []
            };
            ToolData.addDefaultData(d);
            addNodeData=addData;            
        }
        if (addNodeData.render === "imageBgNode") {
            addNodeData.name = null;
        }
        var nodeData = {
            renderer: addNodeData.render?addNodeData.render:"imageNode",
            id: addNodeData.id?addNodeData.id:UUIDUtil.generateUUID(),
            name: addNodeData.name,
            icon: addNodeData.icon,
            width: addNodeData.width,
            height: addNodeData.height,
            opacity: addNodeData.opacity,
            lbBgColor: addNodeData.lbBgColor,
            lbBgOpa: addNodeData.lbBgOpa,
            fontColor: addNodeData.fontColor,
            x: !seat ? 100 : seat.x,
            y: !seat ? 100 : seat.y,
            visible: true,
            isBg: addNodeData.isBg,
            noToolTip: addNodeData.noToolTip,
            type: addNodeData.type
        };

        for (var key in addData) {
            if(key!=="visible"){
                nodeData[key] = addData[key];
            }
        }

        evt = EventUtil.createCustomEvent(BaseEvent.ADD_ITEMS, true, true, {
            type: "node",
            data: [nodeData]
        });
        d3.selectAll("g.seriesTopo").node().dispatchEvent(evt);
        // focusOnNode(nodeData.id);
        addNodeData = null;
        needSave(true);

        if(currentTool===ToolName.MOVE){
            evt= EventUtil.createCustomEvent(BaseEvent.MODE_CHANGE, true, true, false);
            d3.selectAll("g.seriesTopo").node().dispatchEvent(evt);
        }
    }

    function getTargetSeat(target) {
        var coordinates = MouseUtil.mouse(target.mainContainer().node(), target.graph());
        var seat = {};
        seat.x = coordinates[0];
        seat.y = coordinates[1];
        return seat;
    }

    /**
     * 聚焦到指定节点
     * @param {*} id 
     */
    this.focusOnNode = function (id) {
        var nodes = topo.nodes;
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (node.id === id) {
                topo.centerAndFocusInNode(id);
                topo.focusOutAllNodes();
                node.ins.selected(true);
                break;
            }
        }
    }

    this.findNodeData = function (id) {
        var nodes = topo.nodes;
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (node.id === id) {
                return node;
            }
        }
        return null;
    }

    /**
     * 根据节点数据更新节点
     * @param {*} data 
     */
    this.updateNodeByData = function (data) {
        var nodes = topo.nodes;
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (node.id === data.id) {
                for (var key in data) {
                    node[key] = data[key];
                }
                node.ins.update();
                needSave(true);
                break;
            }
        }
    }

    this.showNodeWarn = function (state) {
        d3.selectAll("g.nodeContainer").each(function (d) {
            d.showWarn = state;
            var ins = d.ins;
            // console.log("showNodeWarn")
            ins.update();
        });
    }

    this.updateNodeWarnDatas = function (id, warnDatas) {
        var data = selfD.findNodeData(id);
        if (data) {
            data.warnDatas = warnDatas;
            data.ins.update();
            needSave(true);
        }
    }

    function changeScale(e) {
        var scale = e.detail / 100;
        // topo.x(0);
        // topo.y(0);
        // topo.scaleX(scale);
        // topo.scaleY(scale);

        // topo.renderTransform();

        if(topo.scaleType()===1){
            topo.layout().zoomToPosition({
                x: topo.width() * (1 - scale) * 0.5,
                y: topo.height() * (1 - scale) * 0.5
            }, scale);
        }else{
            topo.zoomToPosition({
                x: topo.width() * (1 - scale) * 0.5,
                y: topo.height() * (1 - scale) * 0.5
            }, scale);
        }
    }

    function resetTopoScale() {
        topo.x(0);
        topo.y(0);
        topo.scaleX(1);
        topo.scaleY(1);
        topo.renderTransform();
    }

    var mergeData = [];
    this.getMergeData = function () {
        return mergeData;
    }

    /**
     * 合并连线
     */
    this.mergeLinks = function () {
        var linksData = topo.getVisibleLinks(topo.links);
        mergeData = [];
        lineMap={};
        for (var i = 0; i < linksData.length; i++) {
            toSave(mergeData, linksData[i]);
        }

        var evt = EventUtil.createCustomEvent(EditorEvent.NET_MERAGE_LINK, true, true, mergeData);
        d3.selectAll("body").node().dispatchEvent(evt);
    }

    this.showMergeLinks = function (mergeData) {
        mergeData = mergeData;
        var linksContainer = topo.linksContainer;
        linksContainer.removeAllChildren();
        topo.linksIns.length = 0;
        var d = {
            links: mergeData,
            nodes: [],
            groups: []
        };
        ToolData.addDefaultData(d);
        //渲染连线内容   
        var linksIns = ClassFactory.newRenderersInstanceByData(linksContainer, topo, "linkContainer", mergeData, false, "stroke");
        if (linksIns) {
            for (var linkIns, i = 0, len = linksIns.length; i < len; i++) {
                linkIns = linksIns[i];
                topo.linksIns.push(linkIns);
                var link = linkIns.mainContainer().data()[0].ins;
                link.update();
            }
        }
    }

    var lineMap={};
    function toSave(list, value) {
        var mergeItem;
        for (var i = 0; i < list.length; i++) {
            if (list[i].target === value.target && list[i].source === value.source) {//目标和源一致的 不变了
                mergeItem = list[i];
                mergeItem.childrens.push(value);
                return;
            }
        }
        var id=value.source.id + "_" + value.target.id;
        var idRe=value.target.id+"_" +value.source.id;
        var lineIndex=0;
       if(lineMap[id]||lineMap[idRe]){
            lineIndex=1;
       }
        mergeItem = {
            id: id,
            source: value.source,
            target: value.target,
            visible: true,
            renderer: value.renderer,
            borderWidth: value.borderWidth,
            dottedStep: value.dottedStep,
            borderColor: value.borderColor,
            lbBgOpa: value.lbBgOpa,
            lbBgColor: value.lbBgColor,
            fontColor: value.fontColor,
            childrens: [value],
            lineIndex: lineIndex,
            name: "合并后的"
        }
        lineMap[id]=true;
        // ObjectUtil.cloneObj(value);
        // mergeItem.childrens=[value];//存储关联的所有连线，供后面展示用
        list.push(mergeItem);
    }


    this.showSeparateLinks = function () {
        if (!mergeData || mergeData.length === 0) { //没有合并
            return;
        }
        mergeData = [];
        var linksContainer = topo.linksContainer;
        linksContainer.removeAllChildren();
        topo.linksIns.length = 0;

        var linksData = topo.getVisibleLinks(topo.links);

        //渲染连线内容   
        var linksIns = ClassFactory.newRenderersInstanceByData(linksContainer, topo, "linkContainer", linksData, false, "stroke");
        if (linksIns) {
            for (var linkIns, i = 0, len = linksIns.length; i < len; i++) {
                linkIns = linksIns[i];
                topo.linksIns.push(linkIns);
                var link = linkIns.mainContainer().data()[0].ins;
                // link.data().borderColor="#ff0000";
                link.update();
            }
        }
    }

    this.updateLinks = function (datas) {
        for (var i = 0; i < datas.length; i++) {
            var data = datas[i];
            var link = findLink(data.id);

            if (link) {
                for (var key in data) {
                    var currentData = link.ins.data();
                    if (ObjectUtil.isObject(currentData[key])) {
                        if (key === "source" || key === "target") { //切换起始点
                            data[key] = selfD.findNodeData(data[key]);
                            currentData[key] = data[key];
                        }
                        continue;
                    }
                    currentData[key] = data[key];
                }
                link.ins.update();
            }
        }

        needSave(true);
    }

    function findLink(id) {
        var datas = d3.selectAll(".configlink").data();
        for (var i = 0; i < datas.length; i++) {
            if (datas[i].id === id) {
                return datas[i];
            }
        }
        return null;
    }

    this.findLinkData = function (id) {
        return topo.findLink(id);
    }

    var currentSelectLink;
    this.selectLink = function (id) {
        if (currentSelectLink) {
            currentSelectLink.ins.selected(false);
            currentSelectLink.ins.update();
        }
        var link = topo.findLink(id);
        if (link) {
            currentSelectLink = link;
            currentSelectLink.ins.selected(true);
            currentSelectLink.ins.update();
        }
    }

    this.showPortGroup = function (data) {
        data.reqNode = selfD.findNodeData(data.reqNode.id);
        IDCWindowManager.showPortGroupWindow(data)
    }

    this.updatePortGroupLinkAndNode = function (data) {
        IDCWindowManager.updatePortGroupLinkAndNode(data)
    }

    this.updateData = function (data, clearHis) {
        // console.log(data);
        if(ObjectUtil.isString(data)){
            data=JSON.parse(data);
        }
        // var otA = new Date().getTime();
        ToolData.addDefaultData(data);
        // var nt = new Date().getTime();
        // console.log("addDefaultData cost time:" + (nt - otA) + "ms");
        _topoEditotData.links = data.links;
        _topoEditotData.groups = data.groups;
        _topoEditotData.nodes = data.nodes;
        // var ot = new Date().getTime();
        graph.setDataAndUpdate(_topoEditotData);
        // var nt = new Date().getTime();
        // console.log("setDataAndUpdate cost time:" + (nt - ot) + "ms");
        if (arguments.length === 1) {
            clearHis = true;
        }
        if (clearHis) {
            hisDataInfos.length = 0;
            needSave(false);
        }
        // var nt = new Date().getTime();
        // console.log("updateData cost time:" + (nt - otA) + "ms");
    }


    recordHistory();
    initEvent();

    var test=[
        {
            props:"state",
            name:"state"
        },
        {
            props:"test",
            name:"测试"
        }
    ]

    this.setAutoGroupInfos(test);
}

module.exports = TopoEditor;