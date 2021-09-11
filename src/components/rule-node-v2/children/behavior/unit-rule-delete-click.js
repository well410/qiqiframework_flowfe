// import {g6Enum} from "../entity/entity";
import Vue from 'vue'
import {getArrayIndex} from "../../../../utils";
import eventBus from "@/utils/eventBus";

export default {
    getEvents() {
        return {
            'unit_rule_delete:click': 'onClick',

        }
    },

    onClick(evt){
        const {item} = evt;
        const model = item.getModel();
        let that = this;
        if(model.type=== 'root-rect'){
            Vue.prototype.$message({message: `根节点不允许删除`, type: 'warning'});
            return;
        }
        Vue.prototype.$confirm('确定要删除该节点吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
        }).then(({value}) => {
            const model = item.getModel();
            var uniqueNum = model.nData.uniqueNodeNum;
            var index = getArrayIndex(that.graph.cfg.data.nData.uniqueIdList,uniqueNum);
            that.graph.removeChild(model.id);
            that.graph.cfg.data.nData.uniqueIdList.splice(index,1);
            if(model.type=== 'result-rect'){
                eventBus.$emit("deleteRusultNode", uniqueNum);
            }
        }).catch(() => {});

        // item && Vue.prototype.$bus.$emit(g6Enum.IClick.code + this.graph.getContainer().id, item.getModel());
    }


}
