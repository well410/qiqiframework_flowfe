import axios from "../libs/api.request";


// 获取用户未读信息
export const getAllProdId = () => {
    let str = `/prod/queryAllProdId`;
    return axios.request({url:str, method:'get'})
};

export const getDmsBaseUrl = () => {
    return axios.request({url: `/decs/dms/baseUrl`, method: 'get'})
};

export const copyTemplate = ({prodId, templateId, templateVersion}) => {
    return axios.request({
        url: `/decs/${prodId}/template/${templateId}/copy`,
        method: 'post',
        data: templateVersion
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
export const getRuleListByTemplateId = ({prodId, templateId}) => {
    return axios.request({
        url: `/decs/${prodId}/templateRuleRel/rule/list/${templateId}`,
        method: 'get'
    })
};

export const deleteTemplateVersion = (template) => {
    return axios.request({
        url: `/decs/${template.prodId}/template/${template.templateId}/version/${template.templateVersion}`,
        method: 'delete'
    })
};

export const deleteTemplate = ({prodId, templateId}) => {
    return axios.request({
        url: `/decs/${prodId}/template/${templateId}`,
        method: 'delete'
    })
};


// 上线决策
export const onlineTemplateVersion = ({prodId, templateId, versionId}) => {
    return axios.request({
        url: `/decs/${prodId}/template/${templateId}/version/${versionId}/online`,
        method: 'get'
    })
};

// 验证决策关联
export const checkRel = ({prodId, templateId, versionId}) => {
    return axios.request({
        url: `/decs/${prodId}/template/${templateId}/version/${versionId}/checkRel`,
        method: 'get'
    })
};


// 下线决策（弃用，下线决策应用也不会下线）
export const offlineTemplateVersion = ({prodId, templateId, versionId}) => {
    return axios.request({
        url: `/decs/${prodId}/template/${templateId}/version/${versionId}/offline`,
        method: 'get'
    })
};


//发布决策
export const publishTemplate = ({prodId, templateId}) => {
    let str = `/decs/${prodId}/template/publish/${templateId}`;
    return axios.request({url: str, method: 'post'})
};


// 校验决策
export const checkTemplate = ({prodId, templateId}) => {

    let str = `template/${prodId}/template/${templateId}/check`;
    return axios.request({url: str, method: 'post', data: {}})
};

// 测试前置处理
export const testPreHandleJava = ({req, prodId, templateId}) => {
    let str = `/decs/${prodId}/template/${templateId}/test/preHandleJava`;
    return axios.request({url: str, method: 'post', data: req})
};

// 测试决策
export const testTemplate = ({req, prodId, templateId}) => {
    let str = `/decs/${prodId}/template/${templateId}/test`;
    return axios.request({url: str, method: 'post', data: req})
};

// 测试决策
export const testTemplateVersion = ({req, prodId, templateId, versionId}) => {
    let str = `/decs/${prodId}/template/${templateId}/version/${versionId}/test`;
    return axios.request({url: str, method: 'post', data: req})
};

// 得到某个决策的引用
export const getTemplateRuleList = ({prodId, templateId}) => {
    let str = `/decs/${prodId}/templateRuleRel/${templateId}`;
    return axios.request({url: str, method: 'get'})
};

// 修改某个决策信息
export const updateTemplate = ({prodId, templateId, templateBase}) => {
    let str = `/decs/${prodId}/template/${templateId}`;
    return axios.request({url: str, method: 'put', data: templateBase})
};

// 添加决策
export const addTemplate = ({template, prodId}) => {
    let str = `/decs/${prodId}/template`;
    return axios.request({url: str, method: 'post', data: template})
};

// 获取决策
export const getTemplateById = ({prodId, templateId}) => {
    let str = `/decs/${prodId}/template/${templateId}`;
    return axios.request({url: str, method: 'get'})
};
// 获取决策
export const getTemplateByDecsId = ({prodId, decsId}) => {
    let str = `/decs/${prodId}/queryTemplateBydecs/${decsId}`;
    return axios.request({url: str, method: 'get'})
};

// 分页查询决策
export const getTemplateList = ({prodId, pageNum, pageSize, templateBase}) => {
    let str = `/decs/${prodId}/queryTemplate/${pageNum}/${pageSize}`;
    return axios.request({url: str, method: 'post', data: templateBase})
};

// 决策历史分页查询
export const getTemplateHistoryList = ({prodId, templateId, pageNum, pageSize, templateHistory}) => {
    let str = `/decs/${prodId}/template/${templateId}/history/query/${pageNum}/${pageSize}`;
    return axios.request({url: str, method: 'post', data: templateHistory})
};

// 决策版本分页查询
export const getTemplateVersionList = ({prodId, templateId, pageNum, pageSize, templateFilter}) => {
    let str = `/decs/${prodId}/template/${templateId}/version/query/${pageNum}/${pageSize}`;
    return axios.request({url: str, method: 'post', data: templateFilter})
};

// 通过适配页面修改验证发布某个决策信息
export const savePublishDecsByTemplate = ({prodId, decsId, decsUpdateDto}) => {
    let str = `/decs/${prodId}/savePublishDecsByTemplate/${decsId}`;
    return axios.request({url: str, method: 'put', data: decsUpdateDto})
};
// 通过适配页面修改验证发布某个决策信息
export const savePublishDecsByAdapter = ({prodId, decsId, decsUpdateDto}) => {
    let str = `/decs/${prodId}/savePublishRuleDecsByAdapter/${decsId}`;
    return axios.request({url: str, method: 'put', data: decsUpdateDto,headers:{'Content-Type': 'application/json'}})
};
// 通过适配页面修改验证发布某个决策信息
export const handleRuleVersionInDecsByAdapter = ({prodId, decsId, adapterDecsBaseDto,nodeUniqueName}) => {
    let str = `/decs/${prodId}/handleRuleVersionInDecsByAdapter/${decsId}/${nodeUniqueName}`;
    return axios.request({url: str, method: 'put', data: adapterDecsBaseDto,headers:{'Content-Type': 'application/json'}})
};

// 分页查询决策及对应规则列表
export const queryTemplateAndRuleList = ({prodId, pageNum, pageSize, templateFilter}) => {
    let str = `/decs/${prodId}/templateListRuleRel/rule/list/${pageNum}/${pageSize}`;
    return axios.request({url: str, method: 'post', data: templateFilter})
};

// 分页查询决策及引用关系列表
export const queryTemplateAndCiteCount = ({prodId, pageNum, pageSize, templateFilter}) => {
    let str = `/decs/${prodId}/templateListAndCiteCount/${pageNum}/${pageSize}`;
    return axios.request({url: str, method: 'post', data: templateFilter})
};

export const queryTemplateCitation=({prodId,templateId,templateFilter})=>{
    let str = `/decs/${prodId}/template/${templateId}/citationQuery`;
    return axios.request({url: str, method: 'post', data: templateFilter})
};


// health check
export const healthCheck = (mountUrl) => {
    let str = `${mountUrl}/api/template/health`;
    return axios.request({url: str, method: 'get'})
};
