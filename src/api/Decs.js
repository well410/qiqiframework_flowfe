import axios from "../libs/api.request";
import {testEnums} from "../entity/enumns";
import {DroolsTestReqDto} from "../entity/decs";

// 获取当前决策所有版本
export const getTotalDecsVersionList = ({prodId, decsId})=>{
    return axios.request({url: `/decs/${prodId}/decs/${decsId}/version`, method: 'get'})
};

export const getDmsBaseUrl = () => {
    return axios.request({url: `/decs/dms/baseUrl`, method: 'get'})
};

export const getMonitorUrl = () => {
    return axios.request({url: `/decs/tcsMonitor/baseUrl`, method: 'get'})
};

export const copyDecs = ({prodId, decsId, decsVersion}) => {
    return axios.request({
        url: `/decs/${prodId}/decs/${decsId}/copy`,
        method: 'post',
        data: decsVersion
    })
};

// 根据规则id的list获取所有的版本信息
export const getRuleListVersionList = ({prodId, ruleIdList}) => {
    return axios.request({
        url: `/decs/${prodId}/rule/list/version`,
        method: 'post',
        data: ruleIdList
    })
};

// 根据决策id获取关联的规则
export const getRuleListByDecsId = ({prodId, decsId}) => {
    return axios.request({
        url: `/decs/${prodId}/decsRuleRel/rule/list/${decsId}`,
        method: 'get'
    })
};

export const deleteDecsVersion = ({prodId, decsId, versionId}) => {
    return axios.request({
        url: `/decs/${prodId}/decs/${decsId}/version/${versionId}`,
        method: 'delete'
    })
};

export const deleteDecs = ({prodId, decsId}) => {
    return axios.request({
        url: `/decs/${prodId}/decs/${decsId}`,
        method: 'delete'
    })
};


// 上线决策
export const onlineDecsVersion = ({prodId, decsId, versionId, status}) => {
    return axios.request({
        url: `/decs/${prodId}/decs/${decsId}/version/${versionId}/online/${status}`,
        method: 'get'
    })
};


// 验证决策关联
export const checkRel = ({prodId, decsId, versionId}) => {
    return axios.request({
        url: `/decs/${prodId}/decs/${decsId}/version/${versionId}/checkRel`,
        method: 'get'
    })
};

// 修改决策结果
export const updateResultConfig = ({decsVersion}) => {
    return axios.request({
        url: `/decs/${decsVersion.prodId}/decs/${decsVersion.decsId}/version/${decsVersion.decsVersion}/resultConfig`,
        method: 'post',
        data: decsVersion
    })
};


//发布决策
export const publishDecs = ({prodId, decsId}) => {
    let str = `/decs/${prodId}/decs/publish/${decsId}`;
    return axios.request({url: str, method: 'post'})
};


// 校验决策
export const checkDecs = ({prodId, decsId}) => {
    let str = `decs/${prodId}/decs/${decsId}/check`;
    return axios.request({url: str, method: 'post', data: {}})
};

// 测试前置处理
export const testPreHandleJava = ({req, prodId, decsId}) => {
    let str = `decs/${prodId}/decs/${decsId}/test/preHandleJava`;
    return axios.request({url: str, method: 'post', data: req})
};

// 决策单节点测试
export const testDecsOneNode = ({req, drlCode, prodId, decsId}) =>{
    let str = `decs/${prodId}/decs/${decsId}/testOneNode`;
    return axios.request({url: str, method: 'post', data: new DroolsTestReqDto(testEnums.ONE_NODE.code, req, drlCode)})
};

// 测试决策
export const testDecs = ({req, jsonSchema, prodId, decsId}) => {
    let str = `decs/${prodId}/decs/${decsId}/test`;
    return axios.request({url: str, method: 'post', data: new DroolsTestReqDto(testEnums.DEFAULT.code, req, '', jsonSchema)})
};

// 测试决策
export const testDecsVersion = ({req, jsonSchema, prodId, decsId, versionId}) => {
    let str = `decs/${prodId}/decs/${decsId}/version/${versionId}/test`;
    return axios.request({url: str, method: 'post', data: new DroolsTestReqDto(testEnums.DEFAULT.code, req, '', jsonSchema)})
};

// 得到某个决策的引用
export const getDecsRuleList = ({prodId, decsId}) => {
    let str = `/decs/${prodId}/decsRuleRel/${decsId}`;
    return axios.request({url: str, method: 'get'})
};

// 修改某个决策信息
export const updateDecs = ({prodId, decsId, decsUpdateDto}) => {
    let str = `/decs/${prodId}/decs/${decsId}`;
    return axios.request({url: str, method: 'put', data: decsUpdateDto})
};


