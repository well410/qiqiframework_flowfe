<template>
    <div>
        <el-table
                :max-height="pTableMaxHeight"
                :data="pRequestMappingList"
                v-loading="pLoading"
                tooltip-effect="dark"
                stripe
                border
                size="mini">
            <el-table-column :label="messageEnums.REQUEST_MAPPING_ID.name" prop="requestMappingId"></el-table-column>
            <el-table-column :label="messageEnums.REQUEST_MAPPING_DESC.name"
                             prop="requestMappingDesc"></el-table-column>
            <el-table-column :label="messageEnums.DECS_ID.name" prop="decsId"></el-table-column>
            <el-table-column :label="messageEnums.DECS_VERSION.name" prop="decsVersion"></el-table-column>
            <el-table-column :label="messageEnums.CREATE_TIME.name" prop="createTime"></el-table-column>
            <el-table-column :label="messageEnums.CREATE_USER.name" prop="createUser"></el-table-column>
            <el-table-column :label="messageEnums.UPDATE_TIME.name" prop="updateTime"></el-table-column>
            <el-table-column :label="messageEnums.UPDATE_USER.name" prop="updateUser"></el-table-column>

            <!--版本表特殊-->
            <el-table-column label="请求版本" prop="requestMappingVersion"
                             v-if="['version', 'history'].includes(pTableType)"></el-table-column>
            <el-table-column label="请求状态" prop="status">
                <template slot-scope="props">
                    <el-tag v-if="isNotEmpty(statusEnums[props.row.status])" :type="tagType[props.row.status]">
                        {{statusEnums[props.row.status].name}}
                    </el-tag>
                </template>
            </el-table-column>

            <!--历史表特殊-->
            <el-table-column label="修改类型" prop="changeType" v-if="['history'].includes(pTableType)">
                <template slot-scope="props">
                    <el-tag :type="tagType[props.row.changeType]">
                        {{isEmpty(changeTypeEnums[props.row.changeType]) ? props.row.changeType : changeTypeEnums[props.row.changeType].name}}
                    </el-tag>
                </template>

            </el-table-column>
            <el-table-column label="历史创建人" prop="historyCreateUser"
                             v-if="['history'].includes(pTableType)"></el-table-column>
            <el-table-column label="历史创建时间" prop="historyCreateTime"
                             v-if="['history'].includes(pTableType)"></el-table-column>
            <slot></slot>
        </el-table>
    </div>
</template>

<script>
    import {changeTypeEnums, messageEnums, statusEnums, tagType} from "../../entity/enumns";

    export default {
        name: "RequestMappingCommTable",
        props: {
            pRequestMappingList: {type: Array, require: true},
            pLoading: {type: Boolean, require: false},

            // 表格类型
            pTableType: {type: String, require: false},


            //表格属性
            pTableMaxHeight : {default: '600px'}
        },
        data() {
            return {
                messageEnums: messageEnums,
                statusEnums: statusEnums,
                changeTypeEnums: changeTypeEnums,
                tagType: tagType
            }
        }
    }
</script>

<style scoped>

</style>
