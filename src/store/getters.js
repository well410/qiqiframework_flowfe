import subAppUrl from "./modules/sub-app-urls";

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  eventSourceOa: state => state.subAppUrl.eventSource.oa,
  eventSourceBiz: state => state.subAppUrl.eventSource.biz,
  componentOa: state => state.subAppUrl.component.oa,
  componentBiz: state => state.subAppUrl.component.biz,
  decisionsOa: state => state.subAppUrl.decisions.oa,
  decisionsBiz: state => state.subAppUrl.decisions.biz,
  functionsOa: state => state.subAppUrl.functions.oa,
  functionsBiz: state => state.subAppUrl.functions.biz,
  tqsDatasourceOa: state => state.subAppUrl.tqsDatasource.oa,
  tqsDatasourceBiz: state => state.subAppUrl.tqsDatasource.biz,
  variablesOa: state => state.subAppUrl.variables.oa,
  variablesBiz: state => state.subAppUrl.variables.biz,
  timerOa: state => state.subAppUrl.timeFront.oa,
  timerBiz: state => state.subAppUrl.timeFront.biz,
  fileOa: state => state.subAppUrl.fileFront.oa,
  fileBiz: state => state.subAppUrl.fileFront.biz,

  apprOa: state => state.subAppUrl.apprFront.oa,
  apprBiz: state => state.subAppUrl.apprFront.biz,

  prodOa: state => state.subAppUrl.prodFront.oa,
  prodBiz: state => state.subAppUrl.prodFront.biz,

  dataOa: state => state.subAppUrl.dataFront.oa,
  dataBiz: state => state.subAppUrl.dataFront.biz,

  logOa: state => state.subAppUrl.logFront.oa,
  logBiz: state => state.subAppUrl.logFront.biz,

  monitorOa: state => state.subAppUrl.monitorFront.oa,
  monitorBiz: state => state.subAppUrl.monitorFront.biz,

  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,


  // message 模块
  messageUnreadCount: state => state.message.messageUnreadList.length,
  messageReadedCount: state => state.message.messageReadedList.length,
  messageTrashCount: state => state.message.messageTrashList.length,
  curMessageUnreadCount: state => state.message.unreadCount


}
export default getters
