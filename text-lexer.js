"use strict";

const {HtmlLexicalParser} = require('./lexer');

const text = `
<html maaa=a >
    <head>
        <title>cool</title>
    </head>
    <body>
        <img src="a" />
    </body>
</html>`;

const dummySyntaxer = {
    receiveInput: (token) => {
        if(typeof token === 'string'){
            console.log(`String(${token.replace(/\n/, '\\n').replace(/ /),'<whitespace>'})`);
        }else{
            console.log(token);
        }
    }
}

const lexer = new HtmlLexicalParser(dummySyntaxer);

for(let c of text){
    lexer.receiveInput(c);
}