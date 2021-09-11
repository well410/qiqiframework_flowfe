import {g6Enum} from "../entity/entity";
import Vue from 'vue'


export default {
    /**
     * @see G6Event
     */
    getEvents() {
        return {
            "node:mouseenter" : "onMouseenter",
            "node:mouseleave": "onMouseleave",
            "canvas:mouseleave" : "onMouseleave",
        }
    },

    onMouseenter(evt){
        Vue.prototype.$bus.$emit(g6Enum.ON_MOUSE_ENTER.code + this.graph.getContainer().id, evt);
    },

    onMouseleave(evt){
        Vue.prototype.$bus.$emit(g6Enum.ON_MOUSE_LEAVE.code + this.graph.getContainer().id, evt);
    }


}
