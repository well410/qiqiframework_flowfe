<template>
    <!--预处理的Java代码-->
    <div id="decsPreHandleJava">
        <el-form @submit.native.prevent :inline="true" size="mini">
            <el-form-item>
                <el-button @click="testClickBefore" type="primary">测试</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="saveClick" type="success">保存</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="initClick" type="error">初始化</el-button>
            </el-form-item>
        </el-form>

        <el-dialog
                title="预处理函数测试"
                :close-on-click-modal="false"
                :visible.sync="debugDialog.isShow">
            <div id="preTest">
                <codemirror v-model="debugDialog.inputExample"
                            :key="key"
                            :options="cmOptions"
                            style="line-height:20px;z-index: 10000"></codemirror>
            </div>

            <div id="debugEle" style="margin-top: 15px"  v-if="isNotEmpty(debugDialog.debugResult)">
                <span>测试结果：</span>
                <codemirror v-model="debugDialog.debugResult"
                            :key="key"
                            :options="cmOptions"
                            style="line-height:20px;z-index: 10000;"></codemirror>
            </div>

            <div v-if="isNotEmpty(computeEnableAddReturn)">
                <span>解析后可以新增的结果：</span>
                <el-table
                        :data="computeEnableAddReturn"
                        tooltip-effect="dark"
                        stripe
                        border
                        max-height="400px"
                        size="mini"
                        style="width: 100%;margin-top: 5px">
                    <el-table-column prop="varFrom" label="处理结果前缀"></el-table-column>
                    <el-table-column prop="varName" label="处理结果字段名"></el-table-column>
                    <el-table-column prop="varType" label="处理结果字段类型"></el-table-column>
                    <el-table-column align="center" label="操作" width="80x">
                        <template slot-scope="scope">
                            <el-button style="color: #0048ff" type="primary" class="icon-button" icon="el-icon-plus" size="mini" @click="addPreHandleReturnList(scope['row'])" title="添加"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <template slot="footer">
                <el-button type="" size="mini" @click="debugDialog.isShow = false">取消</el-button>
                <el-button type="primary" size="mini" :disabled="computeDisableParse" @click="parseDebugResult">解析</el-button>
                <el-button type="primary" size="mini" @click="testClickAfter" :loading="testIsLoading">确定</el-button>
            </template>
        </el-dialog>

        <div id="code">
            <codemirror v-model="pDecs.preHandleJava"
                        :key="key"
                        :options="cmOptions"
                        style="line-height:20px;z-index: 10000"></codemirror>
        </div>


        <div id="debugResult" style="margin-top: 15px">
            <span>预处理结果：</span>
            <!--<el-button @click="setPreVarList" size="mini" type="primary">抽取结果</el-button>-->
            <el-table
                    :data="pDecs.preHandleReturnList"
                    tooltip-effect="dark"
                    stripe
                    border
                    max-height="400px"
                    size="mini"
                    style="width: 100%;margin-top: 5px">
                <el-table-column prop="varFrom" label="处理结果前缀"></el-table-column>
                <el-table-column prop="varName" label="处理结果字段名"></el-table-column>
                <el-table-column prop="varType" label="处理结果字段类型">
                    <template slot-scope="props">
                        <el-select v-model="props.row.varType" placeholder="请配置字段类型"
                                   clearable
                                   filterable
                                   style="width: 80%"
                                   size="mini">
                            <el-option label="String" value="String" key="String"></el-option>
                            <el-option label="Integer" value="Integer" key="Integer"></el-option>
                            <el-option label="Double" value="Double" key="Double"></el-option>
                            <el-option label="Timestamp" value="Timestamp" key="Timestamp"></el-option>
                            <el-option label="object" value="object" key="object"></el-option>
                            <el-option label="array" value="array" key="array"></el-option>
                            <el-option label="boolean" value="boolean" key="boolean"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="varDecs" label="处理结果字段描述">
                    <template slot-scope="props">
                        <el-input size="mini" style="width: 80%" v-model="props.row.varDesc"></el-input>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="80x">
                    <template slot-scope="scope">
                        <el-button type="primary" class="icon-button" icon="el-icon-delete" size="mini" @click="deletePreHandleReturnList(scope['row'])" title="删除"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>


    </div>
</template>

