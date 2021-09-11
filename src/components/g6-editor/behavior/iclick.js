import {g6Enum} from "../entity/entity";
import Vue from 'vue'
import {isNotEmpty} from "../../../utils";

export default {
    getEvents() {
        return {
            'node:click': 'onNodeClick',
            'edge:click': 'onEdgeClick',
            'combo:click': 'onComboClick',
        }
    },

    onNodeClick(evt){
        const {item} = evt;
        if (isNotEmpty(item)){
            Vue.prototype.$bus.$emit(g6Enum.IClick.code + this.graph.getContainer().id, item);
        }
    },

    onEdgeClick(evt){
        const {item} = evt;
        if (isNotEmpty(item)){
            Vue.prototype.$bus.$emit(g6Enum.IClick.code + this.graph.getContainer().id, item);
        }
    },

    onComboClick(evt){
        const {item} = evt;
        if (isNotEmpty(item)){
            Vue.prototype.$bus.$emit(g6Enum.IClick.code + this.graph.getContainer().id, item);
        }
    },


}
