<template>
    <!--节点的边-->
    <div id="editLine">
        <el-form size="mini" label-width="100px">
            <el-form-item label="连线id">
                <el-input disabled v-model="item.id"></el-input>
            </el-form-item>
            <el-form-item label="源节点id">
                <el-input disabled v-model="item.source"></el-input>
            </el-form-item>
            <el-form-item label="目标节点id">
                <el-input disabled v-model="item.target"></el-input>
            </el-form-item>
            <el-form-item label="源节点结果">
                <el-select :disabled="disabled"
                           clearable
                           multiple
                           v-model="item.eData.logicIdList" @change="lineChange">
                    <el-option v-for="unitResult in unitResultList"
                               :value="unitResult.logicId"
                               :key="unitResult.logicId"
                               :label="`[${[unitResult.logicId, unitResult.resultValue].join('-')}] ${unitResult.resultDesc}`">
                        <span :title="[unitResult.logicId, unitResult.resultValue].join('-')" class="option-left" >{{[unitResult.logicId, unitResult.resultValue].join('-')}}</span>
                        <span :title="unitResult.resultDesc" class="option-right">{{unitResult.resultDesc}}</span>
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

    import {isEmpty, isNotContainEmpty, isNotEmpty} from "../../utils";
    import {G6Editor} from "../g6-editor/entity/entity";
    import {G6Model} from "../../entity/g6Model";

    export default {
        name: "editLine",
        props: {
            item: Object,
            decisionTree: Object,
            g6Editor: G6Editor,
            disabled: {default: false, type: Boolean}
        },
        data() {
            return {

            }
        },
        computed:{
            unitResultList(){
                let that = this;
                let parentNodeList = that.decisionTree.nodes
                    .map(item=>G6Model.g6Node2OtherNode(item))
                    .filter(node=>node.getUniqueId() === that.item.source);
                let result = [];
                if (isNotEmpty(parentNodeList[0].nData.uResultList)) {
                    parentNodeList[0].nData.uResultList.forEach(uResult => {
                        let isNotEmptyValue = isNotContainEmpty([uResult.logicId, uResult.resultValue]);
                        if(isNotEmptyValue&&(isNotEmpty(uResult.logic)||isNotEmpty(parentNodeList[0].nData.ugvResultList))) {
                            if (isEmpty(uResult.resultDesc)) uResult.resultDesc = '';
                            result.push(uResult);
                        }
                    });
                }
                // else if(isNotEmpty(parentNodeList[0].nData.ugvResultList)){
                //     var ugvResultListArr = UgvResult.json2Arr(parentNodeList[0].nData.ugvResultList);
                //     ugvResultListArr.forEach (item=>{
                //         var resultNo =  item.split(":")[0];
                //         resultNo=resultNo.substring(1,resultNo.length-1);
                //         var resultValue =  item.split(":")[1];
                //         resultValue=resultValue.substring(1,resultValue.length-1);
                //         var uResult=[];
                //         uResult.logicId=resultNo;
                //         uResult.resultValue=resultValue;
                //         uResult.resultDesc="";
                //         result.push(uResult);
                //     });
                // }
                return result;
            }
        },


        methods:{

            init(){

            },

            lineChange(logicIdList) {
                let filterList = this.unitResultList.filter(item=>logicIdList.includes(item.logicId));
                if (isNotEmpty(filterList)){
                    this.item.label = filterList.map(item=>`[${item.resultValue}]`).join(" 或 ");
                } else {
                    this.item.label = "";
                }
                this.g6Editor.graph.refresh();
            },
        }
    }
</script>

<style scoped>
#editLine{
    width: 100%;
    height: 100%;
    margin-top: 15px;
    padding-left: 20px;
    padding-right: 20px;
}
</style>
