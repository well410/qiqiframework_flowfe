/**
 * 引用-规则节点
 * @param data
 * @returns {{}}
 */
import {isEmpty} from "../../utils";

export const citationNode = (data)=>{
    let node={};
    let str=data.ruleVersion?(data.ruleVersion+""):"";
    node.id=data.ruleId+""+str;
    node.label=data.ruleName+"";
    node.label=fittingString(node.label,9,7);
    node.description= data.ruleVersion?data.ruleVersion+"":data.ruleId;
    node.description= fittingString(node.description,19,18);
    node.hasVersion=data.ruleVersion?true:false; //是否有版本信息
    node.ruleOrDecs="RULE";
    node.ruleOrDecsName=data.ruleName+"";
    node.ruleOrDecsDescription=data.ruleVersion?data.ruleVersion+"":data.ruleId;
    node.decsOrRuleId=data.ruleId;
    return node;
};
//引用-决策节点
export const decsNode= (data)=>{
    let node={};
    node.id=data.decsId+"";
    node.label=data.decsName+"";
    node.label=fittingString(node.label,9,7);
    node.description=data.decsId+"";
    node.description= fittingString(node.description,19,18);
    node.hasVersion=data.decsVersion?true:false; //是否有版本信息
    node.ruleOrDecs="DECS";
    node.ruleOrDecsName=data.decsName+"";
    node.ruleOrDecsDescription=(data.decsVersion?data.decsVersion:data.decsId)+"";
    node.decsOrRuleId=data.decsId;
    return node;
};

/**
 * 字符串截取
 * @param data 字符串
 * @param showLength 需要截取时的最终长度，包括"..."的长度
 * @param maxLength  不需要截取的最大长度
 */
export const fittingString=(data,showLength,maxLength)=>{
    if (isEmpty(data) || data.length<=maxLength)
        return data;
    return data.substring(0,showLength-3)+"...";
};
//规则到规则的边
export const ruleToRuleEdge=(ruleCitation)=>{
    let edges=[];
    ruleCitation.forEach(item =>{
        item.children.forEach(child =>{
            let edge={};
            let str=item.ruleVersion?(item.ruleVersion+""):"";
            edge.source=item.ruleId+""+str;
            str=child.ruleVersion?(child.ruleVersion+""):"";
            edge.target=child.ruleId+""+str;
            edges.push(edge);
        });
    });
    return edges;
};
//决策到规则的边
export const decsToRuleEdge=(pDecs,ruleList)=>{
    let edges=[];
    ruleList.forEach(item =>{
        let edge={};
        edge.source=pDecs.decsId;
        let str=item.ruleVersion?(item.ruleVersion+""):"";
        edge.target=item.ruleId+""+str;
        edges.push(edge);
    });
    return edges;
};
