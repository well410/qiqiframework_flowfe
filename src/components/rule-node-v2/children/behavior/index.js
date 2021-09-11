import * as G6 from "@antv/g6";
import unitRuleAddlick from './unit-rule-add-click'
import unitRuleDeleteClick from './unit-rule-delete-click'
import ruleClick from './dbclick'
// import collapseExpand from './collapse-expand'

export function initBehaviors() {
    const behaviors = new Map();
    behaviors.set('unit-rule-add-click', unitRuleAddlick);
    behaviors.set('rule-click', ruleClick);
    behaviors.set('unit-rule-delete-click', unitRuleDeleteClick);
    // behaviors.set('collapse-expand', collapseExpand);
    Array.from(behaviors.keys()).forEach(key=>{
        G6.registerBehavior(key, behaviors.get(key))
    })
}
