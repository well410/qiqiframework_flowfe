<template>
    <div id="LogDataShow">
        <el-form label-width="100px" size="mini">
            <el-form-item label="报文格式:" label-width="125px">
                <codemirror-show :p-code="logData"></codemirror-show>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import CodemirrorShow from "../../components/codemirrorShow/CodemirrorShow";

    export default {
        name: "LogDataShow",
        props: {pLogData: {default: undefined, type: Object}},
        data() {
            return {
                logData:{},
            }
        },
        components: {CodemirrorShow},
        mounted(){
            if (this.pLogData !== undefined){
                this.init(JSON.stringify(this.pLogData, null, 4))
            }
        },
        methods:{
            init(logDataDetail){
                this.logData = logDataDetail;
            }
        }
    }
</script>

<style scoped>

</style>