import axios from "../libs/api.request";


export const getDmsBaseUrl = () => {
    return axios.request({url: `/decs/dms/baseUrl`, method: 'get'})
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

export const deleteDecs = ({prodId, decsId}) => {
    return axios.request({
        url: `/decs/${prodId}/decs/${decsId}`,
        method: 'delete'
    })
};


// 上线决策
export const onlineDecsVersion = ({prodId, decsId, versionId}) => {
    return axios.request({
        url: `/decs/${prodId}/decs/${decsId}/version/${versionId}/online`,
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


// 下线决策（弃用，下线决策应用也不会下线）
export const offlineDecsVersion = ({prodId, decsId, versionId}) => {
    return axios.request({
        url: `/decs/${prodId}/decs/${decsId}/version/${versionId}/offline`,
        method: 'get'
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

// 测试决策
export const testDecs = ({req, prodId, decsId}) => {
    let str = `decs/${prodId}/decs/${decsId}/test`;
    return axios.request({url: str, method: 'post', data: req})
};

// 测试决策
export const testDecsVersion = ({req, prodId, decsId, versionId}) => {
    let str = `decs/${prodId}/decs/${decsId}/version/${versionId}/test`;
    return axios.request({url: str, method: 'post', data: req})
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
export const queryDecsWithTemplate = ({prodId, pageNum, pageSize, decsFilter}) => {
    let str = `/decs/${prodId}/decsWithTemplate/${pageNum}/${pageSize}`;
    return axios.request({url: str, method: 'post', data: decsFilter})
};


// 规则分页查询及分页查询-引用数量
export const queryRuleAndCiteCountWithDecs = ({decsId,prodId, pageNum,nodeId, pageSize, ruleFilter}) => {
    let str = `/decs/${prodId}/${decsId}/${nodeId}/queryRuleAndCiteCountWithDecs/${pageNum}/${pageSize}`;
    return axios.request({url: str, method: 'post', data: ruleFilter})
};


// 删除规则
export const deleteRuleWithAdapter = ({prodId, ruleId,decsId,adapterDecsBaseDto}) => {
    let str = `decs/${prodId}/ruleWithAdapter/${decsId}/${ruleId}`;
    return axios.request({url: str, method: 'delete',data: adapterDecsBaseDto,headers:{'Content-Type': 'application/json'}})
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
export const importDecsVersion = ({prodId, decsId, versionId, decsImportDto}) => {
    let str = `/decs/${prodId}/decs/${decsId}/import/`;
    return axios.request({url: str, method: 'post', data: decsImportDto})    
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

