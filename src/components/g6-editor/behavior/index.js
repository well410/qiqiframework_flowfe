import * as G6 from "@antv/g6";
import clickAddEdge from './click-add-edge'
import dblClick from './dblclick'
import iClick from './iclick'
import tooltipEvent from './tooltip-event'
import brushSelect from './brush-select'
import collapseExpandCombo from './collapse-expand-combo'

export function initBehaviors() {
    const behaviors = new Map();
    behaviors.set('click-add-edge', clickAddEdge);
    behaviors.set('dblclick', dblClick);
    behaviors.set('iclick', iClick);
    behaviors.set('tooltipEvent', tooltipEvent);
    behaviors.set('brush-select-1', brushSelect);
    behaviors.set('collapse-expand-combo-1', collapseExpandCombo);
    Array.from(behaviors.keys()).forEach(key=>{
        G6.registerBehavior(key, behaviors.get(key))
    })
}
