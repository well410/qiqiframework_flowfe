import G6 from "@antv/g6";

G6.registerEdge('flow-line', {
    draw(cfg, group) {
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;

        const { style } = cfg;
        const shape = group.addShape('path', {
            attrs: {
                stroke: style.stroke,
                endArrow: style.endArrow,
                path: [
                    ['M', startPoint.x, startPoint.y],
                    ['L', startPoint.x, (startPoint.y + endPoint.y) / 2],
                    ['L', endPoint.x, (startPoint.y + endPoint.y) / 2],
                    ['L', endPoint.x, endPoint.y],
                ],
            },
        });

        // group.addShape("rect", {
        //     attrs: {
        //         x: (startPoint.x===endPoint.x)?startPoint.x:startPoint.x+(endPoint.x-startPoint.x)-4,
        //         y: (startPoint.y + endPoint.y) / 2-7,
        //         width:28,
        //         height:14,
        //         fill:"#b7d1ea",
        //         fillOpacity: 1
        //     },
        //     name: "text-shape-date"
        // });
        group.addShape("text", {
            attrs: {
                text: cfg.targetNode._cfg.model.nData.parentResult,
                x: (startPoint.x===endPoint.x)?startPoint.x:startPoint.x+(endPoint.x-startPoint.x),
                y: (startPoint.y + endPoint.y) / 2,
                fontSize: 10,
                fontWeight: 400,
                textAlign: "left",
                textBaseline: "middle",
                fill: "#000000D9",
            },
            name: "text-shape-date"
        });

        return shape;
    },
});
export {}
