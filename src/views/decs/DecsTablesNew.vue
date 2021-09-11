<template>
    <div class="table">
        <div class="tools">
            <el-form class="page-header" @submit.native.prevent>
                <el-form-item>
                    <div class="search-block">
                        <div class="search-input-container">
                            <el-input class='search-input' placeholder="请输入查询关键字" v-model="searchCon"
                                      maxlength="64" show-word-limit
                                      @keydown.enter.native="refreshPage">
                                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                        </div>
                        <span class="search-icon-container" @click="refreshPage"
                              v-cmb-auth-remove="res.decsSearch.code">
                            <svg-icon icon-class="search"/>
                        </span>
                    </div>
                    <div class="tools-bar" style="margin-bottom: 8px;width: 180px;">
                        <div class="clearfix">
                            <a class="helpHome" @click="tohelperHome">帮助文档</a>
                        </div>
                        <div class="tools-button">
                            <el-upload
                                    :on-change="handleChange"
                                    ref="upload"
                                    :auto-upload="false"
                                    :limit="1"
                                    accept=".tcs, .json"
                                    action="">
                                <el-button style="margin-right: 10px;" type="primary" size="mini" slot="trigger"
                                           icon="el-icon-upload" v-cmb-auth-remove="res.decsAdd.code">导入
                                </el-button>
                                <el-button type="primary" size="mini" icon="el-icon-plus" @click="decsAddBefore"
                                           v-cmb-auth-remove="res.decsAdd.code">新增
                                </el-button>
                            </el-upload>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </div>

        <div v-loading="loading" element-loading-background="#fff0">
            <div v-if="decsList.length!=0" v-show="decsList.length!=0" v-loading="loading">
                <div style="display: flex;flex-wrap: wrap; justify-content: space-between;min-height: 719px;">
                    <div class="card-block" v-for="(o,index) in decsList">
                        <el-card :body-style="{ padding: '0px' }">
                            <div slot="header" class="clearfix">
                                <!--                                <div @click="decsFlowClick(o)" v-cmb-auth-remove="res.decsEdit.code">-->
                                <div class="header-title">
                                    <div class="clearfix" style="width: 100%">
                                            <span style="width: 20%">
                                                <svg-icon icon-class="ID" class="gray-bule-icon"></svg-icon>
                                            </span>
                                        <el-tooltip class="item" effect="dark" :content="o.decsId"
                                                    placement="bottom-end" popper-class="card-header-tooltips">
                                            <span>{{o.decsId}}</span>
                                        </el-tooltip>
                                    </div>
                                    <div class="clearfix" style="width: 100%">
                                            <span style="width: 20%">
                                                <svg-icon icon-class="name" class="gray-bule-icon"></svg-icon>
                                            </span>
                                        <el-tooltip class="item" effect="dark" :content="o.decsName"
                                                    placement="bottom-end" popper-class="card-header-tooltips">
                                            <span>{{o.decsName}}</span>
                                        </el-tooltip>
                                    </div>
                                    <div class="clearfix" style="width: 100%">

                                    </div>
                                    <div class="clearfix" style="width: 100%">
                                        <template v-if="isNotEmpty(o.decsVersionRelProperty) && isNotEmpty(o.decsVersionRelProperty.decsFrontVersion) &&o.decsVersionRelProperty.decsFrontVersion === 'N'">
                                            <el-tag type="success" effect="light" style="width:20%">测</el-tag>
                                        </template>
                                        <template v-if="isNotEmpty(o.decsVersionRelProperty) && isNotEmpty(o.decsVersionRelProperty.decsFrontVersion) &&o.decsVersionRelProperty.decsFrontVersion != 'N'">
                                            <el-tag type="success" effect="light" style="width:20%">运</el-tag>
                                        </template>
                                        <template v-if="isNotEmpty(o.inteType) && o.inteType === 'K'">
                                            <el-tag type="info" effect="light" style="width:20%">K</el-tag>
                                        </template>
                                        <template v-if="isNotEmpty(o.inteType) && o.inteType === 'H'">
                                            <el-tag type="info" effect="light" style="width:17%">H</el-tag>
                                        </template>
                                        <template v-if="isNotEmpty(o.inteType) && o.inteType === 'J'">
                                            <el-tag type="info" effect="light" style="width:20%">J</el-tag>
                                        </template>
                                        <template v-if="o.inteConf.showA === true && o.inteConf.showB === true">
                                            <el-tag type="danger"  effect="light"  style="width:20%">灰</el-tag>
                                        </template>

                                    </div>
                                </div>
                                <!--                                </div>-->
                                <div class="head-page">
                                    <el-button type="text" @click="toDmsPage(o)">性能指标</el-button>
                                    <el-button type="text" @click="toMonitorPage(o)">运行指标</el-button>
                                </div>

                            </div>


                            <!--当天TPS时序图echarts-->
                            <div class="tag-tps"
                                 v-loading="!isTPSShow"
                                 element-loading-text="拼命加载中"
                                 element-loading-spinner="el-icon-loading">

                                <normal-bar-line class="tpsEchart" ref="tpsEchart"
                                                 title="TPS趋势"
                                                 yAxisTitleLeft="笔数"
                                                 :isShowYAxisRight=false
                                                 :xAxisData="computeTpsXAxisDate(o)"
                                                 :seriesData="computeTpsSeriesDate(o)"
                                                 :isShowExportTool="true"
                                                 :spinShow=false>
                                </normal-bar-line>
                            </div>

                            <div class="tips-container clearfix"
                                 v-loading="!isCiteShow"
                                 element-loading-text="拼命加载中"
                                 element-loading-spinner="el-icon-loading">
                                <div class="tips-box">
                                    <div class="icon blue">
                                        <svg-icon icon-class="label_icon" class="module-icon"></svg-icon>
                                    </div>
                                    <div class="tips">
                                        <p>引用规则数</p>
                                        <p class="blue">{{o.ruleCount}}</p>
                                    </div>
                                </div>
                                <div class="tips-box">
                                    <div class="icon blue">
                                        <svg-icon icon-class="vip_icon" class="module-icon"></svg-icon>
                                    </div>
                                    <div class="tips">
                                        <p>引用组件数</p>
                                        <p class="blue">{{o.cmptCount}}</p>
                                    </div>
                                </div>
                                <div class="tips-box">
                                    <div class="icon blue">
                                        <svg-icon icon-class="lucky_icon" class="module-icon"></svg-icon>
                                    </div>
                                    <div class="tips">
                                        <p>引用变量数</p>
                                        <p class="blue">{{o.varCount}}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="tips-container clearfix"
                                 v-loading="!isWarmShow"
                                 element-loading-text="拼命加载中"
                                 element-loading-spinner="el-icon-loading">
                                <div class="tips-box">
                                    <div class="icon blue">
                                        <svg-icon icon-class="good_icon" class="module-icon"></svg-icon>
                                    </div>
                                    <div class="tips">
                                        <p>当日请求量</p>
                                        <p class="blue">{{o.requireCount}}</p>
                                    </div>
                                </div>
                                <div class="tips-box">
                                    <div class="icon blue">
                                        <svg-icon icon-class="tanhao_icon" class="module-icon"></svg-icon>
                                    </div>
                                    <div class="tips">
                                        <p>组件失败量</p>
                                        <p class="blue">{{o.cmptFalseCount}}</p>
                                    </div>
                                </div>
                                <div class="tips-box">
                                    <div class="icon blue">
                                        <svg-icon icon-class="warm_icon" class="module-icon"></svg-icon>
                                    </div>
                                    <div class="tips">
                                        <p>入库失败量</p>
                                        <p class="blue">{{o.evsFalseCount}}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="bottom ">
                                <div>
                                    <el-button class="icon-button" icon="el-icon-edit" size="mini"
                                               @click="decsEditBefore(o)" v-cmb-auth-remove="res.decsEdit.code"
                                               title="编辑"></el-button>
                                    <el-button class="icon-button" icon="el-icon-setting" size="mini"
                                               @click="decsFlowClick(o)" v-cmb-auth-remove="res.decsFlow.code"
                                               title="决策图"></el-button>
                                    <el-button class="icon-button" icon="el-icon-video-play" size="mini"
                                               @click="decsPreHandleClick(o)"
                                               :disabled="o.preHandle==='N'||o.preHandle===null||o.preHandle==='null'||o.preHandle===''"
                                               title="预处理"></el-button>
                                    <el-button class="icon-button" icon="el-icon-files" size="mini"
                                               @click="decsVersionClickN(o)" v-cmb-auth-remove="res.decsVersion.code"
                                               title="版本"></el-button>
                                    <el-button class="icon-button" icon="el-icon-document" size="mini"
                                               @click="decsHisClickN(o)" v-cmb-auth-remove="res.decsHis.code"
                                               title="历史"></el-button>
                                    <el-button class="icon-button" icon="el-icon-delete" size="mini"
                                               @click="decsDeleteClick(o)" v-cmb-auth-remove="res.decsDelete.code"
                                               title="删除"></el-button>
                                </div>
                                <!--                                <div>-->
                                <!--                                    <el-button class="icon-button" icon="el-icon-files" size="mini"-->
                                <!--                                               @click="decsVersionClick(o)" v-cmb-auth-remove="res.decsVersion.code"-->
                                <!--                                               title="版本"></el-button>-->
                                <!--                                    <el-button class="icon-button" icon="el-icon-document" size="mini"-->
                                <!--                                               @click="decsHisClick(o)" v-cmb-auth-remove="res.decsHis.code"-->
                                <!--                                               title="历史"></el-button>-->
                                <!--                                    <el-button class="icon-button" icon="el-icon-delete" size="mini"-->
                                <!--                                               @click="decsDeleteClick(o)" v-cmb-auth-remove="res.decsDelete.code"-->
                                <!--                                               title="删除"></el-button>-->
                                <!--                                </div>-->
                            </div>
                        </el-card>
                    </div>

                    <div class="empty-card-block"></div>
                    <div class="empty-card-block"></div>
                    <div class="empty-card-block"></div>
                    <div class="empty-card-block"></div>
                    <!--            </div>-->
                </div>
            </div>
            <div v-else class="no-data">
                <svg-icon icon-class="tree"/>
                <br/>
                <span>未查询到决策数据</span>
            </div>
        </div>

        <div class="page-block clearfix">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page=currentPage
                    :page-sizes="[10, 30, 60, 100]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>


        <!--添加决策-->
        <el-dialog
                :close-on-click-modal="false"
                :visible.sync="add.dialog" class="new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div v-if="add.type === 'upload'" class="dialog-title">导入决策
                        <i class="el-icon-question icon-Add-style" @click="tohelperAdd"></i></div>
                    <div v-else class="dialog-title">添加决策
                        <i class="el-icon-question icon-Add-style" @click="tohelperAdd"></i></div>
                </div>
            </div>
            <el-form ref="addFrom" :model="add.decs" :rules="addRules" label-width="100px" size="mini"
                     class="dialog-elform">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="产品ID:" prop="prodId">
                            <el-input v-model="add.decs.prodId" disabled style="width: 100%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="是否预处理:" prop="preHandle">
                            <el-select v-model="add.decs.preHandle" style="width: 100%">
                                <el-option label="是" value="Y"></el-option>
                                <el-option label="否" value="N"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="决策名称:" prop="decsName">
                            <el-input v-model.trim="add.decs.decsName" placeholder="决策名称" style="width: 100%"
                                      maxlength="50" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="决策ID:" prop="decsId">
                            <el-input v-model.trim="add.decs.decsId" placeholder="决策ID（由小写字母、数字、下划线组成）"
                                      style="width: 100%" :maxlength="computeMaxLength" show-word-limit>
                                <template slot="prepend">{{gConfig.prodId.value}}_decs_</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="配置版本:" prop="decsVersionRelProperty.decsFrontVersion" >
                            <el-select v-model="add.decs.decsVersionRelProperty.decsFrontVersion" placeholder="请选择" clearable @visible-change ="onSelectedReleaseTypeList()"  @change="onSelectedReleaseTypeAddAfter(add.decs.decsVersionRelProperty.decsFrontVersion)" style="width: 100%" >
                                <el-option
                                        v-for="item in releaseTypeList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="主键seqNo:">
                            <el-select v-model="add.decs.seqNo" size="mini" multiple placeholder="请设置主键"
                                       style="width: 100%">
                                <el-option v-for="item in refFieldList"
                                           :key="item.getPrefixVarName()"
                                           filterable
                                           :label="`[${item.getPrefixVarName()}][${item.getSimpleDesc()}]`"
                                           :value="item.getPrefixVarName()">
                                    <span :title="item.getPrefixVarName()" class="option-left">{{item.getPrefixVarName()}}</span>
                                    <span :title="item.getSimpleDesc()"
                                          class="option-right">{{item.getSimpleDesc()}}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="接入类型:" prop="inteType">
                            <el-select v-model="add.decs.inteType" clearable style="width: 100%">
                                <el-option label="http" value="H"></el-option>
                                <el-option label="kafka" value="K"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item label="路由A:" prop="inteConf.urlA">
                            <el-input style="width: 60%" maxlength="256" show-word-limit placeholder="例：http://xxxxx.paas.cmbchina.cn" v-model.trim="add.decs.inteConf.urlA"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <template v-if="add.decs.inteType === 'H'">
                    <!--                    <el-form-item label="http地址">-->
                    <!--                        <el-input style="width: 100%" disabled v-model="add.decs.inteConf.uri"></el-input>-->
                    <!--                    </el-form-item>-->
                </template>

                <template v-if="add.decs.inteType === 'K'">
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="集群地址" prop="inteConf.bootstrapServer">
                                <el-input style="width: 100%"
                                          v-model.trim="add.decs.inteConf.bootstrapServer"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="topic" prop="inteConf.topic">
                                <el-input style="width: 100%" v-model.trim="add.decs.inteConf.topic"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="groupId" prop="inteConf.groupId">
                                <el-input style="width: 100%" v-model.trim="add.decs.inteConf.groupId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="userName" prop="inteConf.userName">
                                <el-input style="width: 100%" v-model.trim="add.decs.inteConf.userName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="password" prop="inteConf.password">
                                <el-input style="width: 100%" v-model.trim="add.decs.inteConf.password"
                                          show-password></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </template>
                <el-form ref="addFromModel" :model="this" :rules="addRules" size="mini" v-show="add.type === 'add'">
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="是否利用模板初始化:" prop="isNeedTemplate">
                                <el-select v-model="isNeedTemplate" style="width: 20%">
                                    <el-option label="是" value="Y"></el-option>
                                    <el-option label="否" value="N"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <template v-if="isNeedTemplate === 'Y'">
                                <el-form-item label="选择模板" prop="templateId">
                                    <el-select v-model="templateId" placeholder="" style="width: 70%">
                                        <el-option v-for="(templateId) in templateIdList" :label="templateId"
                                                   :value="templateId" :key="templateId"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-col>
                    </el-row>
                </el-form>
                <el-row class="clearfix">
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <div class="line-label">解析报文格式</div>
                        <el-form-item prop="analysisJson" class="line-label-item">
                            <codemirror v-model="add.decs.analysisJson"
                                        :options="cmOptions"
                                        style="line-height:20px;z-index: 5000"></codemirror>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <div class="line-label">输入报文示例</div>
                        <el-form-item prop="inputExample" class="line-label-item">
                            <codemirror v-model="add.decs.inputExample" :options="cmOptions"
                                        style="line-height:20px;z-index: 5000"></codemirror>
                        </el-form-item>
                    </el-col>
                </el-row>

                <template v-if="isNotEmpty(evVarList)">
                    <el-table
                            ref="multipleTable"
                            :data="evVarList"
                            tooltip-effect="dark"
                            stripe
                            border
                            size="mini"
                            max-height="500px"
                            style="width: 100%">
                        <el-table-column prop="varName" label="变量名"></el-table-column>
                        <el-table-column prop="varType" label="变量类型"></el-table-column>
                        <el-table-column prop="varDesc" label="变量描述"></el-table-column>
                        <el-table-column prop="varValue" label="字段值"></el-table-column>
                    </el-table>
                </template>
            </el-form>


            <template slot="footer">
                <el-button size="mini" @click="add.dialog = false">取消</el-button>
                <el-button size="mini" type="success"
                           @click="parseClick('addFrom', add.decs.analysisJson, add.decs.inputExample)">解析
                </el-button>
                <el-button v-if="add.type === 'upload'" type="primary" size="mini" @click="decsImportAfter">确定
                </el-button>
                <el-button v-else-if="isNeedTemplate==='Y'" type="primary" size="mini" icon="el-icon-plus"
                           @click="decsAddByTemplateAfter" v-cmb-auth-remove="res.decsAdd.code">确定
                </el-button>
                <el-button v-else type="primary" size="mini" @click="decsAddAfter">确定</el-button>
            </template>
        </el-dialog>

        <!--编辑规则-->
        <el-dialog
                :close-on-click-modal="false"
                :visible.sync="edit.dialog" class="new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">编辑决策
                        <i class="el-icon-question icon-Add-style" @click="tohelperAdd"></i></div>
                </div>
            </div>
            <el-form ref="editFrom" :model="edit.decs" :rules="editRules" label-width="100px" size="mini"
                     class="dialog-elform">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="产品ID:" prop="prodId">
                            <el-input v-model="edit.decs.prodId" disabled style="width: 100%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="是否预处理:" prop="preHandle">
                            <el-select v-model="edit.decs.preHandle" style="width: 100%">
                                <el-option label="是" value="Y"></el-option>
                                <el-option label="否" value="N"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="决策ID:" prop="decsId">
                            <el-input disabled v-model.trim="edit.decs.decsId" placeholder="决策Id（由小写字母、数字、下划线组成）"
                                      style="width: 100%"
                                      :maxlength="computeMaxLength" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="决策名称:" prop="decsName">
                            <el-input v-model.trim="edit.decs.decsName" placeholder="决策名称" style="width: 100%"
                                      maxlength="50"
                                      show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="配置版本:" prop="decsVersionRelProperty.decsFrontVersion">
                            <el-select v-model="edit.decs.decsVersionRelProperty.decsFrontVersion" placeholder="请选择" clearable @visible-change ="onSelectedReleaseTypeList()"  @change="onSelectedReleaseTypeEditAfter(edit.decs.decsVersionRelProperty.decsFrontVersion)" style="width: 100%" >
                                <el-option
                                        v-for="item in releaseTypeList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="主键seqNo:">
                            <el-select v-model="edit.decs.seqNo" size="mini" multiple placeholder="请设置主键"
                                       style="width: 100%">
                                <el-option v-for="item in refFieldList"
                                           :key="item.getPrefixVarName()"
                                           filterable
                                           :label="`[${item.getPrefixVarName()}][${item.getSimpleDesc()}]`"
                                           :value="item.getPrefixVarName()">
                                    <span :title="item.getPrefixVarName()" class="option-left">{{item.getPrefixVarName()}}</span>
                                    <span :title="item.getSimpleDesc()"
                                          class="option-right">{{item.getSimpleDesc()}}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="接入类型:" prop="inteType">
                            <el-select v-model="edit.decs.inteType" clearable style="width: 100%">
                                <el-option label="http" value="H"></el-option>
                                <el-option label="kafka" value="K"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="1" :sm="2" :md="2" :lg="1" :xl="1">
                        <el-form-item>
                            <el-button type="primary" style="margin-left: -75px;" :disabled="(edit.decs.inteConf.showA && edit.decs.inteConf.showB)" @click="routeAdd"> 添加路由 </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="路由A:" v-if="edit.decs.inteConf.showA === true" prop="inteConf.urlA" >
                            <el-input style="width: 100%" maxlength="256"  show-word-limit placeholder="例：http://xxxxx.paas.cmbchina.cn" v-model.trim="edit.decs.inteConf.urlA"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="路由A权重:" v-if="edit.decs.inteConf.showA === true" prop="inteConf.percentA">
                            <el-input-number v-model="edit.decs.inteConf.percentA" controls-position="right" @change="handleChangeRoutePercentA" :min="0" :max="100" :disabled="edit.decs.inteConf.showB === false"></el-input-number>
                            <el-button type="danger" @click="routeDeleteA" style="margin-left: 20px" size="mini" :disabled="edit.decs.inteConf.showB === false">删除路由</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="路由B:" v-if="edit.decs.inteConf.showB === true" prop="inteConf.urlB" >
                            <el-input style="width: 100%" maxlength="256" show-word-limit placeholder="例：http://xxxxx.paas.cmbchina.cn" v-model.trim="edit.decs.inteConf.urlB"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="路由B权重:"  v-if="edit.decs.inteConf.showB === true" prop="inteConf.percentB">
                            <el-input-number v-model="edit.decs.inteConf.percentB"  controls-position="right" @change="handleChangeRoutePercentB" :min="0" :max="100" :disabled="edit.decs.inteConf.showA === false"></el-input-number>
                            <el-button type="danger" @click="routeDeleteB" style="margin-left: 20px" size="mini" :disabled="edit.decs.inteConf.showA === false">删除路由</el-button>
                        </el-form-item>
                    </el-col>

                </el-row>

                <!--                <template v-if="edit.decs.inteType === 'H'">-->
                <!--                    <el-form-item label="http地址:" class="mini-bottom-item">-->
                <!--                        <el-input style="width: 100%" disabled v-model.trim="edit.decs.inteConf.uri"></el-input>-->
                <!--                    </el-form-item>-->
                <!--                </template>-->

                <template v-if="edit.decs.inteType === 'K'">
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="集群地址:" prop="inteConf.bootstrapServer">
                                <el-input style="width: 100%"
                                          v-model.trim="edit.decs.inteConf.bootstrapServer"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="TOPIC" prop="inteConf.topic">
                                <el-input style="width: 100%" v-model.trim="edit.decs.inteConf.topic"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="GROUP_ID" prop="inteConf.groupId">
                                <el-input style="width: 100%" v-model.trim="edit.decs.inteConf.groupId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="USER_NAME" prop="inteConf.userName">
                                <el-input style="width: 100%" v-model.trim="edit.decs.inteConf.userName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="PASSWORD" class="mini-bottom-item" prop="inteConf.password">
                                <el-input style="width: 100%" v-model.trim="edit.decs.inteConf.password"
                                          show-password></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </template>
                <!--                <template v-if="edit.decs.inteType === 'J'">-->
                <!--                    <el-form-item label="域名" prop="inteConf.mountUrl">-->
                <!--                        <el-input style="width: 50%" placeholder="例：http://xxxxx.paas.cmbchina.cn"-->
                <!--                                  v-model.trim="edit.decs.inteConf.mountUrl"></el-input>-->
                <!--                    </el-form-item>-->
                <!--                </template>-->


                <el-row class="clearfix">
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <div class="line-label">解析报文格式</div>
                        <el-form-item prop="analysisJson" class="line-label-item">
                            <codemirror v-model="edit.decs.analysisJson" :options="cmOptions"
                                        :key="ajKey"
                                        style="line-height:20px;z-index: 5000"></codemirror>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <div class="line-label">输入报文示例</div>
                        <el-form-item prop="inputExample" class="line-label-item">
                            <codemirror v-model="edit.decs.inputExample" :options="cmOptions"
                                        :key="ieKey"
                                        style="line-height:20px;z-index: 5000"></codemirror>
                        </el-form-item>
                    </el-col>
                </el-row>


                <template v-if="isNotEmpty(evVarList)">
                    <el-table
                            ref="multipleTable"
                            :data="evVarList"
                            tooltip-effect="dark"
                            stripe
                            border
                            size="mini"
                            max-height="500px"
                            style="width: 100%">
                        <el-table-column prop="varName" label="变量名"></el-table-column>
                        <el-table-column prop="varType" label="变量类型"></el-table-column>
                        <el-table-column prop="varDesc" label="变量描述"></el-table-column>
                        <el-table-column prop="varValue" label="字段值">
                            <template slot-scope="scope">
                                {{JSON.stringify(scope['row'].varValue)}}
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-form>


            <template slot="footer">
                <el-button size="mini" @click="edit.dialog = false">取消</el-button>
                <el-button size="mini" type="success"
                           @click="parseClick('editFrom', edit.decs.analysisJson, edit.decs.inputExample)">解析
                </el-button>
                <el-button type="primary" size="mini" @click="decsEditAfter">确定</el-button>
            </template>
        </el-dialog>


    </div>