<script>
    import "codemirror/lib/codemirror.css";
    import "codemirror/addon/hint/show-hint.css";
    import "codemirror/theme/idea.css"
    import "codemirror/mode/javascript/javascript"
    import "codemirror/addon/edit/matchbrackets"
    import "codemirror/addon/selection/active-line"
    import "codemirror/mode/clike/clike.js"
    import {getUUID} from "../../../../components";
    import {DecsBase} from "../../../../entity/decs";
    import {isEmpty, toClassName} from "../../../../utils";
    import {testPreHandleJava, updateDecs} from "../../../../api/Decs";
    import {DecsUpdateDto} from "../../index";
    import {PreVar} from "../../../../entity/vars";
    import {dataTypeEnums, tabType, varTypeEnums} from "../../../../entity/enumns";

    export default {
        name: "DecsPreHandleJava",
        props: {
            pDecs: {
                default: () => {
                }, type: DecsBase
            }
        },
        data() {
            return {
                debugDialog : {isShow: false, inputExample: "", debugResult :"", preHandleReturnList :[]},
                key: getUUID(),
                testIsLoading : false,
                cmOptions: {
                    //使用的语言
                    mode: 'text/x-java',
                    theme: 'idea',
                    lineWrapping: true,
                    foldGutter: true,
                    //语法报错
                    lint: true,
                    showCursorWhenSelecting: true,
                    autofocus: false,
                    line: true,
                    readOnly: false,
                    indentWithTabs: true,
                    smartIndent: true,
                    //显示行号
                    lineNumbers: true,
                    //括号匹配
                    matchBrackets: true,
                }
            }
        },

        computed:{
            computeDisableParse(){
                return isEmpty(this.debugDialog.debugResult);
            },

            computeEnableAddReturn() {
                let preNameList = this.pDecs.preHandleReturnList.map(item => item.varName);
                return this.debugDialog.preHandleReturnList.filter(item => {
                    return !preNameList.includes(item.varName)
                });
            }
        },


        methods: {
            addPreHandleReturnList(row){
                this.pDecs.preHandleReturnList.push(row);
            },

            deletePreHandleReturnList(row){
                this.pDecs.preHandleReturnList = this.pDecs.preHandleReturnList.filter(item=>item.uuid !== row.uuid);
            },

            parseDebugResult(){
                const that = this;
                let debugResultJSON = null;
                try {
                    debugResultJSON = JSON.parse(that.debugDialog.debugResult);
                    that.debugDialog.preHandleReturnList = Object.keys(debugResultJSON).map(key=>new PreVar({varName: key.substring(varTypeEnums.pre.code.length + 1)}));
                    // 解析数据类型
                    if (!isEmpty(that.debugDialog.preHandleReturnList)) {
                        that.debugDialog.preHandleReturnList.forEach(item => {
                            let value = debugResultJSON[item.getPrefixVarName()];
                            // see https://www.cnblogs.com/zhanghaiyu-Jade/p/13578953.html
                            let type = Object.prototype.toString.call(value);
                            switch (type) {
                                case "[object String]":
                                    item.varType = dataTypeEnums.STRING.code;
                                    break;
                                case "[object Boolean]":
                                    item.varType = dataTypeEnums.BOOLEAN.code;
                                    break;
                                case "[object Number]":
                                    if ((value + "").includes(".")){
                                        item.varType = dataTypeEnums.DOUBLE.code;
                                    } else {
                                        item.varType = dataTypeEnums.INTEGER.code;
                                    }
                                    break;
                                case "[object Object]":
                                    item.varType = dataTypeEnums.OBJECT.code;
                                    break;
                                case "[object Array]":
                                    item.varType = dataTypeEnums.ARRAY.code;
                                    break;
                            }
                        })
                    }

                } catch (e) {
                    that.$message({type: 'info', message: `预处理结果解析失败：${e}`});
                }
            },

            // 初始化代码
            initClick(){
                this.$confirm('初始化会清空你的代码！！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    this.initPreHandleJava();
                });
            },

            // 测试之前
            testClickBefore() {
                let that = this;
                this.$confirm('测试前会先保存', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    that.saveClick();
                    this.debugDialog.isShow = true;
                }).catch(() => {});
            },

            // 测试之后
            testClickAfter(){
                let req = JSON.parse(this.debugDialog.inputExample);

                this.testIsLoading = true;
                testPreHandleJava({
                    prodId: this.pDecs.prodId,
                    decsId: this.pDecs.decsId,
                    req: req
                }).then(res => {
                    if (res.data.data.success){
                        this.debugDialog.debugResult = JSON.stringify(JSON.parse(res.data.data.result), null, 4);
                        this.$message({type:'info', message:'测试结果返回'});
                    } else {
                        this.$message({type:'warning', message:'测试异常'});
                        this.debugDialog.debugResult = res.data.data.result;
                    }
                }).finally(()=>{
                    this.testIsLoading = false;
                })
            },

            // 保存预处理代码
            saveClick() {
                let that = this;
                let decsUpdateDto = new DecsUpdateDto();
                decsUpdateDto.decsBase = that.pDecs;
                updateDecs({
                    prodId: this.pDecs.prodId,
                    decsId: this.pDecs.decsId,
                    decsUpdateDto:decsUpdateDto
                }).then(res=>{
                    this.$message({message: "保存成功", type: "success"});
                    Object.assign(that.pDecs, res.data.data);
                })
            },

            // 初始化代码
            initPreHandleJava(){
                let className = toClassName(this.pDecs.decsId) + "PreHandle";

                this.pDecs.preHandleJava = `package com.cmbchina.preHandleJava.func;
import com.cmbchina.ns.tcs.common.func.PreHandleFunService;
import java.util.*;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.JSONPath;


public class ${className} implements  PreHandleFunService{
    /**
     * 本函数的结构不要进行修改
     * @param req : 传入的报文
     * @return : 返回的变量，传给fact对象使用
     */
    @Override
    public Map<String, Object> exec(JSONObject req) {
        Map<String, Object> result = new HashMap<>();
        //===================编写你的代码逻辑==============================


        return result;
    }
}`;
            },

            init() {
                this.key = getUUID();
                this.debugDialog.inputExample = JSON.parse(JSON.stringify(this.pDecs)).inputExample;
                if (isEmpty(this.pDecs.preHandleJava)) {
                    this.initPreHandleJava();
                }
            },
        }
    }
</script>

<style scoped>
    #preTest >>> .CodeMirror {
        height: 400px;
        /*margin-left: 20px;*/
        /*margin-right: 20px;*/
    }

    #code >>> .CodeMirror {
        height: 500px;
        /*margin-left: 20px;*/
        /*margin-right: 20px;*/
    }
</style>
