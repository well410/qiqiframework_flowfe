import G6 from "@antv/g6";
import unit_rule_add from "@/assets/icons/node/unit_rule_add.svg"
import unit_rule_delete from "@/assets/icons/node/unit_rule_delete.svg"
import unit_rule_expand from "@/assets/icons/node/unit_rule_expand.svg"
import unit_rule_close from "@/assets/icons/node/unit_rule_close.svg"
var _tslib = require("tslib");
G6.registerNode(
    "root-rect",
    {
        drawShape: function drawShape(cfg, group) {
            const width = cfg.style.width;
            const height = cfg.style.height;
            const stroke = cfg.style.stroke;
            const shapeStryle = this.getShapeStyle(cfg);
            const childrenList= cfg.children;
            const hasChildren = (childrenList==[]||childrenList==undefined)?false:true;
            const isClosed = cfg.collapsed;
            const showButton = (cfg.showButton===false)?cfg.showButton:true;
            const rectRtyle = Object.assign({}, this.getShapeStyle(cfg), {
                x: -width / 2,
                y: -height /2,
                // width,
                // height,
                radius: 5,
                // stroke,
                lineWidth: 1.2,
                fillOpacity: 1,
                fill: "white"
            });
            const rect = group.addShape("rect", {
                attrs:  rectRtyle,
                name: "rect-shape"
            });
            // group.addShape("circle", {
            //     attrs: {
            //         x: 0,
            //         y: -height / 2,
            //         r: 3,
            //         fill: stroke
            //     },
            //     name: "circle-shape"
            // });
            // group.addShape("circle", {
            //     attrs: {
            //         x: 0,
            //         y: height / 2,
            //         r: 0,//隐藏
            //         fill: stroke
            //     },
            //     name: "circle-shape2"
            // });
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