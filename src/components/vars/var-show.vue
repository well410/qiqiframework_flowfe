<template>
    <div id="VarsShow">
        <el-form ref="showForm" label-width="100px" size="mini" class=" dialog-elform show-form" :model="varData">
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="变量id: ">
                        <span>{{varData.varsId}}</span>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="数据类型: ">
                        <span>{{varData.dataType}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="描述: ">
                        <span>{{varData.desc}}</span>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="修改者: ">
                        <span>{{(varData.updateUser===undefined||varData.updateUser===null||varData.updateUser==='')?'未查询到创建者':varData.updateUser}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="修改时间: ">
                        <span>{{(varData.updateTime===undefined||varData.updateTime===null||varData.updateTime==='')?'未查询到修改时间':varData.updateTime}}</span>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="创建者: ">
                        <span>{{(varData.createUser===undefined||varData.createUser===null||varData.createUser==="")?'未查询到创建者':varData.createUser}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="创建时间: ">
                        <span>{{(varData.createTime===undefined||varData.createTime===null||varData.createTime==="")?'未查询到创建者':varData.createTime}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <template v-if="varData.queryDimensionFlg != '0' && varData.dataType == 'object'">
                <div>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="查询值：" prop="queryDimensionVal">
                                <codemirror v-model="varData.queryDimensionVal"
                                            ref="editCodeMirror"
                                            style="line-height:20px;z-index: 1"></codemirror>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </template>
        </el-form>
    </div>
</template>

<script>

    import CodemirrorShow from "../../components/codemirror/CodemirrorShow";

    export default {
        name: "VarsShow",
        props: {//父组件传入的数据
            'dialogTitle': String,
            'dialogFormVisible': Boolean,
            'varData': Object,
            'expandEntity': Object,
            'showType': String
        },
        data() {
            return {
            }
        },
        components: {CodemirrorShow},
        mounted() {
        },
        methods: {
        }
    }

</script>

<style>
    .table-expand {
        font-size: 0;
    }
    .table-expand label {
        width: 100px;
        color: #99a9bf;
    }
    .table-expand el-form-item {
        margin-right: 0;
        margin-bottom: -15px;
    }
</style>