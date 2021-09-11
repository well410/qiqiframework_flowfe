<template>
    <div id="data-process-edit">
        <node-inf :node="node" :disabled="disabled">
            <template slot="right">
                <el-divider direction="vertical"></el-divider>
                <el-dropdown trigger="click"  @command="handleCommand">
                    <el-button :disabled="disabled" type="primary" size="mini">
                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item  command="addFuncBefore">添加函数</el-dropdown-item>
                        <el-dropdown-item  command="addAviatorScriptBefore">添加表达式</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </template>
        </node-inf>


        <el-table
                id="conditionTable"
                :data="dpVarList"
                tooltip-effect="dark"
                stripe
                border
                max-height="266px"
                row-key="cdId"
                size="mini"
                style="width: 100%">
            <el-table-column prop="varName" label="变量名">
                <template slot-scope="prop">{{prop.row.getPrefixVarName()}}</template>
            </el-table-column>
            <el-table-column prop="varType" label="变量类型"></el-table-column>
            <el-table-column prop="varDesc" label="变量描述"></el-table-column>
            <el-table-column prop="opt" label="处理类型">
                <template slot-scope="prop">{{prop.row.getProcessType()}}</template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150px">
                <template slot-scope="scope">
                    <el-button :disabled="disabled" type="primary" class="icon-button" icon="el-icon-edit" size="mini"
                               @click="editDataProcessVarBefore(scope['row'])" title="编辑">
                    </el-button>
                    <el-button :disabled="disabled" type="danger" class="icon-button" icon="el-icon-delete" size="mini"
                               @click="deleteDataProcessVarClick(scope['row'])" title="删除">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--函数添加或编辑 append-to-body 直接加载body层级下，防止样式污染，并且不会因弹框在某个节点下面，位置错乱-->
        <el-dialog :visible.sync="funcEdit.dialog"
                   :modal="false"
                   title="函数编辑"
                   :close-on-click-modal="false"
                   :append-to-body="true"
                   class="new-dialog">
            <func-opt ref="funcOpt" rel="funcOpt" :p-data-process-var="funcEdit.dataProcessVar" :p-decision-tree="decisionTree" :p-fun-ref-var-list="relVarList"></func-opt>
            <template slot="footer">
                <el-button type="" size="mini" @click="funcEdit.dialog = false">取消</el-button>
                <el-button type="primary" size="mini" @click="saveFuncAfter">确定</el-button>
            </template>
        </el-dialog>

        <!--脚本语言添加或编辑-->
        <el-dialog :visible.sync="aviatorScriptEdit.dialog"
                   :modal="false"
                   title="表达式编辑"
                   :close-on-click-modal="false" class="new-dialog">
            <aviator-script-codemirror :p-as-var="aviatorScriptEdit.dataProcessVar"
                                       :p-var-list="relVarList"
                                       ref="aviatorScriptCodemirror"></aviator-script-codemirror>
            <template slot="footer">
                <el-button type="" size="mini" @click="aviatorScriptEdit.dialog = false">取消</el-button>
                <el-button type="primary" size="mini" @click="saveAviatorAfter">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import NodeInf from "../common/node-inf";
    import {G6Model} from "../../entity/g6Model";
    import resizeForDrawer from "../mixins/resizeForDrawer";
    import FuncOpt from "./func-opt";
    import {DataProcessVar} from "../../entity/vars";
    import {isEmpty} from "../../utils";
    import AviatorScriptCodemirror from "../aviator-script-codemirror/aviator-script-codemirror";

    /**
     * 数据处理节点编辑
     * @see DataProcessNode
     */
    export default {
        name: "DataProcessEdit",
        components: {AviatorScriptCodemirror, FuncOpt, NodeInf},
        mixins: [resizeForDrawer],
        props: {
            decisionTree: Object,
            node: {default: () => {}, type: Object},
            aviatorScriptInputVarList: {default: () => [], type: Array},
            disabled: {default: false, type: Boolean},
            dataProcessInputVarList: {default: () => [], type: Array}
        },

        data(){
            return {
                // 节点数据
                dpVarList: [],

                relVar: {totalVarList: [], dataProcessInputVarList: [],},
                funcEdit: {dialog: false, dataProcessVar: new DataProcessVar()},
                aviatorScriptEdit: {dialog: false, dataProcessVar: new DataProcessVar()}
            }
        },

        computed:{
            relVarList(){
                let result = [];
                result.push(...this.relVar.totalVarList);
                result.push(...this.relVar.dataProcessInputVarList);
                return result;
            }
        },

        watch: {
            dpVarList: {
                handler(value) {
                    let that = this;
                    that.node.nData.dpVarList = value;
                },
                deep: true
            },
        },

        methods: {
            /**
             * 删除函数
             */
            deleteDataProcessVarClick(dpVar){
                this.$confirm('确定要删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    this.dpVarList = this.dpVarList.filter(item=>item.uuid !== dpVar.uuid)
                }).catch(() => {
                });

            },

            /**
             * 数据处理变量编辑
             */
            editDataProcessVarBefore(dpVar){
                if (dpVar.processType === DataProcessVar.getEnums().FUNC.code){
                    this.funcEdit.dialog = true;
                    Object.assign(this.funcEdit.dataProcessVar, JSON.parse(JSON.stringify(dpVar)))
                }

                if (dpVar.processType === DataProcessVar.getEnums().AVIATOR_SCRIPT.code){
                    this.aviatorScriptEdit.dialog = true;
                    Object.assign(this.aviatorScriptEdit.dataProcessVar, JSON.parse(JSON.stringify(dpVar)))
                }
            },

            handleCommand(command){
                switch (command) {
                    case 'addFuncBefore':
                        this.addFuncBefore();
                        break;
                    case 'addAviatorScriptBefore':
                        this.addAviatorScriptBefore();
                        break;
                }
            },

            /**
             * 添加函数
             */
            addFuncBefore(){
                this.funcEdit.dialog = true;
                this.funcEdit.dataProcessVar = new DataProcessVar({processType: DataProcessVar.getEnums().FUNC.code});
            },

            /**
             * 添加脚本语言
             */
            addAviatorScriptBefore(){
                this.aviatorScriptEdit.dialog = true;

                this.aviatorScriptEdit.dataProcessVar = new DataProcessVar({processType: DataProcessVar.getEnums().AVIATOR_SCRIPT.code});
                this.$nextTick(()=>{
                    this.$refs.aviatorScriptCodemirror.changeHint(this.relVarList)
                })
            },


            /**
             * 保存脚本语言
             */
            saveAviatorAfter(){
                let that = this;
                function onSuccessFunc() {
                    const filterList = that.dpVarList.filter(item => item.uuid === that.aviatorScriptEdit.dataProcessVar.uuid);
                    // 添加
                    if (isEmpty(filterList)) {
                        // 需要重新初始化对象的引用
                        that.dpVarList.push(DataProcessVar.obj2DataProcessVar(JSON.parse(JSON.stringify(that.aviatorScriptEdit.dataProcessVar))));
                    } else {
                        // 保存
                        that.dpVarList.forEach(item => {
                            if (item.uuid === that.aviatorScriptEdit.dataProcessVar.uuid) {
                                Object.assign(item, JSON.parse(JSON.stringify(that.aviatorScriptEdit.dataProcessVar)))
                            }
                        })
                    }
                    that.aviatorScriptEdit.dialog = false;
                }
                that.$refs['aviatorScriptCodemirror'].submitForm(null, onSuccessFunc)

            },

            /**
             * 保存函数
             */
            saveFuncAfter() {
                let that = this;
                that.$refs['funcOpt'].validate().then(res=>{
                    if (res){
                        const filterList = that.dpVarList.filter(item => item.uuid === that.funcEdit.dataProcessVar.uuid);
                        // 添加
                        if (isEmpty(filterList)) {
                            // 需要重新初始化对象的引用
                            that.dpVarList.push(DataProcessVar.obj2DataProcessVar(JSON.parse(JSON.stringify(that.funcEdit.dataProcessVar))));
                        } else {
                            // 保存
                            that.dpVarList.forEach(item => {
                                if (item.uuid === that.funcEdit.dataProcessVar.uuid) {
                                    Object.assign(item, JSON.parse(JSON.stringify(that.funcEdit.dataProcessVar)))
                                }
                            })
                        }
                        that.funcEdit.dialog = false;
                    }
                });

                // function onSuccessFunc() {
                //     const filterList = that.dpVarList.filter(item => item.uuid === that.funcEdit.dataProcessVar.uuid);
                //     // 添加
                //     if (isEmpty(filterList)) {
                //         // 需要重新初始化对象的引用
                //         that.dpVarList.push(DataProcessVar.obj2DataProcessVar(JSON.parse(JSON.stringify(that.funcEdit.dataProcessVar))));
                //     } else {
                //         // 保存
                //         that.dpVarList.forEach(item => {
                //             if (item.uuid === that.funcEdit.dataProcessVar.uuid) {
                //                 Object.assign(item, JSON.parse(JSON.stringify(that.funcEdit.dataProcessVar)))
                //             }
                //         })
                //     }
                //     that.funcEdit.dialog = false;
                // }
                //
                // that.$refs['funcOpt'].submitForm(null, onSuccessFunc)
            },




            init() {
                let that = this;
                that.relVar.totalVarList = G6Model.getTotalVarsOfParents(this.node, this.decisionTree);
                that.relVar.dataProcessInputVarList = this.dataProcessInputVarList;

                that.isEmpty(that.node.nData.dpVarList) ? that.dpVarList = [] : that.dpVarList = that.node.nData.dpVarList.map(item=>new DataProcessVar(item));
            }
        }
    }
</script>

<style scoped>
    #data-process-edit {
        width: 100%;
        height: 100%;
        overflow: auto;
    }
</style>
