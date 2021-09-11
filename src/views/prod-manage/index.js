
// 定时器过滤
export class TimerFilter {
    constructor(data) {
        if (data === undefined) data = {};
        this.timerId = data['timerId'];
        this.timerName = data['timerName'];
        this.timerStatus = data['timerStatus'];
    }
}

// 产品管理信息过滤
export class ProdmanageFilter {
    constructor(data) {
        if (data === undefined) data = {};
        this.prodId = data['prodId'];
        this.ystId = data['ystId'];
        this.ystName = data['ystName'];
    }
}
// 产品管理信息过滤-模糊匹配
export class FuzzyProdmanageFilter {
    constructor(data) {
        if (data === undefined) data = {};
        this.prodId = data['searchCon'];
        this.ystId = data['searchCon'];
        this.ystName = data['searchCon'];
    }
}

export const prodmanageUserRoleEnums = {
    'M': {code: 'M', name: "管理员"},
    'O': {code: 'O', name: "其他"},
}


