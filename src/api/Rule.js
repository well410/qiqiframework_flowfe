import axios from "../libs/api.request";
import {DroolsTestReqDto} from "../entity/decs";
import {testEnums} from "../entity/enumns";


export const updateDroolsGroupList = ({prodId, ruleId, versionId, droolsGroupList}) =>{
    let str = `/decs/${prodId}/rule/${ruleId}/version/${versionId}/droolsGroupList`;
    return axios.request({url: str, method: 'put', data : droolsGroupList});
};

export const getDroolsGroupList = ({prodId, ruleId, versionId}) => {
    let str = `/decs/${prodId}/rule/${ruleId}/version/${versionId}/droolsGroupList`;
    return axios.request({url: str, method: 'get'});
};


// 获取详细信息
export const getRuleDetail = ({prodId, ruleId, versionId}) =>{
    if (versionId === '' || versionId === undefined || versionId === null) {
        let str = `/decs/${prodId}/rule/${ruleId}`;
        return axios.request({url: str, method: 'get'});
    } else {
        let str = `/decs/${prodId}/rule/${ruleId}/version/${versionId}`;
        return axios.request({url: str, method: 'get'});
    }
};

//发布规则
export const publishRule = ({prodId, ruleId}) => {
    let str = `/decs/${prodId}/publishRule/${ruleId}`;
    return axios.request({url: str, method: 'post'})
};

// 删除规则版本
export const deleteRuleVersion = ({prodId, ruleId, versionId}) => {
    let str = `/decs/${prodId}/rule/${ruleId}/version/${versionId}`;
    return axios.request({url: str, method: 'delete'})
};

// 删除规则
export const deleteRule = ({prodId, ruleId}) => {
    let str = `decs/${prodId}/rule/${ruleId}`;
    return axios.request({url: str, method: 'delete'})
};

// 校验规则
export const checkRule = ({prodId, ruleId}) => {
    let str = `decs/${prodId}/rule/${ruleId}/check`;
    return axios.request({url: str, method: 'post', data: {}})
};

// 测试规则
export const testRuleVersion = ({prodId, req, ruleId, versionId}) => {
    let str = `decs/${prodId}/rule/${ruleId}/version/${versionId}/test`;
    return axios.request({url: str, method: 'post', data: new DroolsTestReqDto(testEnums.DEFAULT.code, req)})
};

// 测试规则中的某个版本
export const testRule = ({prodId, req,  ruleId}) => {
    let str = `decs/${prodId}/rule/${ruleId}/test`;
    return axios.request({url: str, method: 'post', data: new DroolsTestReqDto(testEnums.DEFAULT.code, req)})
};

// 规则单节点测试
export const testRuleOneNode = ({req, drlCode, prodId, ruleId}) =>{
    let str = `decs/${prodId}/rule/${ruleId}/testOneNode`;
    return axios.request({url: str, method: 'post', data: new DroolsTestReqDto(testEnums.ONE_NODE.code, req, drlCode)})
};


// 修改规则
export const updateRuleBase = ({ruleUpdateDto, prodId, ruleId}) => {
    let str = `/decs/${prodId}/rule/${ruleId}`;
    return axios.request({url: str, method: 'put', data: ruleUpdateDto})
};

// 修改规则
export const updateRuleBaseWithAdapter = ({adapterRuleUpdateDto, prodId, ruleId}) => {
    let str = `/decs/${prodId}/ruleWithAdapter/${ruleId}`;
    return axios.request({url: str, method: 'put', data: adapterRuleUpdateDto})
};


// 添加规则
export const addRuleBase = ({ruleBase, prodId}) => {
    let str = `/decs/${prodId}/rule`;
    return axios.request({url: str, method: 'post', data: ruleBase})
};

// 添加规则
export const addRuleBaseWithAdapter = ({ruleBaseWithVars, prodId,nodeId}) => {
    let str = `/decs/${prodId}/ruleWithAdapter/${nodeId}`;
    return axios.request({url: str, method: 'post', data: ruleBaseWithVars})
};

