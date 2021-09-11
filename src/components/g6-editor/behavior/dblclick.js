import {g6Enum} from "../entity/entity";
import Vue from 'vue'

export default {
    getEvents() {
        return {
            'dblclick': 'onDBLClick',
        }
    },

    onDBLClick(evt){
        const {item} = evt;
        item && Vue.prototype.$bus.$emit(g6Enum.DBL_Click.code + this.graph.getContainer().id, item.getModel());
    }


}
