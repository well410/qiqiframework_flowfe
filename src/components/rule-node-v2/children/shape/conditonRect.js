import G6 from "@antv/g6";
import unit_rule_add from "@/assets/icons/node/unit_rule_add.svg"
import unit_rule_delete from "@/assets/icons/node/unit_rule_delete.svg"
import unit_rule_expand from "@/assets/icons/node/unit_rule_expand.svg"
import unit_rule_close from "@/assets/icons/node/unit_rule_close.svg"
var _tslib = require("tslib");
G6.registerNode(
    "condition-rect",
    {
        drawShape: function drawShape(cfg, group) {
            const width = cfg.style.width;
            const height = cfg.style.height;
            const stroke = cfg.style.stroke;
            const shapeStryle = this.getShapeStyle(cfg);
            const childrenList= cfg.children;
            const hasChildren = (childrenList==[]||childrenList==undefined)?false:true;
            const isClosed = cfg.collapsed;
            const uniqueNodeNum = (cfg.nData.uniqueNodeNum===""||cfg.nData.uniqueNodeNum===undefined)?"":cfg.nData.uniqueNodeNum;
            const showButton = (cfg.showButton===false)?cfg.showButton:true;
            const rectRtyle = Object.assign({}, this.getShapeStyle(cfg), {
                x: -width / 2,
                y: -height /2,
                // width,
                // height,
                radius: 5,
                // stroke,
                fill:'white',
                lineWidth: 1.2,
                fillOpacity: 1
            });
            const rect = group.addShape("rect", {
                attrs:  rectRtyle,
                name: "rect-shape"
            });
            //展示节点类型
            group.addShape("rect", {
                attrs:  {
                    x: -width / 2+0.6,
                    y: -height /2+0.6,
                    width:28,
                    height:14,
                    radius: [5,0,5,0],
                    fill:"#b7d1ea",
                    fillOpacity: 1
                },
                name: "title-bg"
            });
            group.addShape('text', {
                attrs: {
                    x: -width / 2+4,
                    y: -height /2+12,
                    text: '条件',
                    fill: 'blue',
                    fontWeight: 400,
                    fontSize: 8
                },
                // must be assigned in G6 3.3 and later versions. it can be any value you wantPath
                name: 'text-shape',
            });
            //展示节点编号
            group.addShape("rect", {
                attrs:  {
                    x: width / 2-46,
                    y: -height /2+0.6,
                    width:45,
                    height:14,
                    radius: [0,5,0,5],
                    fill:"#b7d1ea",
                    fillOpacity: 1
                },
                name: "title-bg"
            });
            group.addShape('text', {
                attrs: {
                    x: width / 2-43,
                    y: -height /2+12,
                    text: uniqueNodeNum,
                    fill: 'blue',
                    fontWeight: 400,
                    fontSize: 8
                },
                // must be assigned in G6 3.3 and later versions. it can be any value you wantPath
                name: 'text-shape',
            });
            if(showButton){
                group.addShape("image", {
                    attrs: {//x,y,width,height
                        x: -width/4,
                        y: height/2,
                        width: 22,
                        height: 22,
                        show:true,
                        img: unit_rule_add,
                    },
                    name: "unit_rule_add"
                });
                group.addShape("image", {
                    attrs: {//x,y,width,height
                        x: width/4-22,
                        y: height/2,
                        width: 22,
                        height: 22,
                        show:true,
                        img: unit_rule_delete,
                    },
                    name: "unit_rule_delete"
                });
            }
            if(hasChildren){
                if(isClosed){
                    group.addShape("circle", {
                        attrs: {
                            x: 0,
                            y: height / 2,
                            r: 9,
                            fill: "#fff"
                        },
                        name: "circle-shape"
                    });
                    group.addShape("image", {
                        attrs: {
                            x: -14,
                            y: height / 2-14,
                            width: 28,
                            height: 28,
                            show:true,
                            img:unit_rule_expand,
                            cursor: 'pointer'
                        },
                        name: "unit_rule_expand"
                    });
                }else if(!isClosed){
                    group.addShape("circle", {
                        attrs: {
                            x: 0,
                            y: height / 2,
                            r: 9,
                            fill: "#fff"
                        },
                        name: "circle-shape"
                    });

                    group.addShape("image", {
                        attrs: {
                            x: -14,
                            y: height / 2-14,
                            width: 28,
                            height: 28,
                            show:true,
                            img:unit_rule_close,
                            cursor: 'pointer'
                        },
                        name: "unit_rule_close"
                    });
                }
            }


            return rect;
        },
        getAnchorPoints: function getAnchorPoints() {
            return [
                [0.5, 0],
                [0.5, 0],
                [0.5, 1]
            ];
        },
    },
    "single-node"
);

export {}