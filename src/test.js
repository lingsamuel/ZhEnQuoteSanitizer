const assert = require('assert');

const sanitizer = require("./sanitizer");

const htmlSanitizer = require("./html-sanitizer");

function testResult(str, firstLang, arr) {
    let result = sanitizer(str);

    if (firstLang != undefined) {
        assert(result[0].lang == firstLang);
    }
    // console.log(result);
    // console.log(result.map(x => x.content));
    if (arr != undefined) {
        assert(arr.length == result.length, `${JSON.stringify(arr)} != ${JSON.stringify(result)}`);
        for (let i = 0; i < arr.length; i++) {
            assert(arr[i] == result[i].content, `${arr[i]} != ${result[i].content}`);
        }
    }
}

// Basic cases
testResult(" 中文", "zh", [" 中文"])
testResult("aa你好aa", "en", ["aa", "你好", "aa"]);
testResult("aa你好aa你好", "en", ["aa", "你好", "aa", "你好"]);
testResult("aa", "en", ["aa"]);
testResult("aa你好", "en", ["aa", "你好"]);
testResult("aa 你好", "en", ["aa ", "你好"]);
testResult("你好aa", "zh", ["你好", "aa"]);
testResult("你好 aa", "zh", ["你好", " aa"]);
testResult("你好", "zh", ["你好"]);

// 引号混用
testResult("他说：'Mary said,‘It’me.’'。", "zh", ["他说：", "'Mary said,‘It’me.’'", "。"]);
testResult("“Mary said,‘It’me.’”，他说。", "en", ["“Mary said,‘It’me.’”", "，他说。"]);
testResult("“引号”", "zh", ["“引号”"])
testResult("“引号”，和英文 “english”", "zh", ["“引号”，和英文", " “english”"])
testResult("it’me 的中文含义是什么？", "en", ["it’me ", "的中文含义是什么？"])

testResult("“引号“mixed””", "zh", ["“引号", "“mixed”", "”"])

// 取自 https://zh-style-guide.readthedocs.io/zh_CN/latest/标点符号/中英文混用时标点用法.html
testResult("distributed SQL 在这里是什么意思？", "en", ["distributed SQL ", "在这里是什么意思？"]);
testResult("不要总是对女孩说“Pretty!”！", "zh", ["不要总是对女孩说", "“Pretty!”", "！"]);
testResult("他站在那，感叹了句“What a beautiful scene!”。", "zh", ["他站在那，感叹了句", "“What a beautiful scene!”", "。"])
testResult("“He is man.”、“He is a man.”和“He is the man”的区别是什么？", "en", ["“He is man.”", "、", "“He is a man.”", "和", "“He is the man”", "的区别是什么？"])

testResult("“中文 English English”。", "zh", ['“中文', ' English English', '”。']);
testResult("“English English 中文”。", "zh", ['“', 'English English ', '中文”。']);

testResult("中文“中文 English English”。English", "zh", ['中文“中文', ' English English', '”。', 'English']);
testResult("中文“中文 English English”。中文", "zh", ['中文“中文', ' English English', '”。中文']);
testResult("English“中文 English English”。中文", "en", ['English', '“中文', ' English English', '”。中文']);
testResult("English“中文 English English”。English", "en", ['English', '“中文', ' English English', '”。', 'English']);

testResult("中文“English English”。English", "zh", ['中文', '“English English”', '。', 'English']);
testResult("中文“English English”。中文", "zh", ['中文', '“English English”', '。中文']);
testResult("English“English English”。English", "en", ['English“English English”', '。', 'English'])
testResult("English“English English”。中文", "en", ['English“English English”', '。中文'])

// TODO: Bugs
// testResult("“中文 English English”。\n“English English 中文”。");
// testResult("// “符号开头，引号“mixed””");



// console.log(htmlSanitizer("他说：'Mary said,‘It’me.’'。"))
// console.log(htmlSanitizer("“Mary said,‘It’me.’”，他说。"))
