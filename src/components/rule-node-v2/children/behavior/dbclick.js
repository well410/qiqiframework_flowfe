import {isNotEmpty} from "../../../../utils";
import Vue from "vue";
import {g6Enum} from "../../../g6-editor/entity/entity";

export default {
    getEvents() {
        return {
            'click': 'onClick',

        }
    },

    //点击打开节点配置面板
    onClick(evt){
        const {item} = evt;
        if (isNotEmpty(item)){
            Vue.prototype.$bus.$emit(g6Enum.ruleClick.code + this.graph.getContainer().id, item.getModel());
        }
    },

}