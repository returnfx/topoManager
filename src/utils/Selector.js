var utils=require("./utilities");
function Selector(parent){
    var slefParent=parent;
    var selectedElement;
    var selectorGroup,selectorRect,selector;
    var self=this;

    /**
     * nw--n--ne
     * |   |   |
     * w-------e
     * |   |   |
     * sw--s--se
     */
    var gripCoords = {
        nw: null,
        n: null,
        ne: null,
        e: null,
        se: null,
        s: null,
        sw: null,
        w: null
    };

    var fixedNum = 1;
    var _eleUpdate;
    var toFixed = function(n, f) {
        if(f === undefined) {
            f = fixedNum;
        }
        return parseFloat(n.toFixed(f));
    };


    var w = d3.select(window);
    var minW=20;
    var minH=20;
    function addTranslateListeners(){
        w.on("mousedown.translate", function() {
            d3.event.stopImmediatePropagation();
            var event=d3.event;
            var target=event.target;
            if(target.nodeName==="DIV"){
                return;
            }
            if(!selectedElement){
                // console.log("没有选择元素");
                return;
            }
            var isResize=false;
            if(target.id.indexOf("selectorGrip_resize_")!==-1){
                isResize=true;
            }
    
            var previousEvent = d3.event;
            w.on("mousemove.translate", function() {
                d3.event.stopImmediatePropagation();
                var dx = toFixed((d3.event.movementX||(d3.event.screenX - previousEvent.screenX)));//chrome/firefox||兼容ie
                var dy = toFixed((d3.event.movementY||(d3.event.screenY - previousEvent.screenY)));
                previousEvent = d3.event;
                if(!isResize){
                    move(dx,dy);
                    if(_eleUpdate){
                        _eleUpdate(dx,dy,opBox.width,opBox.height);
                    }
                }else{
                    resizeHandler(target.id,dx,dy);
                }
            });
            w.on("mouseup.translate", function() {
                d3.event.stopImmediatePropagation();
                w.on("mousemove.translate", null);
                w.on("mouseup.translate", null);
                 move(0,0);
                if(_eleUpdate){
                    // console.log("mouseup.translate");
                    _eleUpdate(0,0,opBox.width,opBox.height);
                }             
            });
        });
    }

    this.isClick=function(target){
        return target.id.indexOf("selectorGrip_resize_")!==-1;
    }

    function resizeHandler(id,dx,dy){
        var preW=opBox.width;
        var preH=opBox.height;
        // console.log(dx,dy);
        if(id==="selectorGrip_resize_nw"){
            var cv=dx>dy?dx:dy;
            opBox.width-=cv;
            opBox.height-=cv;
            
            if(opBox.width<=minW){
                opBox.width=minW;
                dx=preW-opBox.width;
            }
            if(opBox.height<=minH){
                opBox.height=minH;
                dy=preH-opBox.height;
            }
            cv=dx>dy?dx:dy;
            drawSelector();
            var mx=defaultW-opBox.width;
            var my=defaulH-opBox.height;
            move(mx*0.5,my*0.5);
            if(_eleUpdate){
                // console.log(dx,dy);
                _eleUpdate(cv*0.5,cv*0.5,opBox.width,opBox.height);
            }
        }else if(id==="selectorGrip_resize_n"){
            opBox.height-=dy;
            if(opBox.height<=minH){
                opBox.height=minH;
                dy=preH-opBox.height;
            }
            drawSelector();
            var mx=defaultW-opBox.width;
            var my=defaulH-opBox.height;
            move(mx,my);
            if(_eleUpdate){
                _eleUpdate(0,dy*0.5,opBox.width,opBox.height);
            }
        }else if(id==="selectorGrip_resize_ne"){
            var vx= Math.abs(dx);
            var vy=Math.abs(dy);
            var cv=vx<vy?dx:dy;
            cv*=-1;

            opBox.width+=cv;
            opBox.height+=cv;
            if(opBox.width<=minW){
                opBox.width=minW;
                dx=opBox.width-preW;
            }
            if(opBox.height<=minH){
                opBox.height=minH;
                dy=preH-opBox.height;
            }
            vx= Math.abs(dx);
            vy=Math.abs(dy);
            cv=vx<vy?dx:dy;

            drawSelector();
            var mx=defaultW-opBox.width;
            var my=defaulH-opBox.height;
            move(mx*0.5,my*0.5);
            if(_eleUpdate){
                _eleUpdate(cv*0.5*-1,cv*0.5,opBox.width,opBox.height);
            }
        }else if(id==="selectorGrip_resize_e"){
            opBox.width+=dx;
            if(opBox.width<=minW){
                opBox.width=minW;
                dx=opBox.width-preW;
            }
            drawSelector();
            if(_eleUpdate){
                _eleUpdate(dx*0.5,0,opBox.width,opBox.height);
            }
        }else if(id==="selectorGrip_resize_se"){
            var vx= Math.abs(dx);
            var vy=Math.abs(dy);
            var cv=vx<vy?dx:dy;

            opBox.width+=cv;
            opBox.height+=cv;
            if(opBox.width<=minW){
                opBox.width=minW;
                dx=opBox.width-preW;
            }
            if(opBox.height<=minH){
                opBox.height=minH;
                dy=opBox.height-preH;
            }
            vx= Math.abs(dx);
            vy=Math.abs(dy);
            cv=vx<vy?dx:dy;
            drawSelector();
            var mx=defaultW-opBox.width;
            var my=defaulH-opBox.height;
            move(mx*0.5,my*0.5);
            if(_eleUpdate){
                _eleUpdate(cv*0.5,cv*0.5,opBox.width,opBox.height);
            }
        }else if(id==="selectorGrip_resize_s"){
            opBox.height+=dy;
            if(opBox.height<=minH){
                opBox.height=minH;
                dy=opBox.height-preH;
            }
            drawSelector();
            if(_eleUpdate){
                _eleUpdate(0,dy*0.5,opBox.width,opBox.height);
            }
        }else if(id==="selectorGrip_resize_sw"){
            var cv=dx<dy?dx:dy*-1;

            opBox.width-=cv;
            opBox.height-=cv;
            if(opBox.width<=minW){
                opBox.width=minW;
                dx=preW-opBox.width;
            }
            if(opBox.height<=minH){
                opBox.height=minH;
                dy=opBox.height-preH;
            }
            cv=dx<dy?dx:dy*-1;
            drawSelector();
            var mx=defaultW-opBox.width;
            var my=defaulH-opBox.height;
            move(mx*0.5,my*0.5);
            if(_eleUpdate){
                _eleUpdate(cv*0.5,cv*0.5*-1,opBox.width,opBox.height);
            }
        }else if(id==="selectorGrip_resize_w"){
            opBox.width-=dx;
            if(opBox.width<=minW){
                opBox.width=minW;
                dx=preW-opBox.width;
            }
            drawSelector();
            var mx=defaultW-opBox.width;
            var my=0;
            move(mx,my);
            if(_eleUpdate){
                _eleUpdate(dx*0.5,0,opBox.width,opBox.height);
            }
        }
    }

    function move(dx,dy){
        selectorSeat.x+=dx;
        selectorSeat.y+=dy;
        selectorGroup.attr('transform', "translate("+selectorSeat.x+","+selectorSeat.y+")");
    }

    var optionTarget;
    var gripRadius=4;
    this.setSelectedElement=function(ele,target,eleUpdate){
        // return;
        _eleUpdate=eleUpdate;
        calSelector(ele,target);
       addTranslateListeners();
    }

    this.close=function(){
        selectedElement=null;
        _eleUpdate=null;
        optionTarget=null;
        w.on("mousedown.translate",null);
        if(selectorGroup){
            selectorGroup.remove();
        }
        if(selector){
            selector.remove();
        }
    }

    var selectorSeat={};
    var opBox;
    var defaultW;
    var defaulH;
    function calSelector(ele,target)
    {
        selectedElement=ele;
        optionTarget=d3.select(ele).select(target).node();
        opBox=utils.getBBox(optionTarget);
        defaultW=opBox.width;
        defaulH=opBox.height;
        drawSelector();
    }

    this.isShow=function(){
        return selectorGroup&&selectorGroup.node();
    }

    this.getSelectedElement=function(){
        return selectedElement;
    }

    function drawSelector(){
        // console.log("drawSelector()");
        if(selectorGroup){
            selectorGroup.remove();
        }

        selectorGroup=d3.selectAll(slefParent).append("g")
        .attr("id","selectorGroup");

        selectorRect=d3.selectAll("#selectorGroup").append("path")
        .attr("fill",'none')
        .attr("stroke", '#22C')
        .attr("stroke-width", '#1')
        .attr("style", 'pointer-events:none')
        .attr("stroke-dasharray", '5,5');
    
        var w=opBox.width*0.5;
        var w1=opBox.width*-0.5;
        var h=opBox.height*0.5;
        var h1=opBox.height*-0.5;
        var rectPath={
            nw: [w1,h1],
            ne: [w,h1],
            se: [w,h],
            sw: [w1,h],
        }

        gripCoords = {
            nw: [w1,h1],
            ne: [w,h1],
            se: [w,h],
            sw: [w1,h],
            n: [w1 + w, h1],
            w: [w1, h1+h],
            e: [w, h1+h],
            s: [w1+w, h]
        };

        girdShow={
            nw: true,
            ne: true,
            se: true,
            sw: true,
            n: false,
            w: false,
            e: false,
            s: false
        }

        var dstr = 'M' + rectPath.nw[0] + ',' + rectPath.nw[1] + ' L' + rectPath.ne[0] + ',' + rectPath.ne[1] + ' ' + rectPath.se[0] + ',' + rectPath.se[1] + ' ' 
        + rectPath.sw[0] + ',' + rectPath.sw[1] + 'z';
        selectorRect.attr('d', dstr);

        if(selector){
            selector.remove();
        }
        selector=d3.selectAll("#selectorGroup").append("g")
        .attr("display","block");
        var datas=[];
        for (var dir in gripCoords) {
            if(girdShow[dir]){
                selector.append("circle")
                .attr("id",'selectorGrip_resize_' + dir)
                .attr("fill","#22C")
                .attr("r",gripRadius)
                .attr("style",'cursor:' + dir + '-resize')
                .attr("stroke-width","#22C")
                .attr("cx",gripCoords[dir][0])
                .attr("cy",gripCoords[dir][1])
            }
        }    

        calSeat();       
    }

    function  calSeat(){
        var tlist = utils.getTransformList(selectedElement);
        var m = utils.transformListToTransform(tlist).matrix;
        var l = opBox.x,
        t = opBox.y,
        w = opBox.width,
        h = opBox.height;
        var nbox = utils.transformBox(l , t , w , h , m);
        selectorSeat.x=nbox.aabox.x+w*0.5;
        selectorSeat.y=nbox.aabox.y+h*0.5;
        selectorGroup.attr('transform', "translate("+selectorSeat.x+","+selectorSeat.y+")");
    }
}

module.exports=Selector;