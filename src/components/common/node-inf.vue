<template>
    <el-card id="node-inf-title-card">
        <el-form size="mini" label-width="70px" :inline="true" class="node-inf-title-form">
            <el-form-item label="节点编号：">
                <el-tag class="middle-tag title-tag">{{node.nData.uniqueName}}</el-tag>
            </el-form-item>
            <el-divider direction="vertical"></el-divider>
            <el-form-item label="节点名称：">
                <el-input style="width: 193px" :disabled="disabled" v-model="node.name"></el-input>
            </el-form-item>

            <el-divider direction="vertical"></el-divider>

            <el-form-item label="连线类型：">
                <el-select :disabled="disabled" v-model="node.nData.connType">
                    <el-option label="或" key="or" value="or"></el-option>
                    <el-option label="且" key="and" value="and"></el-option>
                </el-select>
            </el-form-item>

            <slot name="right"></slot>
        </el-form>
    </el-card>
</template>

<script>
    import {isEmpty} from "../../utils";
    import "./node-inf.scss"

    export default {
        name: "node-inf",
        props: {
            node: Object,
            disabled: {type: Boolean, default: false}
        },

        watch: {
            'node.nData.connType': {
                handler(value) {
                    let that = this;
                    that.node.description = `${that.node.nData.uniqueName} [${value}]`;
                },
                deep: true
            },

            'node.name': {
                handler(value) {
                    let that = this;
                    if (isEmpty(value)) {
                        that.node.label = " ";
                    } else {
                        that.node.label = value;
                    }
                },
                deep: true
            },
        }
    }
</script>

<style scoped>

</style>