// 查询当前规则的所有版本
export const getTotalRuleVersionList = ({prodId, ruleId})=>{
    let str = `/decs/${prodId}/rule/${ruleId}/version`;
    return axios.request({url: str, method: 'get'})
};


// 规则分页查询
export const getRuleList = ({prodId, pageNum, pageSize, ruleFilter}) => {
    let str = `/decs/${prodId}/queryRule/${pageNum}/${pageSize}`;
    return axios.request({url: str, method: 'post', data: ruleFilter})
};

// 规则分页查询-包含关联变量信息
export const queryRuleAndVarList = ({prodId, pageNum, pageSize, ruleFilter}) => {
    let str = `/decs/${prodId}/queryRule/varRel/${pageNum}/${pageSize}`;
    return axios.request({url: str, method: 'post', data: ruleFilter})
};

// 规则分页查询及分页查询-引用数量
export const queryRuleAndCiteCount = ({prodId, pageNum, pageSize, ruleFilter}) => {
    let str = `/decs/${prodId}/queryRuleAndCiteCount/${pageNum}/${pageSize}`;
    return axios.request({url: str, method: 'post', data: ruleFilter})
};

export const queryRuleCiteCount = ({prodId, ruleList}) => {
    let str = `/decs/${prodId}/rule/citeCount`;
    return axios.request({url: str, method: 'post', data: ruleList})
};

// 规则历史分页查询
export const getRuleHistoryList = ({prodId, ruleId, pageNum, pageSize, ruleFilter}) => {
    let str = `/decs/${prodId}/rule/${ruleId}/history/query/${pageNum}/${pageSize}`;
    return axios.request({url: str, method: 'post', data: ruleFilter})
};

// 规则版本分页查询
export const getRuleVersionList = ({prodId, ruleId, pageNum, pageSize, ruleFilter}) => {
    let str = `/decs/${prodId}/rule/${ruleId}/version/query/${pageNum}/${pageSize}`;
    return axios.request({url: str, method: 'post', data: ruleFilter})
};
/*// 规则引用关系展示---shan
export const queryRuleCitation = ({prodId, ruleId, ruleFilter}) => {
    let str = `/decs/${prodId}/rule/${ruleId}/citationQuery`;
    return axios.request({url: str, method: 'post', data: ruleFilter})
};*/

export const queryRuleAllVersionCitation=({prodId, ruleId, pageNum, pageSize}) => {
    let str = `/decs/${prodId}/rule/${ruleId}/versionCiteCountQuery/${pageNum}/${pageSize}`;
    return axios.request({url: str, method: 'post'})
};

export const queryRuleVersionCitation=({prodId, ruleId, ruleVersion}) => {
    let str = `/decs/${prodId}/rule/${ruleId}/${ruleVersion}/citationQuery`;
    return axios.request({url: str, method: 'post'})
};

// 获取所有规则
export const getRuleBaseTotal = ({prodId}) => {
    let str = `/decs/${prodId}/queryRuleBase/`;
    return axios.request({url: str, method: 'get'})
};

// 根据id获取规则
export const getRuleById = ({prodId, ruleId}) => {
    let str = `/decs/${prodId}/rule/${ruleId}`;
    return axios.request({url: str, method: 'get'})
};


// 上线规则
export const onlineRuleVersion = (prodId, ruleId, ruleVersion) => {
    return axios.request({
        url: '/decs/' + prodId + '/rule/' + ruleId + '/version/' + ruleVersion + '/online',
        method: 'get'
    })
};

// 下线规则
export const offlineRuleVersion = (prodId, ruleId, ruleVersion) => {
    return axios.request({
        url: '/decs/' + prodId + '/rule/' + ruleId + '/version/' + ruleVersion + '/offline',
        method: 'get'
    })
};

// 通过数据源ID查询
export const getDatasourceById = ({prodId, datasourceId})=>{
    let str = `/vars/${prodId}/datasource/${datasourceId}`;
    return axios.request({url:str, method:'get'})
};
