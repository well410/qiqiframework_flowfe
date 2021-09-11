import G6 from "@antv/g6";
const colorMap = {
    A: "#72CC4A",
    B: "#1A91FF",
    C: "#FFAA15"
};

G6.registerEdge("polyline", {
    itemType: "edge",
    draw: function draw(cfg, group) {
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;

        const Xdiff = endPoint.x - startPoint.x;

        const slope = Xdiff !== 0 ? 2000 / Math.abs(Xdiff) : 0;

        const cpOffset = 16;
        const offset = Xdiff < 0 ? cpOffset : -cpOffset;

        const line1EndPoint = {
            x: endPoint.x + offset,
            y: startPoint.y + slope,
        };
        const line2StartPoint = {
            x: endPoint.x,
            y: line1EndPoint.y + cpOffset
        };

        // 控制点坐标
        const controlPoint = {
            x:endPoint.x,
            y: ((line1EndPoint.y - startPoint.y) * (endPoint.x - startPoint.x)) /
                (line1EndPoint.x - startPoint.x) +
                startPoint.y
        };

        let path = [
            ["M", startPoint.x, startPoint.y],
            ["L", line1EndPoint.x, line1EndPoint.y],
            [
                "Q",
                controlPoint.x,
                controlPoint.y,
                line2StartPoint.x,
                line2StartPoint.y
            ],
            ["L", endPoint.x, endPoint.y]
        ];

        if (Xdiff === 0) {
            path = [
                ["M", startPoint.x, startPoint.y],
                ["L", endPoint.x, endPoint.y]
            ];
        }

        const line = group.addShape("path", {
            attrs: {
                path,
                // stroke: colorMap[cfg.data && cfg.data.type],
                stroke: cfg.style.stroke,
                lineWidth: 1.2,
                endArrow: cfg.style.endArrow,
                // endArrow: true
            },
            name: "path-shape"
        });

        const labelLeftOffset = 2;
        const labelTopOffset = 8;
        // amount
        // const amount = group.addShape("text", {
        //     attrs: {
        //         text: cfg.data && cfg.data.amount,
        //         x: line2StartPoint.x + labelLeftOffset,
        //         y: endPoint.y - labelTopOffset - 2,
        //         fontSize: 14,
        //         textAlign: "left",
        //         textBaseline: "middle",
        //         fill: "#000000D9"
        //     },
        //     name: "text-shape-amount"
        // });
        // // type
        // group.addShape("text", {
        //     attrs: {
        //         text: cfg.data && cfg.data.type,
        //         x: line2StartPoint.x + labelLeftOffset,
        //         y: endPoint.y - labelTopOffset - amount.getBBox().height - 2,
        //         fontSize: 10,
        //         textAlign: "left",
        //         textBaseline: "middle",
        //         fill: "#000000D9"
        //     },
        //     name: "text-shape-type"
        // });
        // // date
        // group.addShape("text", {
        //     attrs: {
        //         text: cfg.data && cfg.data.date,
        //         x: line2StartPoint.x + labelLeftOffset,
        //         y: endPoint.y - labelTopOffset - amount.getBBox().height - amount.getBBox().height- 2,
        //         fontSize: 12,
        //         fontWeight: 300,
        //         textAlign: "left",
        //         textBaseline: "middle",
        //         fill: "#000000D9"
        //     },
        //     name: "text-shape-date"
        // });
        return line;
    }
});
export {}