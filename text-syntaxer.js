"use strict";

const {HtmlSyntaicalParser} = require('./syntaxer');
const {HtmlLexicalParser} = require('./lexer');

const syntaxer = new HtmlSyntaicalParser();
const lexer = new HtmlLexicalParser(syntaxer);

const text = `
<html maaa=a >
    <head>
        <title>cool</title>
    </head>
    <body>
        <img src="a" />
    </body>
</html>`;

for(let c of text){
    lexer.receiveInput(c);
}

console.log(JSON.stringify(syntaxer.getOutput(), null, 2));