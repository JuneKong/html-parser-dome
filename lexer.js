"use strict";

/**
 * 词法分析器
 */
const EOF = void 0;

function HtmlLexicalParser(syntaxer){
    var state = data;
    let token = null;
    let endToken = null;
    let attribute = null;
    let characterReference = '';

    this.receiveInput = function(char){
        if(state == null){
            throw new Error("Not fn data");
        }else{
            state = state(char);
        }
    };


    // 状态函数
    function data(c){
        switch(c){
            case '&':
                return characterReferenceInData;
            case '<':
                return tagOpen;
            case '\0':
                error();
                emitToken(c);
                return data;
            case EOF:
                emitToken(c);
                return data;
            default:
                emitToken(c);
                return data;
        }
    }

    function error(c){
        console.log(`warn: unexpected char '${c}'`)
    }

    function characterReferenceInData(c){
        // &...; => 遇到;表示字符转换结束，生成token,否则递归循环
        if(c === ';'){
            characterReference += c;
            emitToken(characterReference);
            characterReference = '';
            return data;
        }else{
            characterReference += c;
            return characterReferenceInData;
        }
    }

    function tagOpen(c){
        if(c == '/'){
            return endTagOpen;
        }
        if(c.match(/[A-Za-z]/)){
            token = new StartTagToken();
            token.name = c.toLowerCase();
            return tagName;
        }
        // if(c == '?'){
        //     return bogusComment;
        // }
        return error(c);
    }

    //词
    function emitToken(token){
        syntaxer.receiveInput(token);
    }

    // 开始的结束标签
    function endTagOpen(c){
        if(c === '>'){
            return error(c);
        }
        if(c.match(/[A-Za-z]/)){
            token = new EndTagToken();
            token.name = c.toLowerCase();
            return tagName;
        }
    }

    // 标签
    function tagName(c){
        if(c === '/'){
            return selfClosingTag;
        }
        if(c === '>'){
            emitToken(token);
            return data;
        }
        if(c.match(/[\t \f\n]/)){
            return beforeAttributeName;
        }
        if(c.match(/[a-zA-Z]/)){
            token.name += c.toLowerCase();
            return tagName; 
        }
    }

    function selfClosingTag(c){
        if(c === '>'){
            emitToken(token);
            endToken = new EndTagToken();
            endToken.name = token.name;
            emitToken(endToken);
            return data;
        }
    }

    function beforeAttributeName(c){
        if(c.match(/[\t \f\n]/)){
            return beforeAttributeName;
        }
        if(c === '/'){
            return selfClosingTag;
        }
        if(c === '>'){
            emitToken(token);
            return data;
        }
        if(c.match(/'"</)){
            return error(c);
        }

        attribute = new Attribute();
        attribute.name = c.toLowerCase();
        attribute.value = '';
        return attributeName;
    }

    function attributeName(c){
        if(c === '/'){
            token[attribute.name] = attribute.value;
            return selfClosingTag;
        }
        if(c === '='){
            return beforeAttributeValue;
        }
        if(c.match(/[\t \f\n]/)){
            return beforeAttributeName;
        }
        attribute.name += c.toLowerCase();
        return attributeName;
    }

    function beforeAttributeValue(c){
        if(c === '"'){
            return attributeValueDoubleQuoted;
        }
        if(c === "'"){
            return attributeValueSingleQuoted;
        }
        if(c.match(/\t \f\n/)){
            return beforeAttributeValue;
        }

        attribute.value += c;
        return attributeValueUnquoted; 
    }

    // 双引号
    function attributeValueDoubleQuoted(c){
        if(c === '"'){
            token[attribute.name] = attribute.value;
            return beforeAttributeName;
        }
        attribute.value += c;
        return attributeValueDoubleQuoted;
    }

    // 单引号
    function attributeValueSingleQuoted(c){
        if(c === "'"){
            token[attribute.name] = attribute.value;
            return beforeAttributeName;
        }
        attribute.value += c;
        return attributeValueSingleQuoted;
    }
    // 引用符号结束
    function attributeValueUnquoted(c){
        if(c.match(/[\t \f\n]/)){
            token[attribute.name] = attribute.value;
            return beforeAttributeName
        }
        attribute.value += c;
        return attributeValueUnquoted;
    }
}

class StartTagToken {};
class EndTagToken {};
class Attribute {};

module.exports = {
    HtmlLexicalParser,
    StartTagToken,
    EndTagToken
}