</template>

<script>
    //codemirror导入
    import "codemirror/lib/codemirror.css";
    import "codemirror/addon/hint/show-hint.css";
    import "codemirror/theme/idea.css"
    import "codemirror/mode/javascript/javascript"
    import "codemirror/addon/edit/matchbrackets"
    import "codemirror/addon/selection/active-line"
    import "codemirror/addon/lint/lint";
    import "codemirror/addon/lint/lint.css";
    import "codemirror/addon/lint/json-lint";
    import "../common/indexL.less"

    require("script-loader!jsonlint");


    import {DecsBase, DecsVersion} from "../../entity/decs";
    import {
        validateAJ,
        validateChinese, validateNullChar,
        validateSpChar,
        validateUpperChar, validateVarSpChar
    } from "../common";
    import {
        addDecs,
        deleteDecs,
        getDecsById,
        getDmsBaseUrl,
        queryDecsAndCiteCount,
        updateDecs, queryDecsCiteCount,
        importDecsVersion, addDecsByTemplate, getTemplateIdList, getMonitorUrl
    } from "../../api/Decs";
    import {evVarParse} from "../../api/Utils";
    import DecsShow from "./decs-components/DecsShow";
    import {isEmpty, isNotEmpty, isContainEmpty} from "../../utils";
    import {DecsFilter, DecsFuzzyFilter} from "./index";
    import {getUUID} from "../../components";
    import {inteTypeEnums, statusEnums, tabType, tagType} from "../../entity/enumns";
    import {EVar} from "../../entity/vars";
    import AviatorScriptCodemirror from "../../components/aviator-script-codemirror/aviator-script-codemirror";
    import {DecsImportDto} from "../../views/decs";
    import {modifyTqsDs} from "../../api/TqsDatasource";
    import {Vue} from "vue";
    import {getSeriesDataOfNum, getSeriesDataOfPct, getXAxisData} from "../../libs/tools";
    import {getTcsDecsTpsEchartsList, queryDecsWarmCount} from "../../api/TcsMonitor";
    import NormalBarLine from "../../components/charts/normal-bar-line"
    import {getAllDecsVersionRel} from "../../api/DecsVersionRel";
    import {DecsRuleRel} from "../../entity/rel";
    import {DecsVersionRel} from "../../entity/decsFrontVersion/decsFrontVersion";

    export default {
        name: "DecsTablesNew",
        components: {AviatorScriptCodemirror, DecsShow, NormalBarLine},
        data() {
            const validateDecsId = (rule, value, callback) => {
                getDecsById({
                    decsId: `${this.gConfig.prodId.value}_decs_${value}`,
                    prodId: this.gConfig.prodId.value
                }).then(res => {
                    if (res.data.data !== null) {
                        this.add.repeatId = true;
                        if (this.add.type !== 'upload') {
                            callback(new Error('id重复'))
                        } else {
                            callback();
                        }
                    } else {
                        callback();
                        this.add.repeatId = false;
                    }
                });
            };

            const validateDecsIdLength = (rule, value, callback) => {
                if (value.length > this.computeMaxLength) {
                    callback(new Error('id超长'));
                } else {
                    callback();
                }
            };

            const validateDecsNameLength = (rule, value, callback) => {
                if (value.length > 50) {
                    callback(new Error('名称超长'));
                } else {
                    callback();
                }
            };
            const validatetemplateId = (rule, value, callback) => {
                let that = this;
                if (value === '' && that.isNeedTemplate === 'Y') {
                    callback(new Error('请选择模板版本'));
                } else {
                    callback();
                }
            };

            return {
                //用来控制路由输入框
                isModify : false,
                routeDisable: true,
                // 监控页面基础地址
                isNeedTemplate: 'N',
                templateId: '',
                templateIdList: [],
                dmsBaseUrl: '',
                monitorBaseUrl: '',
                loading: false,
                isCiteShow: false,
                pageNum: 1,
                currentPage: 1,
                pageSize: 10,
                total: 0,
                decsFilter: new DecsFilter(),
                isEmpty: isEmpty,
                isNotEmpty: isNotEmpty,
                varDialog: false,
                searchCon: "",
                // 字段映射的引用
                refFieldList: [],
                decsList: [],
                multiDecsRuleList: [],
                evVarList: [],
                tabType: tabType,
                tagType: tagType,
                add: {dialog: false, type: '', repeatId: false, decs: new DecsBase(), decsBackupDto: null},
                edit: {dialog: false, decs: new DecsBase()},
                addRules: {
                    prodId: [
                        {required: true, message: '请输入产品id', trigger: 'blur'},
                    ],
                    decsId: [
                        {required: true, message: '请输入决策id', trigger: 'blur'},
                        {validator: validateNullChar, trigger: 'blur'},
                        {validator: validateDecsId, trigger: 'blur'},
                        {validator: validateSpChar, trigger: 'blur'},
                        {validator: validateChinese, trigger: 'blur'},
                        {validator: validateUpperChar, trigger: 'blur'},
                        {validator: validateDecsIdLength, trigger: 'blur'}
                    ],
                    preHandle: [
                        {required: true, message: '请选择是否需要预处理', trigger: 'change'},
                    ],
                    "decsVersionRelProperty.decsFrontVersion": [
                        {required: true, message: '请选择配置版本', trigger: 'change'},
                    ],
                    inteType: [
                        {required: true, message: '请选择接入类型', trigger: 'change'},
                    ],
                    decsName: [
                        {required: true, message: '请输入决策名', trigger: 'blur'},
                        {validator: validateNullChar, trigger: 'blur'},
                        {validator: validateDecsNameLength, trigger: 'blur'},
                    ],
                    analysisJson: [
                        {required: true, message: '请输入解析报文格式', trigger: 'blur'},
                        {validator: validateVarSpChar, trigger: 'blur'},
                        {validator: validateAJ, trigger: 'blur'},
                    ],
                    inputExample: [
                        {required: true, message: '请输入输入报文示例', trigger: 'blur'},
                        {validator: validateVarSpChar, trigger: 'blur'},
                    ],
                    isNeedTemplate: [
                        {required: true, message: '请选择是否利用模板初始化', trigger: 'blur'},
                    ],
                    'inteConf.bootstrapServer': [
                        {required: true, message: '请输入集群地址', trigger: 'blur'},
                    ],
                    'inteConf.topic': [
                        {required: true, message: '请输入 TOPIC', trigger: 'blur'},
                    ],
                    'inteConf.groupId': [
                        {required: true, message: '请输入 GROUP ID', trigger: 'blur'},
                    ],
                    // 'inteConf.userName': [
                    //     {required: true, message: '请输入 USER NAME', trigger: 'blur'},
                    // ],
                    // 'inteConf.password': [
                    //     {required: true, message: '请输入 PASSWORD', trigger: 'blur'},
                    // ],
                    'inteConf.mountUrl': [
                        {required: true, message: '请输入域名', trigger: 'blur'},
                    ],
                    'inteConf.urlA': [
                        {required: true, message: '请输入路由A', trigger: 'blur'},
                    ],

                },
                editRules: {
                    prodId: [
                        {required: true, message: '请输入决策id', trigger: 'blur'},
                    ],
                    decsId: [
                        {required: true, message: '请输入决策id', trigger: 'blur'},
                    ],
                    preHandle: [
                        {required: true, message: '请选择是否需要预处理', trigger: 'change'},
                    ],
                    "decsVersionRelProperty.decsFrontVersion": [
                        {required: true, message: '请选择配置版本', trigger: 'change'},
                    ],
                    inteType: [
                        {required: true, message: '请选择接入类型', trigger: 'change'},
                    ],
                    decsName: [
                        {required: true, message: '请输入决策名', trigger: 'blur'},
                        {validator: validateNullChar, trigger: 'blur'},
                    ],
                    analysisJson: [
                        {required: true, message: '请输入解析报文格式', trigger: 'blur'},
                        {validator: validateVarSpChar, trigger: 'blur'},
                        {validator: validateAJ, trigger: 'blur'},
                    ],
                    inputExample: [
                        {required: true, message: '请输入输入报文示例', trigger: 'blur'},
                        {validator: validateVarSpChar, trigger: 'blur'},
                    ],
                    'inteConf.bootstrapServer': [
                        {required: true, message: '请输入集群地址', trigger: 'blur'},
                    ],
                    'inteConf.topic': [
                        {required: true, message: '请输入 TOPIC', trigger: 'blur'},
                    ],
                    'inteConf.groupId': [
                        {required: true, message: '请输入 GROUP ID', trigger: 'blur'},
                    ],
                    // 'inteConf.userName': [
                    //     {required: true, message: '请输入 USER NAME', trigger: 'blur'},
                    // ],
                    // 'inteConf.password': [
                    //     {required: true, message: '请输入 PASSWORD', trigger: 'blur'},
                    // ],
                    'inteConf.mountUrl': [
                        {required: true, message: '请输入域名', trigger: 'blur'},
                    ],
                    'inteConf.urlA': [
                        {required: true, message: '请输入路由A', trigger: 'blur'},
                    ],
                    'inteConf.percentA': [
                        {required: true, message: '路由A权重不为空', trigger: 'blur'},
                    ],
                    'inteConf.urlB': [
                        {required: true, message: '请输入路由B', trigger: 'blur'},
                    ],
                    'inteConf.percentB': [
                        {required: true, message: '路由B权重不为空', trigger: 'blur'},
                    ]

                },
                statusEnums: statusEnums,
                inteTypeEnums: inteTypeEnums,
                //codemirror配置
                ajKey: "default",
                ieKey: "default",
                cmOptions: {
                    //使用的语言
                    mode: 'application/json',
                    theme: 'idea',
                    lineWrapping: true,
                    foldGutter: true,
                    //语法报错
                    lint: true,
                    // gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter","CodeMirror-lint-markers"],
                    showCursorWhenSelecting: true,
                    autofocus: false,
                    line: true,
                    indentWithTabs: true,
                    smartIndent: true,
                    //显示行号
                    lineNumbers: true,
                    //括号匹配
                    matchBrackets: true,
                },
                decsImportDto: new DecsImportDto(),

                // ========================== TPS Echarts ==========================
                isTPSShow: false,
                isWarmShow: false,
                tpsEchartObject: {
                    xAxisData: [],
                    seriesData: [],
                    isShowYAxisRight: false,
                    spinShow: false
                },

                chartsSearchDto: {
                    'prodId': '',       // 当前人员配置的prodId
                    'decsIds': [], // ids
                },

                lastResultNumList: [],
                releaseTypeList: [],
            };
        },

        watch: {
            'add.decs.decsId': {
                handler(value) {
                    let matchHref = this.getMatchHref();
                    if (isEmpty(matchHref)) {
                        console.warn("当前网址不是*.cmbchina.cn类型");
                        this.add.decs.inteConf.uri = `http://${this.gConfig.prodId.value}-decs-${value}.tcsdecs.paas.cmbchina.cn/exec`.toLowerCase()
                    } else {
                        this.add.decs.inteConf.uri = `http://${this.gConfig.prodId.value}-decs-${value}.tcsdecs.${matchHref[0].split(".")[0]}.cmbchina.cn/exec`.toLowerCase()
                    }

                },
                deep: true
            },
            'add.decs.analysisJson': {
                handler(value) {
                    //需要的引用字段列表
                    this.refFieldList = [];
                    evVarParse({analysisJson: value, inputExample: ""}).then(res => {
                        if (res.data.code === "E501") {
                            console.log(res.data.message);
                        } else {
                            let evVarList = res.data.data
                                .map(item => new EVar({
                                    varName: item.path,
                                    varDesc: item.desc,
                                    varType: item.type,
                                    varValue: item.value
                                }));
                            //事件变量以及父节点的全局变量
                            this.refFieldList.push(...evVarList);
                        }
                    });
                },
                deep: true
            },
            'edit.decs.analysisJson': {
                handler(value) {
                    //需要的引用字段列表
                    this.refFieldList = [];
                    evVarParse({analysisJson: value, inputExample: ""}).then(res => {
                        if (res.data.code === "E501") {
                            console.log(res.data.message)
                        } else {
                            let evVarList = res.data.data
                                .map(item => new EVar({
                                    varName: item.path,
                                    varDesc: item.desc,
                                    varType: item.type,
                                    varValue: item.value
                                }));
                            //事件变量以及父节点的全局变量
                            this.refFieldList.push(...evVarList);
                        }
                    });
                },
                deep: true
            },
            'isModify': {
                handler(value) {
                    //需要的引用字段列表
                    if(value === true){
                        this.routeDisable = false;
                    }else{
                        this.routeDisable = true;
                    }
                },
                deep: true
            },

        },

        computed: {
            childrenPath() {
                let router = this.$router.options.routes.filter(r => r.path === this.$route.path)[0];
                return this.$route.path + "/" + router.children[0].path;
            },


            computeMaxLength() {
                return 32 - `${this.gConfig.prodId.value}_decs_`.length
            },

            computeTpsXAxisDate() {
                return (decs) => {
                    let filter = this.lastResultNumList.filter(item => item.name === decs.decsId);
                    let xAxisData = [];
                    xAxisData = filter.length > 0 ? JSON.parse(JSON.stringify(getXAxisData(filter[0].lastResult))) : [];
                    return JSON.parse(JSON.stringify(xAxisData));
                }
            },

            computeTpsSeriesDate() {
                return (decs) => {
                    let filter = this.lastResultNumList.filter(item => item.name === decs.decsId);
                    let seriesData = [];
                    // seriesData = JSON.parse(JSON.stringify(getSeriesDataOfNum(lastResulList)));
                    seriesData = filter.length > 0 ? JSON.parse(JSON.stringify(getSeriesDataOfPct(filter))) : [];
                    return JSON.parse(JSON.stringify(seriesData));
                }
            },

        },


        mounted() {
            this.refreshPage();
            this.initDmsBaseUrl();
            this.initMonitorBaseUrl();
        },

        methods: {
            init() {

            },
            handleChangeRoutePercentA(){
                this.edit.decs.inteConf.percentB = 100 - this.edit.decs.inteConf.percentA;
            },
            handleChangeRoutePercentB(){
                this.edit.decs.inteConf.percentA = 100 - this.edit.decs.inteConf.percentB;
            },
            initDmsBaseUrl() {
                getDmsBaseUrl().then(res => {
                    this.dmsBaseUrl = res.data.data;
                })
            },

            initMonitorBaseUrl() {
                getMonitorUrl().then(res => {
                    this.monitorBaseUrl = res.data.data;
                })
            },

            //处理决策文件读取
            handleChange(res, file) {
                let that = this
                let reader = new FileReader();
                reader.onload = function (event) {
                    that.$refs.upload.abort();
                    that.$refs.upload.clearFiles();
                    that.decsImportBefore(event.target.result);
                }
                reader.readAsText(res.raw);
            },

            toDmsPage(decs) {
                function buildProdId(_prodId){
                    if (_prodId.includes(".")){
                        return _prodId.toUpperCase();
                    }

                    // 我们lu88没有写子产品，只能硬编码了
                    if (_prodId.toUpperCase().startsWith("LU88")){
                        return `${_prodId.toUpperCase()}.33`;
                    }
                    return _prodId;
                }

                let dmsBaseUrl = this.dmsBaseUrl;
                let prodId = buildProdId(this.gConfig.prodId.value);
                let appId = `${prodId}_${decs.decsId.split("_").slice(2).join("")}`;
                if (dmsBaseUrl.lastIndexOf("/")) {
                    window.open(`${dmsBaseUrl}${prodId}/${appId}//`, "_blank")
                } else {
                    window.open(`${dmsBaseUrl}/${prodId}/${appId}//`, "_blank")
                }
            },

            toMonitorPage(decs) {
                const monitorBaseUrl = this.monitorBaseUrl;
                const prodId = this.gConfig.prodId.value;
                const decsId = decs.decsId;
                // let myWindow = window.open(`${decs.inteConf.mountUrl}/ui/decsManage/decsInf?decsId=${decs.decsId}&tab=DecsHis&prodId=${this.gConfig.prodId.value}`,"_blank")

                if (monitorBaseUrl.lastIndexOf("/") == monitorBaseUrl.length - 1) {
                    let url = monitorBaseUrl.substring(0, monitorBaseUrl.length - 1);
                    window.open(`${url}?prodId=${prodId}&decsId=${decsId}`, "_blank");
                } else {
                    let url = monitorBaseUrl;
                    window.open(`${url}?prodId=${prodId}&decsId=${decsId}`, "_blank");
                }
            },

            tohelperHome() {
                window.open(this.helper.helpUri.uri + '/modules/decision/1.html', "_blank")
            },
            tohelperAdd() {
                window.open(this.helper.helpUri.uri + '/modules/decision/1.html#新增', "_blank")
            },

            getMatchHref() {
                return window.location.href.match(/[a-zA-z]+\.cmbchina\.cn/g);
            },

            // 页面切换
            handleCurrentChange(val) {
                this.pageNum = val;
                this.currentPage = val;
                this.refreshPage();
            },

            handleSizeChange(val) {
                this.pageNum = 1;
                this.pageSize = val;
                this.currentPage = 1;
                this.refreshPage();
            },

            //点击查看更多
            toggle(showStatus) {
                return !showStatus
            },

            // 刷新页面
            refreshPage() {
                let that = this;
                that.decsList = []
                that.multiDecsRuleList = []
                let filterParams = {
                    searchCon: that.searchCon
                }
                let params = {
                    prodId: that.gConfig.prodId.value,
                    pageNum: that.pageNum,
                    pageSize: that.pageSize,
                    decsFilter: new DecsFuzzyFilter(filterParams)
                };
                that.isCiteShow = false;
                that.loading = false;
                that.isTPSShow = false;
                that.isWarmShow = false;
                queryDecsAndCiteCount(params).then(res => {
                    that.total = res.data.data['total'];
                    that.decsList = res.data.data['objectList'];
                    // 为decs默认填充一下echarts的数据类
                    for (let i = 0; i < that.decsList.length; i++) {
                        that.decsList[i]['tpsEchartObject'] = {
                            xAxisData: [],
                            seriesData: [],
                            isShowYAxisRight: false,
                            spinShow: false
                        };
                    }
                    that.showCiteCount(that.decsList);
                    // tps echarts
                    that.queryTpsEcharts(that.decsList);
                    // 请求量，组件失败量，入库失败量
                    that.queryWarmCount(that.decsList);
                    debugger

                    //格式化决策实体类
                    //that.decsList = that.decsList.map(decs => new DecsBase(decs))
                    if (that.total > 0 && that.decsList.length === 0) {
                        that.pageNum = 1;
                        that.refreshPage()
                    }
                }).finally(res => {
                    that.loading = false;
                });

                let param = {
                    prodId: that.gConfig.prodId.value
                };
                getTemplateIdList(param).then(resp => {
                    that.templateIdList = resp.data.data;
                }).finally(resp => {
                    that.loading = false;
                });
            },

            queryWarmCount(decsList) {
                let that = this;
                let warmSearchDto = {
                    prodId: that.gConfig.prodId.value,
                    decsIds: []
                };
                for (let i = 0; i < that.decsList.length; i++) {
                    warmSearchDto.decsIds.push(that.decsList[i].decsId);
                }
                queryDecsWarmCount({searchDto: warmSearchDto}).then(res => {
                    let warmCount = res.data.data;
                    for (let i = 0; i < that.decsList.length; i++) {
                        that.decsList[i].requireCount = warmCount[i].requireCount;
                        that.decsList[i].cmptFalseCount = warmCount[i].cmptFalseCount;
                        that.decsList[i].evsFalseCount = warmCount[i].evsFalseCount;
                    }
                    that.isWarmShow = true;
                })
            },

            showCiteCount(decsList) {
                let that = this;
                let decsListNew = decsList.map(item => {
                    return {decsId: item.decsId, prodId: item.prodId}
                });

                let prodId = that.gConfig.prodId.value;
                queryDecsCiteCount({prodId: prodId, decsList: decsListNew}).then(res => {
                    let citeCount = res.data.data;
                    for (let i = 0; i < that.decsList.length; i++) {
                        that.decsList[i].ruleCount = citeCount[0][i];
                        that.decsList[i].funcCount = citeCount[1][i];
                        that.decsList[i].cmptCount = citeCount[2][i];
                        that.decsList[i].varCount = citeCount[3][i];
                    }
                    that.isCiteShow = true;
                })

            },

            queryTpsEcharts(decsList) {
                let that = this;
                // 查询参数准备
                that.chartsSearchDto.prodId = that.gConfig.prodId.value;
                that.chartsSearchDto.decsIds = [];
                decsList.forEach(item => {
                    that.chartsSearchDto.decsIds.push(item.decsId);
                });
                let queryDtoRes = that.chartsSearchDto;
                // 后端TPS接口
                getTcsDecsTpsEchartsList(queryDtoRes).then(res => {
                    that.lastResultNumList = res.data.data;
                    let lastResultNums = res.data.data;
                    let xAxisData = [];
                    // x轴数据（这个其实都是一样的）
                    xAxisData = lastResultNums.length > 0 ? JSON.parse(JSON.stringify(getXAxisData(lastResultNums[0].lastResult))) : [];
                    // 为每一个decs填充tpsEchartObject对象
                    for (let i = 0; i < that.decsList.length; i++) {
                        let seriesData = [];
                        let tpsEchartObject = {
                            xAxisData: [],
                            seriesData: [],
                            isShowYAxisRight: false,
                            spinShow: false
                        };
                        tpsEchartObject.isShowYAxisRight = false;
                        let lastResulList = [];
                        lastResulList.push(lastResultNums[i]);
                        // seriesData = JSON.parse(JSON.stringify(getSeriesDataOfNum(lastResulList)));
                        seriesData = JSON.parse(JSON.stringify(getSeriesDataOfPct(lastResulList)));
                        tpsEchartObject.xAxisData = JSON.parse(JSON.stringify(xAxisData));
                        tpsEchartObject.seriesData = JSON.parse(JSON.stringify(seriesData));
                        that.decsList[i].tpsEchartObject = tpsEchartObject;
                        that.decsList[i]['tpsEchartObject'] = tpsEchartObject;
                        this.$set(that.decsList[i], 'tpsEchartObject', tpsEchartObject)
                        // that.$refs.tpsEchart[i].renderCharts();
                    }
                    for (let i = 0; i < that.$refs.tpsEchart.length; i++) {
                        that.$refs.tpsEchart[i].renderCharts();
                    }
                }).catch(err => {
                    console.log("决策TPS查询出错：" + err);
                }).finally(() => {
                    that.isTPSShow = true;
                })
            },

            //点击解析
            parseClick(fromType, aj, ie) {
                let that = this;

                function setEVarList(res) {
                    let evVarList = res.data.data
                        .map(item => new EVar({
                            varName: item.path,
                            varDesc: item.desc,
                            varType: item.type,
                            varValue: item.value
                        }));
                    that.evVarList = evVarList;
                }

                // 验证from表单
                that.$refs[fromType].validate((valid) => {
                    if (valid) {
                        evVarParse({analysisJson: aj, inputExample: ie}).then(res => {
                            if (res.data.code === "E501") {
                                that.$message({message: res.data.message, type: 'error'});
                            } else {
                                that.$message({message: "成功", type: 'success'});
                                setEVarList(res)
                            }
                        });
                        that.formatJson(fromType, JSON.parse(aj), JSON.parse(ie));
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // 格式化json
            formatJson(fromType, analysisJson, inputExample) {
                let that = this;
                if (fromType === 'editFrom') {
                    that.edit.decs.inputExample = JSON.stringify(inputExample, null, 4);
                    that.edit.decs.analysisJson = JSON.stringify(analysisJson, null, 4);
                } else if (fromType === 'addFrom') {
                    that.add.decs.inputExample = JSON.stringify(inputExample, null, 4);
                    that.add.decs.analysisJson = JSON.stringify(analysisJson, null, 4);
                }
            },


            // 删除决策
            decsDeleteClick(decs) {
                let that = this;
                this.$confirm('确定要删除该决策吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    deleteDecs({decsId: decs.decsId, prodId: this.gConfig.prodId.value}).then(res => {
                        if (that.decsList.length - 1 === 0) {
                            if (that.pageNum > 1) {
                                that.pageNum = that.pageNum - 1
                            }
                        }
                        //删除完后刷新页面
                        that.refreshPage();
                        let msg = "删除成功";
                        if (typeof (res.data.data) !== "boolean") msg = res.data.data;
                        that.$message({message: msg, type: "success"})
                    });
                }).catch(() => {
                });
            },

            // 添加按钮点击，显示对话框
            decsAddBefore() {
                let that = this;
                that.add.dialog = true;
                that.add.type = 'add';
                let param = {
                    prodId: that.gConfig.prodId.value
                };
                getTemplateIdList(param).then(resp => {
                    that.templateIdList = resp.data.data;
                }).finally(resp => {

                });
                that.$nextTick(() => {
                    that.$refs['addFrom'].resetFields();
                    that.add.decs = new DecsBase();
                    that.isNeedTemplate = 'N';
                    that.templateId = '';
                    that.evVarList = [];
                });


            },

            checkDecsFile(decs) {
                if (isEmpty(decs) || isEmpty(decs.prodId) ||
                    isEmpty(decs.preHandle) || isEmpty(decs.inteType) || isEmpty(decs.inteConf)) {
                    throw new Error("导入的决策文件不正确");
                }

                /*if (decs.prodId !== this.gConfig.prodId.value) {
                    throw new Error("产品不一致")
                }*/
                return true;
            },

            //天擎数据源更新（无则新增，有则更新）
            tqsRelatedUpdate(tqsDatasource) {
                let that = this;
                let upTqsDs = JSON.parse(JSON.stringify(tqsDatasource));
                if (typeof upTqsDs.evVars == 'object') {
                    upTqsDs.evVars = JSON.stringify(upTqsDs.evVars);
                }
                modifyTqsDs({
                    prodId: that.gConfig.prodId.value,
                    tqsDatasource: upTqsDs,
                }).then(res => {
                    if (res.data.data.success) {
                        that.$message({message: res.data.data.message, type: "success"});
                    } else {
                        that.$message({message: res.data.data.message, type: "error"});
                    }
                });
            },

            // 导入决策选择文件后，显示对话框
            decsImportBefore(decsFile) {
                let that = this;
                let oldDecsJson=JSON.parse(decsFile);
                let oldProdId=oldDecsJson.decsUpdateDto.decsVersion.prodId;
                //that.add.decsBackupDto = JSON.parse(decsFile.replaceAll(oldProdId,this.gConfig.prodId.value));
                that.add.decsBackupDto = JSON.parse(decsFile.replaceAll(oldProdId, this.gConfig.prodId.value));
                //debugger
                try {
                    that.checkDecsFile(that.add.decsBackupDto.decsUpdateDto.decsVersion)
                } catch (e) {
                    that.$message({message: e, type: "error"});
                    return;
                }
                that.add.dialog = true;
                that.add.type = 'upload';
                that.$nextTick(() => {
                    that.$refs['addFrom'].resetFields();
                    // 去掉产品前缀
                    that.add.decsBackupDto.decsUpdateDto.decsVersion.decsId = that.add.decsBackupDto.decsUpdateDto.decsVersion.decsId.replace(that.gConfig.prodId.value + '_decs_', '');
                    that.add.decs = that.add.decsBackupDto.decsUpdateDto.decsVersion;
                    that.evVarList = [];
                });

            },

            async handleImport() {
                let that = this;
                let decs = new DecsBase(JSON.parse(JSON.stringify(that.add.decs)));
                let decsBackupDto = JSON.parse(JSON.stringify(that.add.decsBackupDto));
                // 恢复产品id
                decsBackupDto.decsUpdateDto.decsVersion.decsId = `${that.gConfig.prodId.value}_decs_${decs.decsId}`;
                importDecsVersion({
                    prodId: that.gConfig.prodId.value,
                    decsId: decs.decsId,
                    decsBackupDto: decsBackupDto
                }).then(res => {
                    that.add = {dialog: false, type: '', repeatId: false, decs: new DecsBase(), decsBackupDto: null};
                    that.refreshPage();
                    if (res.data.code === '200') {
                        that.$message({message: '导入成功', type: 'success'});
                    } else {
                        that.$message({message: '导入失败：' + res.data.message, type: 'error'});
                    }
                });
            },

            decsImportAfter() {
                let that = this;
                this.$refs['addFrom'].validate((valid) => {
                    if (valid) {
                        if (that.add.repeatId === false) {
                            //that.decsAddAfter();
                            that.handleImport();
                        } else {
                            this.$confirm('已存在相同的决策，确定要导入覆盖该决策吗？', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'success'
                            }).then(({value}) => {
                                that.handleImport();
                            }).catch(() => {
                            });
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // 点击添加，添加决策
            decsAddAfter() {
                let that = this;
                this.$refs['addFrom'].validate((valid) => {
                    if (valid) {
                        let decs = new DecsBase(that.add.decs);
                        decs.decsId = `${this.gConfig.prodId.value}_decs_${decs.decsId}`;
                        addDecs({decs: decs, prodId: this.gConfig.prodId.value}).then(res => {
                            that.add = {dialog: false, decs: new DecsBase()};
                            that.refreshPage();

                            let msg = "添加/导入成功";
                            if (typeof (res.data.data) !== "boolean") msg = res.data.data;
                            that.$message({message: msg, type: "success"})
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // 点击添加，添加决策
            decsAddByTemplateAfter() {
                let that = this;
                this.$refs['addFrom'].validate((valid) => {
                    if (valid) {
                        this.$refs['addFromModel'].validate((validModel) => {
                            if (validModel) {
                                let decs = new DecsBase(that.add.decs);
                                decs.decsId = `${this.gConfig.prodId.value}_decs_${decs.decsId}`;
                                addDecsByTemplate({
                                    decs: decs,
                                    prodId: this.gConfig.prodId.value,
                                    templateId: that.templateId
                                }).then(res => {
                                    that.add = {dialog: false, decs: new DecsBase()};
                                    that.refreshPage();
                                    that.isNeedTemplate = 'N';
                                    that.templateId = '';

                                    let msg = "添加/导入成功";
                                    if (typeof (res.data.data) !== "boolean") msg = res.data.data;
                                    that.$message({message: msg, type: "success"})
                                });
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // 编辑编辑，修改决策
            decsEditAfter() {
                let that = this;
                that.isModify = false;
                this.$refs['editFrom'].validate((valid) => {
                    if (valid) {
                        updateDecs({
                            prodId: that.gConfig.prodId.value,
                            decsId: that.edit.decs.decsId,
                            decsUpdateDto: {decsBase: that.edit.decs}
                        }).then(res => {
                            that.$message({message: '成功', type: 'success'});
                            that.edit = {dialog: false, decs: new DecsBase()};
                            that.refreshPage();
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            routeAdd(){
                let that = this;
                if(that.edit.decs.inteConf.showA === false){
                    that.edit.decs.inteConf.showA = true;
                }
                if(that.edit.decs.inteConf.showB === false){
                    that.edit.decs.inteConf.showB = true;
                }
                this.$forceUpdate()

            },
            routeDeleteA(){
                let that = this;
                if(that.edit.decs.inteConf.percentA !== 0){
                    let message = "当前路由权重不为0，删除操作会将当前路由权重置为0";
                    this.$confirm(message, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(({value}) => {
                        that.edit.decs.inteConf.showA = false;
                        that.edit.decs.inteConf.percentA = 0;
                        that.edit.decs.inteConf.percentB = 100;
                        this.$forceUpdate()
                    }).catch(() => {
                    });
                }else{
                    that.edit.decs.inteConf.showA = false;
                    this.$forceUpdate()
                }

            },
            routeDeleteB(){
                let that = this;
                if(that.edit.decs.inteConf.percentB !== 0){
                    let message = "当前路由权重不为0，删除操作会将当前路由权重置为0";
                    this.$confirm(message, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(({value}) => {
                        that.edit.decs.inteConf.showB = false;
                        that.edit.decs.inteConf.percentB = 0;
                        that.edit.decs.inteConf.percentA = 100;
                        this.$forceUpdate()
                    }).catch(() => {
                    });
                }else{
                    that.edit.decs.inteConf.showB = false;
                    this.$forceUpdate()
                }
            },
            // 编辑决策按钮点击
            decsEditBefore(decs) {
                let that = this;
                that.edit.dialog = true;
                that.$nextTick(()=>that.$refs['editFrom'].resetFields());
                getDecsById({decsId: decs.decsId, prodId: decs.prodId}).then((res) => {
                    that.$nextTick(() => {
                        that.edit.decs = new DecsBase(res.data.data);
                        let matchHref = that.getMatchHref();
                        this.$forceUpdate()
                        //向前兼容，后续可以删掉
                        if(that.edit.decs.inteConf.percentA === 0 && that.edit.decs.inteConf.percentB === 0){
                            that.edit.decs.inteConf.percentA = 100;
                            this.$forceUpdate()
                            if (isEmpty(matchHref)) {
                                console.warn("当前网址不是*.cmbchina.cn类型");
                                that.edit.decs.inteConf.urlA = `http://${that.edit.decs.decsId.replace(/\_/g, "-")}.tcsdecs.paas.cmbchina.cn`.toLowerCase()
                            } else {
                                that.edit.decs.inteConf.urlA =  `http://${that.edit.decs.decsId.replace(/\_/g, "-")}.tcsdecs.${matchHref[0].split(".")[0]}.cmbchina.cn`.toLowerCase()
                                console.log(that.edit)
                            }

                        }
                        //向前兼容，后续可以删掉
                        if( that.edit.decs.inteConf.showA === false && that.edit.decs.inteConf.showB === false){
                            that.edit.decs.inteConf.showA = true;
                            that.edit.decs.inteConf.showB = false;
                        }
                        if (isEmpty(matchHref)) {
                            console.warn("当前网址不是*.cmbchina.cn类型");
                            that.edit.decs.inteConf.uri = `http://${that.edit.decs.decsId.replace(/\_/g, "-")}.tcsdecs.paas.cmbchina.cn/exec`.toLowerCase()
                        } else {
                            that.edit.decs.inteConf.uri = `http://${that.edit.decs.decsId.replace(/\_/g, "-")}.tcsdecs.${matchHref[0].split(".")[0]}.cmbchina.cn/exec`.toLowerCase()
                            console.log(that.edit)
                        }

                        that.evVarList = [];
                        that.ajKey = getUUID();
                        that.ieKey = getUUID();
                    });
                });
            },

            decsRuleSettingEditClick(decs) {
                this.$router.push({
                    path: this.childrenPath,
                    // query: {decsId: decs.decsId, tab: tabType.decsRuleSetting}
                    query: {decsId: decs.decsId, tab: tabType.decsFlowG6} // 074389 决策设置页面不显示，跳转到G6流程图页面
                });
            },
            decsFlowClick(decs) {
                if(isEmpty(decs.decsVersionRelProperty) || isEmpty(decs.decsVersionRelProperty.decsFrontVersion)){
                    console.log("decs.decsVersionRelProperty 为空")
                }else if (decs.decsVersionRelProperty.decsFrontVersion === 'N') {
                    this.$router.push({
                        path: this.childrenPath,
                        query: {decsId: decs.decsId, tab: tabType.decsFlowG6, prodId: this.gConfig.prodId.value}
                    });
                }else{

                    if(isEmpty(decs.decsVersionRelProperty) || isEmpty(decs.decsVersionRelProperty.decsFrontUrl)){
                        console.log("decs.decsVersionRelProperty.decsFrontUrl 为空")
                    }else{
                        let mountUrl = decs.decsVersionRelProperty.decsFrontUrl;
                        let decsFrontUrl = `${mountUrl}/ui/decsManageNew/decsInf?decsId=${decs.decsId}&tab=${tabType.decsFlowG6}&prodId=${this.gConfig.prodId.value}`;
                        const targetHostName = this.getTargetHostName();
                        console.log("获取postMessage目标地址：" + targetHostName);
                        let event = {flag: "tcsdecsfrontappnewother", decsFrontUrl: decsFrontUrl};
                        window.parent.postMessage(event, targetHostName);
                        //let myWindow = window.open(`${decs.inteConf.mountUrl}/ui/decsManage/decsInf?decsId=${decs.decsId}&tab=decsFlowG6&prodId=${this.gConfig.prodId.value}`,"_blank");
                    }
                }
            },
            decsCodeClick(decs) {
                if(isEmpty(decs.decsVersionRelProperty) || isEmpty(decs.decsVersionRelProperty.decsFrontVersion)){
                    console.log("decs.decsVersionRelProperty 为空")
                }else if (decs.decsVersionRelProperty.decsFrontVersion === 'N') {
                    this.$router.push({
                        path: this.childrenPath,
                        query: {decsId: decs.decsId, tab: tabType.decsCode, prodId: this.gConfig.prodId.value}
                    });
                }else{
                    if(isEmpty(decs.decsVersionRelProperty) || isEmpty(decs.decsVersionRelProperty.decsFrontUrl)){
                        console.log("decs.decsVersionRelProperty.decsFrontUrl 为空")
                    }else{
                        let mountUrl = decs.decsVersionRelProperty.decsFrontUrl;
                        let decsFrontUrl = `${mountUrl}/ui/decsManageNew/decsInf?decsId=${decs.decsId}&tab=${tabType.decsCode}&prodId=${this.gConfig.prodId.value}`;
                        const targetHostName = this.getTargetHostName();
                        console.log("获取postMessage目标地址：" + targetHostName);
                        let event = {flag: "tcsdecsfrontappnewother", decsFrontUrl: decsFrontUrl};
                        window.parent.postMessage(event, targetHostName);
                        //let myWindow = window.open(`${decs.inteConf.mountUrl}/ui/decsManage/decsInf?decsId=${decs.decsId}&tab=decsFlowG6&prodId=${this.gConfig.prodId.value}`,"_blank");
                    }
                }
            },
            decsHisClick(decs) {
                if(isEmpty(decs.decsVersionRelProperty) || isEmpty(decs.decsVersionRelProperty.decsFrontVersion)){
                    console.log("decs.decsVersionRelProperty 为空")
                }else if (decs.decsVersionRelProperty.decsFrontVersion === 'N') {
                    this.$router.push({
                        path: this.childrenPath,
                        query: {decsId: decs.decsId, tab: tabType.decsHis, prodId: this.gConfig.prodId.value}
                    });
                }else{
                    if(isEmpty(decs.decsVersionRelProperty) || isEmpty(decs.decsVersionRelProperty.decsFrontUrl)){
                        console.log("decs.decsVersionRelProperty.decsFrontUrl 为空")
                    }else{
                        let mountUrl = decs.decsVersionRelProperty.decsFrontUrl;
                        let decsFrontUrl = `${mountUrl}/ui/decsManageNew/decsInf?decsId=${decs.decsId}&tab=${tabType.decsHis}&prodId=${this.gConfig.prodId.value}`;
                        const targetHostName = this.getTargetHostName();
                        console.log("获取postMessage目标地址：" + targetHostName);
                        let event = {flag: "tcsdecsfrontappnewother", decsFrontUrl: decsFrontUrl};
                        window.parent.postMessage(event, targetHostName);
                        //let myWindow = window.open(`${decs.inteConf.mountUrl}/ui/decsManage/decsInf?decsId=${decs.decsId}&tab=decsFlowG6&prodId=${this.gConfig.prodId.value}`,"_blank");
                    }
                }

            },
            decsCitationClick(decs) {
                if(isEmpty(decs.decsVersionRelProperty) || isEmpty(decs.decsVersionRelProperty.decsFrontVersion)){
                    console.log("decs.decsVersionRelProperty 为空")
                }else if (decs.decsVersionRelProperty.decsFrontVersion === 'N') {
                    this.$router.push({
                        path: this.childrenPath,
                        query: {decsId: decs.decsId, tab: tabType.decsCitation, prodId: this.gConfig.prodId.value}
                    });
                }else{
                    if(isEmpty(decs.decsVersionRelProperty) || isEmpty(decs.decsVersionRelProperty.decsFrontUrl)){
                        console.log("decs.decsVersionRelProperty.decsFrontUrl 为空")
                    }else{
                        let mountUrl = decs.decsVersionRelProperty.decsFrontUrl;
                        let decsFrontUrl = `${mountUrl}/ui/decsManageNew/decsInf?decsId=${decs.decsId}&tab=${tabType.decsCitation}&prodId=${this.gConfig.prodId.value}`;
                        const targetHostName = this.getTargetHostName();
                        console.log("获取postMessage目标地址：" + targetHostName);
                        let event = {flag: "tcsdecsfrontappnewother", decsFrontUrl: decsFrontUrl};
                        window.parent.postMessage(event, targetHostName);
                        //let myWindow = window.open(`${decs.inteConf.mountUrl}/ui/decsManage/decsInf?decsId=${decs.decsId}&tab=decsFlowG6&prodId=${this.gConfig.prodId.value}`,"_blank");
                    }
                }

            },
            decsVersionClick(decs) {
                if(isEmpty(decs.decsVersionRelProperty) || isEmpty(decs.decsVersionRelProperty.decsFrontVersion)){
                    console.log("decs.decsVersionRelProperty 为空")
                }else if (decs.decsVersionRelProperty.decsFrontVersion === 'N') {
                    this.$router.push({
                        path: this.childrenPath,
                        query: {decsId: decs.decsId, tab: tabType.decsVersion, prodId: this.gConfig.prodId.value}
                    });
                }else{
                    if(isEmpty(decs.decsVersionRelProperty) || isEmpty(decs.decsVersionRelProperty.decsFrontUrl)){
                        console.log("decs.decsVersionRelProperty.decsFrontUrl 为空")
                    }else{
                        let mountUrl = decs.decsVersionRelProperty.decsFrontUrl;
                        let decsFrontUrl = `${mountUrl}/ui/decsManageNew/decsInf?decsId=${decs.decsId}&tab=${tabType.decsVersion}&prodId=${this.gConfig.prodId.value}`;
                        const targetHostName = this.getTargetHostName();
                        console.log("获取postMessage目标地址：" + targetHostName);
                        let event = {flag: "tcsdecsfrontappnewother", decsFrontUrl: decsFrontUrl};
                        window.parent.postMessage(event, targetHostName);
                        //let myWindow = window.open(`${decs.inteConf.mountUrl}/ui/decsManage/decsInf?decsId=${decs.decsId}&tab=decsFlowG6&prodId=${this.gConfig.prodId.value}`,"_blank");
                    }
                }
            },
            decsPreHandleClick(decs) {
                if(isEmpty(decs.decsVersionRelProperty) || isEmpty(decs.decsVersionRelProperty.decsFrontVersion)){
                    console.log("decs.decsVersionRelProperty 为空")
                }else if (decs.decsVersionRelProperty.decsFrontVersion === 'N') {
                    this.$router.push({
                        path: this.childrenPath,
                        query: {decsId: decs.decsId, tab: tabType.decsPreHandleJava, prodId: this.gConfig.prodId.value}
                    });
                }else{
                    if(isEmpty(decs.decsVersionRelProperty) || isEmpty(decs.decsVersionRelProperty.decsFrontUrl)){
                        console.log("decs.decsVersionRelProperty.decsFrontUrl 为空")
                    }else{
                        let mountUrl = decs.decsVersionRelProperty.decsFrontUrl;
                        let decsFrontUrl = `${mountUrl}/ui/decsManageNew/decsInf?decsId=${decs.decsId}&tab=${tabType.decsPreHandleJava}&prodId=${this.gConfig.prodId.value}`;
                        const targetHostName = this.getTargetHostName();
                        console.log("获取postMessage目标地址：" + targetHostName);
                        let event = {flag: "tcsdecsfrontappnewother", decsFrontUrl: decsFrontUrl};
                        window.parent.postMessage(event, targetHostName);
                        //let myWindow = window.open(`${decs.inteConf.mountUrl}/ui/decsManage/decsInf?decsId=${decs.decsId}&tab=decsFlowG6&prodId=${this.gConfig.prodId.value}`,"_blank");
                    }
                }

            },
            connectRuleClick(rule) {
                this.$router.push({
                    path: "/ui/ruleManage/ruleInf",
                    query: {
                        ruleId: rule.ruleId,
                        tab: tabType.ruleFlowG6,
                        routerPath: '/ui/decsManage',
                        prodId: this.gConfig.prodId.value
                    }
                });
            },
            //选择配置版本时，复用两种配置版本的接入方式
            onSelectedReleaseTypeAdd(item) {
                let that = this;
                if (item != 'S' && that.add.decs.inteType === 'J') {
                    that.add.decs.inteType = '';
                }
                if (item === 'S') {
                    if (that.add.decs.inteType != 'J') {
                        let matchHref = this.getMatchHref();
                        let decsIdUrl = this.add.decs.decsId.replace(/_/g, '-');
                        if (isEmpty(matchHref)) {
                            console.warn("当前网址不是*.cmbchina.cn类型");
                            this.add.decs.inteConf.mountUrl = `http://${decsIdUrl}.tcsdecs.paas.cmbchina.cn`.toLowerCase()
                        } else {
                            this.add.decs.inteConf.mountUrl = `http://${decsIdUrl}.tcsdecs.${matchHref[0].split(".")[0]}.cmbchina.cn`.toLowerCase()
                        }
                    }
                }
            },
            onSelectedReleaseTypeList() {
                let that = this;
                that.releaseTypeList = [];
                getAllDecsVersionRel().then(res => {
                    that.releaseTypeList.push({
                        value: 'N',
                        label: '测试版本'
                    });
                    res.data.data.forEach(item =>{
                        that.releaseTypeList.push({
                            value: item.decsFrontVersion,
                            label: item.decsFrontVersion,
                            decsVersionRelProperty: item
                        });
                    });

                }).finally(res => {
                })
            },
           onSelectedReleaseTypeAddAfter(release) {
                let that = this;
                if(release != 'N'){
                    that.releaseTypeList.forEach(item =>{
                        if(item.value === release){
                            that.add.decs.decsVersionRelProperty = item.decsVersionRelProperty;
                        }
                    });
                }else{
                    that.add.decs.decsVersionRelProperty = new DecsVersionRel();
                    that.add.decs.decsVersionRelProperty.decsFrontVersion = 'N';
                }

            },
            onSelectedReleaseTypeEditAfter(release) {
                let that = this;
                if(release != 'N'){
                    that.releaseTypeList.forEach(item =>{
                        if(item.value === release){
                            that.edit.decs.decsVersionRelProperty = item.decsVersionRelProperty;
                        }
                    });
                }else{
                    that.edit.decs.decsVersionRelProperty = new DecsVersionRel();
                    that.edit.decs.decsVersionRelProperty.decsFrontVersion = 'N';
                }

            },
            //选择配置版本时，复用两种配置版本的接入方式
            onSelectedReleaseTypeEdit(item) {
                let that = this;
                if (item != 'S' && that.edit.decs.inteType === 'J') {
                    that.edit.decs.inteType = '';
                }

                if (item === 'S') {
                    if (that.edit.decs.inteType != 'J') {
                        that.edit.decs.inteConf.mountUrl = '';
                        let matchHref = this.getMatchHref();
                        let decsIdUrl = this.edit.decs.decsId.replace(/_/g, '-');
                        if (isEmpty(matchHref)) {
                            console.warn("当前网址不是*.cmbchina.cn类型");
                            this.edit.decs.inteConf.mountUrl = `http://${decsIdUrl}.tcsdecs.paas.cmbchina.cn`.toLowerCase()
                        } else {
                            this.edit.decs.inteConf.mountUrl = `http://${decsIdUrl}.tcsdecs.${matchHref[0].split(".")[0]}.cmbchina.cn`.toLowerCase()
                        }
                    }
                }
            },
            //选择接入类型时，给mountURL配置默认参数
            onSelectedInteTypeAdd(releaseType, inteType) {
                let that = this;
                if (releaseType === 'S') {
                    if (inteType != 'J') {
                        let matchHref = this.getMatchHref();
                        let decsIdUrl = this.add.decs.decsId.replace(/_/g, '-');
                        if (isEmpty(matchHref)) {
                            console.warn("当前网址不是*.cmbchina.cn类型");
                            this.add.decs.inteConf.mountUrl = `http://${decsIdUrl}.tcsdecs.paas.cmbchina.cn`.toLowerCase()
                        } else {
                            this.add.decs.inteConf.mountUrl = `http://${decsIdUrl}.tcsdecs.${matchHref[0].split(".")[0]}.cmbchina.cn`.toLowerCase()
                        }
                    }
                }
            },
            getTargetHostName() {
                //本地
                if (window.location.href.indexOf('local') !== -1) {
                    return 'http://tcs.local.cmbchina.cn:9000';
                }else{
                    //return window.location.origin;
                    let matchHref = this.getMatchHref();
                    if (isEmpty(matchHref)) {
                        console.warn("当前网址不是*.cmbchina.cn类型");
                        return 'http://tcs.paas.cmbchina.cn';
                    } else {
                        return `http://tcs.${matchHref[0].split(".")[0]}.cmbchina.cn`;
                    }
                }
            },

            //选择接入类型时，给mountURL配置默认参数
            onSelectedInteTypeEdit(releaseType, inteType) {
                let that = this;

                if (releaseType === 'S') {
                    if (inteType === 'J') {
                        that.edit.decs.inteConf.mountUrl = '';
                    } else {
                        let matchHref = this.getMatchHref();
                        let decsIdUrl = this.edit.decs.decsId.replace(/_/g, '-');
                        if (isEmpty(matchHref)) {
                            console.warn("当前网址不是*.cmbchina.cn类型");
                            this.edit.decs.inteConf.mountUrl = `http://${decsIdUrl}.tcsdecs.paas.cmbchina.cn`.toLowerCase()
                        } else {
                            this.edit.decs.inteConf.mountUrl = `http://${decsIdUrl}.tcsdecs.${matchHref[0].split(".")[0]}.cmbchina.cn`.toLowerCase()
                        }
                    }
                }
            },


        },
    }
</script>

<style scoped>
    .table {
        height: 100%;
        padding: 0 10px 0 10px;
        background-image: url('~@/assets/bg4.png');
        background-size: 100% 100%;
    }
    .el-dropdown {
        vertical-align: top;
    }
    .el-dropdown + .el-dropdown {
        margin-left: 15px;
    }
    .tag-span{
        width: 25%;
    }

    .el-cascader-menu__wrap {
        height: 204px;
    }
</style>
