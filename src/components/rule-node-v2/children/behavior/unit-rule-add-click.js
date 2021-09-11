// import {g6Enum} from "../entity/entity";
import Vue from 'vue'
import unit_rule_add from "@/assets/icons/node/unit_rule_add.svg"
import unit_rule_delete from "@/assets/icons/node/unit_rule_delete.svg"
import unit_rule_expand from "@/assets/icons/node/unit_rule_expand.svg"
import unit_rule_close from "@/assets/icons/node/unit_rule_close.svg"
import {getUUID} from "../../../index";
import {getUnitRuleNodeNum} from "../index";
import {getConditionRes} from "../../../rule-node";

export default {
    getEvents() {
        return {
            'unit_rule_add:click': 'onClick',

        }
    },

    onClick(evt){
        const {item} = evt;

        const model = item.getModel();
        const conta1 =item.getContainer();

        if (!model.children) {
            model.children = [];
        }
        if(model.type!== 'root-rect'&& model.children.length>=2){
            Vue.prototype.$message({message: `目前条件节点仅支持两个子节点,处理节点为true和false两种情况`, type: 'warning'});
            return;
        }
        const id = getUUID();
        let that = this;
        var UniqurIdList = that.graph.cfg.data.nData.uniqueIdList===undefined?that.graph.cfg.data.nData.uniqueIdList=[]:that.graph.cfg.data.nData.uniqueIdList;
        var uniqueNodeNum = getUnitRuleNodeNum("UR_CN", UniqurIdList);
        that.graph.cfg.data.nData.uniqueIdList.push(uniqueNodeNum);
        model.children.push({
            id,
            label: "",
            value: "",
            collapsed:false,
            type:'condition-rect',
            nData:{
                conResult:getConditionRes(),
                uniqueNodeNum,
                parentResult:"            "
            },
        });
        this.graph.updateChild(model,model.id);
        if (model.children.length > 0){
            item._cfg.group.addShape("circle", {
                attrs: {
                    x: 0,
                    y: 50 / 2,
                    r: 9,
                    fill: "#fff"
                },
                name: "circle-shape"
            });
            item._cfg.group.addShape("image", {
                attrs: {
                    x: -14,
                    y: 50 / 2-14,
                    width: 28,
                    height: 28,
                    show:true,
                    img:unit_rule_close
                },
                name: "unit_rule_close"
            });
        }

    }


}
