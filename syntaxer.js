"use strict";

/**
 * 语法分析器
 */

const {StartTagToken, EndTagToken} = require("./lexer");

class HTMLDocument{
    constructor(){
        this.isDocument = true;
        this.childNodes = [];
    }
}

class Node {};

class Element extends Node{
    constructor (token) {
        super(token);
        for(const key in token){
            this[key] = token[key];
        }
        this.childNodes = [];    
    }
    [Symbol.toStringTag](){
        return `Element<${this.name}>`;
    }
}

class Text extends Node{
    constructor(value){
        super(value);
        this.value = value || '';
    }
}

function HtmlSyntaicalParser(){
    var stack = [new HTMLDocument];

    // 构建DOM树
    this.receiveInput = function(token){
        // 接收词法部分的词（token）
        let top = getTop(stack);
        if(typeof token === 'string'){
            if(top instanceof Text){
                top.value += token; 
            }else{
                let t = new Text(token);
                top.childNodes.push(t);
                stack.push(t);
            }
        }else if(top instanceof Text){
            stack.pop();
        }

        if(token instanceof StartTagToken){
            let e = new Element(token);
            top.childNodes.push(e);
            return stack.push(e);
        }
        if(token instanceof EndTagToken){
            return stack.pop();
        }
    }

    this.getOutput = function(){
        return stack[0];
    }

}

function getTop(stack){
    return stack[stack.length - 1];
}

module.exports = {HtmlSyntaicalParser};