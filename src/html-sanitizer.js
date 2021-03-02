const sanitizer = require("./sanitizer")

function span(lang, str) {
    return `<span lang='${lang}'>${str}</span>`
}

function transpile(str) {
    let arr = sanitizer(str);
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        result.push(span(arr[i].lang, arr[i].content));
    }
    return result;
}

module.exports = transpile;
