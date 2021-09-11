import {warningTip, isEmpty} from "../../utils/tools";
import {statusTypeConstants} from "../../constants/status-type";

/**
 * 校验勾选的上线组件
 * */
export const checkOnlineSelectedCmptVersionList = function (selectedCmptVersionList) {
    if (isEmpty(selectedCmptVersionList) || selectedCmptVersionList.length === 0) {
        warningTip('没有勾选中任何对象！');
        return false;
    }
    let failList = [];
    for (let i = 0; i < selectedCmptVersionList.length; i++) {
        let cmptVersion = selectedCmptVersionList[i];
        if (statusTypeConstants.ACTIVATE.value === cmptVersion.status) {
            failList.push(cmptVersion.cmptVersion);
        }
    }
    if (failList.length > 0) {
        warningTip('版本号为' + failList.join(',') + '的组件在当前状态不允许上线');
        return false;
    }
    return true;
};

/**
 * 校验勾选的下线组件
 * */
export const checkOfflineSelectedCmptVersionList = function (selectedCmptVersionList) {
    if (isEmpty(selectedCmptVersionList) || selectedCmptVersionList.length === 0) {
        warningTip('没有勾选中任何对象！');
        return false;
    }
    let failList = [];
    for (let i = 0; i < selectedCmptVersionList.length; i++) {
        let cmptVersion = selectedCmptVersionList[i];
        if (statusTypeConstants.DEACTIVATE.value === cmptVersion.status) {
            failList.push(cmptVersion.cmptVersion);
        }
    }
    if (failList.length > 0) {
        warningTip('版本号为' + failList.join(',') + '的组件在当前状态不允许下线');
        return false;
    }
    return true;
};

/**
 * 路由
 * */
export const historyPathStore = {
    historyPath: '',
    setHistoryPath (newValue) {
        this.historyPath = newValue
    },
    getHistoryPath () {
        return this.historyPath
    }
};
