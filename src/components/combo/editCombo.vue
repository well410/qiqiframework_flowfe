<template>
    <!--节点的边-->
    <div id="editCombo">
        <el-form size="mini" label-width="100px">
            <el-form-item label="combo ID">
                <el-input disabled v-model="item.id"></el-input>
            </el-form-item>
            <el-form-item label="combo 标签">
                <el-input v-model="item.label"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

    import {isEmpty, isNotContainEmpty, isNotEmpty} from "../../utils";
    import {G6Editor} from "../g6-editor/entity/entity";
    import {G6Model} from "../../entity/g6Model";

    export default {
        name: "editCombo",
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

        methods:{

            init(){

            },
        }
    }
</script>

<style scoped>
    #editCombo{
        width: 100%;
        height: 100%;
        margin-top: 15px;
        padding-left: 20px;
        padding-right: 20px;
    }
</style>
