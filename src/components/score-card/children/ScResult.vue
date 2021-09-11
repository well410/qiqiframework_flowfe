<template>
    <div>
        <!--评分结果-->
        <el-table
                id="scResultTable"
                :data="pScResultList"
                tooltip-effect="dark"
                stripe
                border
                max-height="266px"
                size="mini"
                row-key="logicId"
                style="width: 100%">
            <el-table-column prop="logicId" align="center" label="序号" width="80px" class-name="canDrop"></el-table-column>
            <el-table-column align="center" label="分数区间" width="260px">
                <template slot-scope="scope">
                    <el-tooltip placement="top">
                    <div slot="content" v-if="scope['row'].logicId !== 999">[{{scope['row'].start}}{{connectText}}{{scope['row'].end}}]</div>
                    <div slot="content" v-if="scope['row'].logicId === 999">[{{defaultLogic}}]</div>
                    <div v-if="scope['row'].logicId !== 999" class="input-wrapper">
                        <div>
                            <el-input-number size="mini" v-model="scope['row'].start" style="width: 115px"
                                :controls="false" :placeholder="min" :disabled="disabled"></el-input-number>
                        </div>
                        <div>{{connectText}}</div>
                        <div>
                            <el-input-number size="mini" v-model="scope['row'].end" style="width: 115px"
                                :controls="false" :placeholder="max" :disabled="disabled"></el-input-number>
                        </div>
                    </div>
                    <el-input v-if="scope['row'].logicId === 999" disabled size="mini" style="width: 239px"
                                  v-model="defaultLogic"></el-input>

                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column  align="center" label="结果值" width="200px">
                <template slot-scope="scope">
                    <el-tooltip placement="top">
                        <div slot="content">{{scope['row'].resultValue}}</div>
                        <el-input :disabled="disabled" size="mini" v-model="scope['row'].resultValue"></el-input>
                    </el-tooltip>
                </template>
            </el-table-column>


            <el-table-column  align="center" label="结果描述" >
                <template slot-scope="scope">
                    <el-tooltip placement="top">
                        <div slot="content">{{scope['row'].resultDesc}}</div>
                        <el-input :disabled="disabled" size="mini" v-model="scope['row'].resultDesc"></el-input>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column  align="center" label="操作" width="80px" >
                <template slot-scope="scope">
                    <el-button :disabled="disabled"  v-if="scope['row'].logicId !== 999" type="danger" icon="el-icon-delete" class="icon-button"
                               size="mini" @click="deleteClick(scope['row'])" title="删除">
                    </el-button>
                    <el-button v-if="scope['row'].logicId === 999" icon="el-icon-delete" disabled type="danger" size="mini" class="icon-button" title="删除">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

    </div>

</template>

<script>
    import {patternEnums, varFromEnums} from "../../../entity/enumns";

    export default {
        name: "SCResult",
        props: {
            pScResultList: {default: [], type: Array},
            disabled: {default: false, type: Boolean},
        },

        data() {
            return {
                patternEnums: patternEnums,
                varFromEnums: varFromEnums,
                connectText: '~',
                min: '最小值',
                max: '最大值',
                defaultLogic: '默认逻辑',
            }
        },

        methods:{
            // 删除元规则结果
            deleteClick(row) {
                this.$confirm('确定要删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    this.$emit("deleteClick", row);
                }).catch(() => {});

            },
        }
    }
</script>

<style scoped>
  .input-wrapper{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .connect{
    font-size: 14px;
    font-weight: bold;
    color: #606266
  }
</style>
