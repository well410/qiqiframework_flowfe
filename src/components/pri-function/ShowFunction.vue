<template>
    <!--展函数历史和函数版本里面的信息-->
    <div style="margin-top: 10px">
        <el-form ref="form1" label-width="100px" :inline="true" size="mini" class="table-expand" v-show="false">
            <el-form-item label="函数id">
                <el-input class="input-show-width" :readonly="true" v-model="func.funcId"></el-input>
            </el-form-item>

            <el-form-item label="函数名">
                <el-input class="input-show-width" :readonly="true" v-model="func.funcName"></el-input>
            </el-form-item>

            <el-form-item label="函数类型">
                <el-input class="input-show-width" :readonly="true" v-model="funcTypeEnums[func.funcType]"></el-input>
            </el-form-item>

            <el-form-item label="函数状态" v-if="isNotEmpty(funcStatusEnums[func.status])">
                <el-input class="input-show-width" :readonly="true" v-model="funcStatusEnums[func.status].name"></el-input>
            </el-form-item>

            <el-form-item label="函数版本" v-if="[tabType.funcHis, tabType.funcVersion].indexOf(pType) > -1 || pType === ''">
                <el-input class="input-show-width" :readonly="true"
                          v-model="func.funcVersion">
                </el-input>
            </el-form-item>

            <el-form-item label="创建者">
                <el-input class="input-show-width" :readonly="true" v-model="func.createUser"></el-input>
            </el-form-item>

            <el-form-item label="创建时间">
                <el-input class="input-show-width" :readonly="true" v-model="func.createTime"></el-input>
            </el-form-item>

            <el-form-item label="修改者" v-if="[tabType.funcVersion, tabType.funcHome].indexOf(pType) > -1 || pType === ''">
                <el-input class="input-show-width" :readonly="true" v-model="func.updateUser"></el-input>
            </el-form-item>

            <el-form-item label="修改时间" v-if="[tabType.funcVersion, tabType.funcHome].indexOf(pType) > -1 || pType === ''">
                <el-input class="input-show-width" :readonly="true" v-model="func.updateTime"></el-input>
            </el-form-item>
        </el-form>

        <el-form label-width="100px" size="mini" class="table-expand">
            <el-form-item label="函数源码:">
                <func-code ref="funcCode"></func-code>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {funcStatusEnums, funcTypeEnums} from "./index";
    import FuncCode from "./FuncCode";
    import {isNotEmpty} from "../../utils";
    import {tabType} from "../../views/common";

    export default {
        name: 'ShowFunction',
        components: {FuncCode},
        props: {
            pFunc: {default: undefined, type: Object},
            pType: {default: "", type: String}
        },
        data() {
          return {
              func:{},
              tabType: tabType,
              funcStatusEnums: funcStatusEnums,
              funcTypeEnums: funcTypeEnums,
              isNotEmpty: isNotEmpty
          }
        },
        mounted() {
          if (this.pFunc !== undefined) {
              this.init(this.pFunc)
          }
        },
        methods: {
            init(funcDetail){
                this.func = funcDetail;
                this.$refs.funcCode.setDrlCode(funcDetail.funcDrl);
            },


            /**
             * 输入选择格式化显示
             * @param row: 选中的行
             */
            statusFormatter: function (row) {
                if (row.functionStatus === '0')
                    return '已保存'
                else if (row.functionStatus === '1')
                    return '已调试'
                else if (row.functionStatus === '2')
                    return '已发布'
                else
                    return '未知状态'
            },
        }
    }



</script>


<style scoped>
    .show-function-row{
        margin: 10px;
    }

    .show-function-line {
        height: 1px;
        background: #475669;
        overflow: hidden;
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .show-function-title {
        font-size: large;
    }

    .show-function-info-div{
        margin-left: 20px;
    }

    .show-function-key{
        font-size: larger;
    }

    .show-function-value{
        font-size: medium;
        color: lightslategrey;
    }

    .input-show-width >>> input {
        width: 256px;
    }


</style>
