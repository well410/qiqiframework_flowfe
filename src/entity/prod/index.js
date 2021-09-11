export class Prod {
    constructor(data){
        if (data === undefined) data = {};
        this.id = data['id'];
        this.prodId = data['prodId'];
        this.prodName = data['prodName'];
        this.prodOwner = data['prodOwner'];
        this.createUser = data['createUser'];
        this.createTime = data['createTime'];
        this.updateUser = data['updateUser'];
        this.updateTime = data['updateTime'];
    }
}
