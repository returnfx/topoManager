function TopoEyeCanvas(eyeTarget){
    const BaseEvent = ghca_charts.events.BaseEvent;
    const EventUtil = ghca_charts.view.util.eventUtil;
    const Tree=ghca_charts.view.component.charts.tree;
    var canvas=document.createElement("canvas");//绘制区域
    var rectCanvas=document.createElement("canvas");//框选矩形
    var imgCatch={};
    var eyeW=150;
    var eyeH=150;
    var offsetX;
    var offsetY;
    canvas.width=eyeW;
    canvas.height=eyeH;
    canvas.className="topoEye";
    document.body.append(canvas);
    rectCanvas.width=eyeW;
    rectCanvas.height=eyeH;
    document.body.append(rectCanvas);
    var ctx=canvas.getContext("2d");
    var rectCtx=rectCanvas.getContext("2d");
    eyeTarget.useEagleEye(true);
    var rectX=0,rectY=0;//矩形区域的xy
    d3.select(rectCanvas).on("click",drawRect);
    d3.select(rectCanvas).on("mousedown",toDragRect);
    d3.select(rectCanvas)
    .style("border","1px solid rgb(149, 184, 231)")
    .style("position","absolute")
    .style("bottom",10+"px")
    .style("right",10+"px")
    .style("cursor","move")
    .style("z-index",Math.max());

    d3.select(canvas)
    .style("position","absolute")
    .style("bottom",10+"px")
    .style("right",10+"px")
    .style("z-index",Math.max()-1);
    // ctx.translate(20,0);
    var start;
    var freshCD=1000/24;
    function redraw(time){
        if(!start){
            start=time;
        }
        window.requestAnimationFrame(redraw);
        if(time-start>freshCD){
            start=time;
            render();
        }
    }

    eyeTarget.node().addEventListener(BaseEvent.POSITION_CHANGE,function(e){
        drawRect(true);
    });

    function toDragRect(){
        d3.select(rectCanvas).on("mousemove",moveRect);
        d3.select(rectCanvas).on("mouseup",upRect);
        d3.select(rectCanvas).on("mouseout",upRect);
        // d3.select(rectCanvas).style("cursor", "move");
    }

    function moveRect(){
        drawRect();
    }

    function upRect(){
        // d3.select(rectCanvas).style("cursor", "default");
        d3.select(rectCanvas).on("mousemove",null);
        d3.select(rectCanvas).on("mouseup",null);
        d3.select(rectCanvas).on("mouseout",null);
    }

    var clickXY;
    function drawRect(useSeat){
        var newClickSeat;
        var rectNode=d3.select(".seriesTopo").node()?d3.select(".seriesTopo").node():d3.select(".tree").node();
        var topoSeat=rectNode.getBoundingClientRect();//除了宽高,其他参数都是相对于视口而言,也就是自己的window容器
        var box=rectNode.getBBox();//这里获取到拓扑图的绘制宽高
        var svg=d3.select(".svgContainer");
        var svgSeat=svg.node().getBoundingClientRect();
        var seatInfo={
            left:topoSeat.left-svgSeat.left,
            top:topoSeat.top-svgSeat.top,
        }
        //计算缩放比
        var scaleX=eyeW/box.width;
        var scaleY=eyeH/box.height;
        if(!useSeat){
            newClickSeat=d3.mouse(d3.event.currentTarget);
        }else{
            newClickSeat=[-1*seatInfo.left*scaleX/eyeTarget.scaleX(),-1*seatInfo.top*scaleY/eyeTarget.scaleY()];//可视区域在目标的坐标系的坐标
        }
        if(clickXY&&newClickSeat[0]===clickXY[0]&&newClickSeat[1]===clickXY[1]){
            return;
        }
        clickXY=newClickSeat;
        var svgW=svg.attr("width");
        var svgH=svg.attr("height");
        var rectW=svgW*scaleX;
        var rectH=svgH*scaleY;
        var halfW=rectW*0.5;
        var halfH=rectH*0.5;
        var maxX=eyeW-rectW;
        var maxY=eyeH-rectH;
        if(!useSeat){
            rectX=clickXY[0]-halfW;
            rectY=clickXY[1]-halfH;
        }else{
            rectX=clickXY[0];
            rectY=clickXY[1];
        }
        rectX=rectX<0?0:rectX;
        rectX=rectX>maxX?maxX:rectX;
        rectY=rectY<0?0:rectY;
        rectY=rectY>maxY?maxY:rectY;


        rectCtx.clearRect(0,0,rectCanvas.width,rectCanvas.height);
        rectCtx.strokeStyle="#ff0000";
        rectCtx.lineWidth=0.5;
        rectCtx.strokeRect(rectX,rectY,rectW,rectH);
        if(!useSeat){//触发变更的要通知外部更新
            //转换为外部坐标值
            var transX=rectX/scaleX;
            var transY=rectY/scaleY;
            var offX=box.x;
            var offY=box.y;
            transX+=offX;
            transY+=offY;
            transX*=-1;
            transY*=-1;
            eyeTarget.node().dispatchEvent(EventUtil.createCustomEvent(BaseEvent.EAGLE_EYE_DRAG,true,true,{x:transX,y:transY}));
        }
    }

    var nodeW=4,nodeH=4;
    function render(){
        var t=new Date().getTime();
        var rectNode=d3.select(".seriesTopo").node()?d3.select(".seriesTopo").node():d3.select(".tree").node();
        var box=rectNode.getBBox();
        // var svgSeat=d3.select(".svgContainer").node().getBoundingClientRect();
        // d3.select(rectCanvas).style("left",svgSeat.left+"px");
        // d3.select(canvas).style("left",svgSeat.left+"px");
        var scaleX=(eyeW)/(box.width+60);
        var scaleY=(eyeH)/(box.height+60);
        // scaleX=scaleY=0.1;
        var nodes=[];
        if(eyeTarget instanceof Tree){
            nodes=eyeTarget.data().nodes;
        }else{
            nodes=eyeTarget.nodes;
        }
        nodes=createNodes(nodes);
        var num=nodes.length;
        ctx.clearRect(0,0,eyeW,eyeH);
        ctx.fillStyle="#ffffff";
        ctx.fillRect(0,0,eyeW,eyeH);
        for(var i=0;i<num;i++){
            var x=scaleX*nodes[i].x-nodeW*0.5;
            var y=scaleY*nodes[i].y-nodeH*0.5;
            var img=getImage(nodes[i].icon);
            ctx.drawImage(img,0,0,img.width,img.height,x,y,nodeW,nodeH);
        }
        var links=eyeTarget.links;
        var absY=Math.abs(offsetY);
        var absX=Math.abs(offsetX);
        if(eyeTarget instanceof Tree){
            links=eyeTarget.linkInsMap().values();
        }else{
            links=eyeTarget.links;
            absY=absX=0;
        }
        if(links.length>0){
            ctx.strokeStyle=links[0].fill?links[0].fill:"#999";
        }else{
            ctx.strokeStyle="#999";
        }
        ctx.lineWidth=0.5;
        ctx.beginPath();
        num=links.length;
        for(var i=0;i<num;i++){
            var stNodes;
            if(eyeTarget instanceof Tree){
                stNodes=findLinkNodeTree(links[i]);
            }else{
                stNodes=findLinkNode(nodes,links[i]);
            }            
          
            if(stNodes[0]&&stNodes[1]){
                var x=scaleX*(stNodes[0].x+absX);
                var y=scaleY*(stNodes[0].y+absY);
                ctx.moveTo(x,y);
                x=scaleX*(stNodes[1].x+absX);
                y=scaleY*(stNodes[1].y+absY);
                ctx.lineTo(x,y);
            }
        }
        ctx.stroke();

        var groups=eyeTarget.groups;
        if(!groups){
            ctx.closePath();
            ctx.stroke();
            return;
        }
        ctx.strokeStyle="#333333";
        num=groups.length;
        ctx.beginPath();
        for(var i=0;i<num;i++){
            drawPath(ctx,groups[i].path,scaleX,scaleY);
        }
        ctx.closePath();
        ctx.stroke();
        // console.log("render耗时:",new Date().getTime()-t);
    }

    function findLinkNodeTree(link){
        var srcNode,tragetNode;
        srcNode=link.data().parent.data;
        tragetNode=link.data().data;
        return [srcNode,tragetNode];
    }

    function getImage(icon){
        var img;
        if(imgCatch[icon]){
            img= imgCatch[icon];
        }else{
            img=new Image();
            img.src=icon;
            imgCatch[icon]=img;
        }
        return  imgCatch[icon];
    }

    function findLinkNode(nodes,link){
        var num=nodes.length;
        var srcNode,tragetNode;
        for(var i=0;i<num;i++){
            var node=nodes[i];
            if(node.id===link.source.id){
                srcNode=node;
            }
            if(node.id===link.target.id){
                tragetNode=node;
            }
            if(srcNode&&tragetNode){
                break;
            }
        }
        return [srcNode,tragetNode];
    }


    function drawPath(ctx,path,scaleX,scaleY){
        var paths=path.split(" ");
        var index=0;
        var num=paths.length;
        var x,y;
        while(index<num){
            var cmd=paths[index];
            switch(cmd){
                case "M":
                    index++;
                    x=(parseFloat(paths[index])+Math.abs(offsetX))*scaleX;
                    index++;
                    y=(parseFloat(paths[index])+Math.abs(offsetY))*scaleY;
                    ctx.moveTo(x,y);
                break;
                case 'L':
                case 'H':
                case 'V':
                    index++;
                    x=(parseFloat(paths[index])+Math.abs(offsetX))*scaleX;
                    index++;
                    y=(parseFloat(paths[index])+Math.abs(offsetY))*scaleY;
                    ctx.lineTo(x,y);
                break;
                case 'C':
                case 'S':
                    index++;
                    x=(parseFloat(paths[index])+Math.abs(offsetX))*scaleX;
                    index++;
                    y=(parseFloat(paths[index])+Math.abs(offsetY))*scaleY;
                    index++;
                    var cntrlx=(parseFloat(paths[index])+Math.abs(offsetX))*scaleX;
                    index++;
                    var cntrly=(parseFloat(paths[index])+Math.abs(offsetY))*scaleY;
                    index++;
                    var cpx=(parseFloat(paths[index])+Math.abs(offsetX))*scaleX;
                    index++;
                    var cpy=(parseFloat(paths[index])+Math.abs(offsetY))*scaleY;

                    ctx.bezierCurveTo(x, y, cntrlx, cntrly, cpx, cpy);
                break;
               default:
               break;
            }
            index++;
        }

    }

    function createNodes(nodes){
        offsetX=0;
        offsetY=0;
        var nodesN=[];
        var copyKeys=["id","x","y","icon"];
        nodes.forEach(function(node){
            var copyNode={};
            copyKeys.forEach(function(key){
                copyNode[key]=node[key];
            });
            if(copyNode.x<offsetX){
                offsetX=copyNode.x;
            }
            if(copyNode.y<offsetY){
                offsetY=copyNode.y;
            }
            nodesN.push(copyNode);
        });
        if(offsetX!=0||offsetY!=0){
            offsetY-=60;//偏移碰撞半径
            offsetX-=60;
            nodesN.forEach(function(node){
                node.x+=Math.abs(offsetX);
                node.y+=Math.abs(offsetY);
            });
        }
        return nodesN;
    }


    redraw();
    drawRect(true);
}

module.exports=TopoEyeCanvas;