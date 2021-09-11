<template>
    <div style="margin-top: 10px">
        <div class="show-function-line"></div>
        <a class="show-function-title">函数版本基本信息</a>
        <div class="show-function-line"></div>
        <div class="show-function-info-div">
            <el-row :gutter="20" class="show-function-row">
                <el-col :span="12">
                    <el-col :span="6"><label class="show-function-key">函数ID：</label></el-col>
                    <el-col :span="18"><label class="show-function-value">{{functionData.functionId}}</label>
                    </el-col>
                </el-col>
                <el-col :span="12" class="el-col-right">
                    <el-col :span="6"><label class="show-function-key">函数命名：</label></el-col>
                    <el-col :span="18"><label class="show-function-value">{{functionData.functionName}}</label>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="show-function-row">
                <el-col :span="12">
                    <el-col :span="6"><label class="show-function-key">版本状态：</label></el-col>
                    <el-col :span="18"><label class="show-function-value">{{statusFormatter(functionData)}}</label>
                    </el-col>
                </el-col>
                <el-col :span="12" class="el-col-right">
                    <el-col :span="6"><label class="show-function-key">函数输出类型：</label></el-col>
                    <el-col :span="18"><label class="show-function-value">{{functionData.functionReturnType}}</label>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="show-function-row">
                <el-col :span="12" class="el-col-right">
                    <el-col :span="6"><label class="show-function-key">入参列表：</label></el-col>
                    <el-col :span="18"><label
                            class="show-function-value">{{functionData.funcParamType}}</label></el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="show-function-row">
                <el-col :span="12" class="el-col-right">
                    <el-col :span="6"><label class="show-function-key">描述：</label></el-col>
                    <el-col :span="18"><label
                            class="show-function-value">{{functionData.funcDesc}}</label></el-col>
                </el-col>
                <el-col :span="12" class="el-col-right"></el-col>
            </el-row>
        </div>

        <div class="show-function-line"></div>
        <a class="show-function-title">函数：</a>
        <div class="show-function-line"></div>
        <div>
            <el-input type="textarea" autosize placeholder="函数体" v-model="functionData.funcDrl" :disabled="true"></el-input>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'ShowFunctionVersion',

        props: {
            'func': Object
        },
        methods: {
            /**
             * 输入选择格式化显示
             * @param row: 选中的行
             */
            statusFormatter: function (row) {
                if (row.functionStatus === '0')
                    return '已停用'
                else if (row.functionStatus === '1')
                    return '已上线'
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


</style>
