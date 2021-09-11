// 对应于数据库中的定时器基础表的实体类

import {isEmpty} from "../../utils";

export class ProdmanageBase {
    constructor(data){
        if (data === undefined) data = {};
        this.id = data['id'];                           // 自增id
        this.ystId = data['ystId'];                     // 一事通Id
        this.prodId = data['prodId'];                   // 产品Id
        this.prodList = isEmpty(data["prodList"]) ? [] : data['prodList']; // 产品Id List
        this.ystName = data['ystName'];                 // 一事通名字
        this.createUser = data['createUser'];               //  创建者
        this.createTime = data['createTime'];               //  创建时间
        this.updateUser = data['updateUser'];               //  修改者
        this.updateTime = data['updateTime'];               //  修改时间
        this.userRole = data['userRole'];               // 用户角色
    }
}