// 添加决策
export const addDecs = ({decs, prodId}) => {
    let str = `/decs/${prodId}/decs`;
    return axios.request({url: str, method: 'post', data: decs})
};
// 通过模板添加决策
export const addDecsByTemplate = ({decs, prodId,templateId}) => {
    let str = `/decs/${prodId}/addDecsByTemplate/${templateId}`;
    return axios.request({url: str, method: 'post', data: decs})
};

// 获取决策
export const getDecsById = ({prodId, decsId}) => {
    let str = `/decs/${prodId}/decs/${decsId}`;
    return axios.request({url: str, method: 'get'})
};
// 获取决策
export const getDecsVersionActive = ({prodId, decsId}) => {
    let str = `/decs/${prodId}/decs/${decsId}/activeVersion`;
    return axios.request({url: str, method: 'get'})
};

export const getDecsVersionById = ({prodId, decsId, versionId}) =>{
    let str = `/decs/${prodId}/decs/${decsId}/version/${versionId}`;
    return axios.request({url: str, method: 'get'})
};

export const queryDecsTotal = ({prodId, decsFilter}) => {
    let str = `/decs/${prodId}/queryDecs`;
    return axios.request({url: str, method: 'post', data: decsFilter})
};

// 分页查询决策
export const getDecsList = ({prodId, pageNum, pageSize, decsFilter}) => {
    let str = `/decs/${prodId}/queryDecs/${pageNum}/${pageSize}`;
    return axios.request({url: str, method: 'post', data: decsFilter})
};

// 决策历史分页查询
export const getDecsHistoryList = ({prodId, decsId, pageNum, pageSize, decsFilter}) => {
    let str = `/decs/${prodId}/decs/${decsId}/history/query/${pageNum}/${pageSize}`;
    return axios.request({url: str, method: 'post', data: decsFilter})
};

// 决策版本分页查询
export const getDecsVersionList = ({prodId, decsId, pageNum, pageSize, decsFilter}) => {
    let str = `/decs/${prodId}/decs/${decsId}/version/query/${pageNum}/${pageSize}`;
    return axios.request({url: str, method: 'post', data: decsFilter})
};

// 分页查询决策及对应规则列表
export const queryDecsAndRuleList = ({prodId, pageNum, pageSize, decsFilter}) => {
    let str = `/decs/${prodId}/decsListRuleRel/rule/list/${pageNum}/${pageSize}`;
    return axios.request({url: str, method: 'post', data: decsFilter})
};

// 分页查询决策及引用关系数量
export const queryDecsAndCiteCount = ({prodId, pageNum, pageSize, decsFilter}) => {
    let str = `/decs/${prodId}/decsListAndCiteCount/${pageNum}/${pageSize}`;
    return axios.request({url: str, method: 'post', data: decsFilter})
};

export const queryDecsCiteCount = ({prodId, decsList}) => {
    let str = `/decs/${prodId}/decs/citeCount`;
    return axios.request({url: str, method: 'post', data: decsList})
};


//决策引用关系展示
export const queryDecsCitation=({prodId,decsId,decsFilter})=>{
    let str = `/decs/${prodId}/decs/${decsId}/citationQuery`;
    return axios.request({url: str, method: 'post', data: decsFilter})
};


export const queryDecsAllVersionCitation=({prodId, decsId, pageNum, pageSize}) => {
    let str = `/decs/${prodId}/decs/${decsId}/versionCiteCountQuery/${pageNum}/${pageSize}`;
    return axios.request({url: str, method: 'post'})
};

export const queryDecsVersionCitation=({prodId, decsId, decsVersion}) => {
    let str = `/decs/${prodId}/decs/${decsId}/${decsVersion}/citationQuery`;
    return axios.request({url: str, method: 'post'})
};
//导出决策
export const exportDecsVersion = ({prodId, decsId, versionId}) => {
    let str = `/decs/${prodId}/decs/${decsId}/version/${versionId}/export/`;
    return axios.request({url: str, method: 'get'})
};
//导入决策
export const importDecsVersion = ({prodId, decsId, versionId, decsBackupDto}) => {
    let str = `/decs/${prodId}/decs/${decsId}/import/`;
    return axios.request({url: str, method: 'post', data: decsBackupDto})
};

// health check
export const getTemplateIdList = ({prodId}) => {
    let str = `/decs/${prodId}/template/getTemplateIdList`;
    return axios.request({url: str, method: 'get'})
};
// health check
export const healthCheck = (mountUrl) => {
    let str = `${mountUrl}/api/decs/health`;
    return axios.request({url: str, method: 'get'})
};


