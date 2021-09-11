<template>
    <div style="height: 260px">
        <hot-table ref="hotRef" :settings="hotSettings"></hot-table>
    </div>

</template>

<script>
    import {HotTable} from '@handsontable/vue';

    export default {
        name: "CellMapConf",
        components: {
            HotTable
        },

        props: {
            disabled: {type: Boolean, default: false, required: false},
        },

        data() {
            return {
                hotSettings: {
                    // data:this.pCellMap,
                    data:[[]],
                    colHeaders: ["other"],
                    rowHeaders: ["other"],
                    rowHeaderWidth: 160,
                    width: 760,
                    height: 260,
                    // colHeaders: true,
                    // rowHeaders: true,
                    colWidths: 120,
                    rowHeights: 23,
                    manualColumnResize: true,
                    manualRowResize: true,
                    readOnly: false,
                    afterChange: () => {
                        if (this.hotRef) {
                            this.$emit("updateCellMap", this.hotRef.getSourceData());
                        }
                    },
                },

                // ----------------
                uRowCdList: [],
                uColCdList: [],
                uCellMap: [],
                hotRef : null,

            }
        },

        computed: {},



        mounted() {
            this.$nextTick(()=>{
                this.hotRef = this.$refs.hotRef['hotInstance'];
                debugger
                this.hotSettings.readOnly = this.disabled;
            })
        },


        methods: {

            init(pRowCdList, pColCdList, pCellMap){
                let that = this;
                that.hotSettings.data = pCellMap;
                that.uColCdList = pColCdList;
                that.uRowCdList = pRowCdList;
                that.uCellMap = pCellMap;
            },

            rowColChange(pRowCdList, pColCdList){
                let that = this;
                that.uColCdList = pColCdList;
                that.uRowCdList = pRowCdList;

                that.hotSettings.rowHeaders = [];
                that.uRowCdList.forEach(item => that.hotSettings.rowHeaders.push(item.getRightInfo()));
                that.hotSettings.rowHeaders.push("other");

                that.hotSettings.colHeaders = [];
                that.uColCdList.forEach(item => that.hotSettings.colHeaders.push(item.getRightInfo()));
                that.hotSettings.colHeaders.push("other");
            },

            clearCellMap(pRowCdList, pColCdList, pCellMap){
                let that = this;
                that.uColCdList = pColCdList;
                that.uRowCdList = pRowCdList;
                that.uCellMap = pCellMap;

                // 监听生成cellMap
                let rowCdNum = that.uRowCdList.length + 1;
                let rowNumCellMap = that.uCellMap.length;

                let colCdNum = that.uColCdList.length + 1;
                let colNumCellMap = that.uCellMap[0].length;

                if (rowCdNum != rowNumCellMap || colCdNum != colNumCellMap) {
                    that.hotSettings.data = that.getInitCellMap();
                }
            },


            getInitCellMap() {
                let that = this;
                let result = [];

                let rowLength = that.uRowCdList.length + 1;
                let colLength = that.uColCdList.length + 1;


                for (let i = 0; i < rowLength; i++) {
                    let rowResult = [];
                    for (let i = 0; i < colLength; i++){
                        rowResult.push(null);
                    }
                    result.push(rowResult);
                }
                return result;
            },


        }


    }
</script>

<style src="../../../../node_modules/handsontable/dist/handsontable.full.css"></style>
