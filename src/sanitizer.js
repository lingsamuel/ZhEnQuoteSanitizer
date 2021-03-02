// 英文合法字符串
function canBeEn(str) {
    // 仅判断：数字字母、逗号、空格、斜杠、ASCII 引号，Unicode 引号，英文圆括号，英文句号，英文叹号，英文问号，英文 dash，换行
    return str != undefined && /^[0-9a-zA-Z, //\\\'\"‘’“”\(\)\.\!\?\-\r\n]+$/.test(str);
}

function onlyNeutralCharacter(str) {
    // 仅判断中立符号：
    // 数字、空格、斜杠、Unicode 引号，换行
    return str != undefined && /^[0-9 //\\‘’“”\r\n]+$/.test(str);
}

// 英文字母
function isLetter(char) {
    return ('0' <= char && char <= '9') || ('a' <= char && char <= 'z') || ('A' <= char && char <= 'Z') ||
        char == ' '; // 由于中文中不应该有空格，因此把空格也算入字母
}

// 双语均有且不影响语言判断的字符
// 实际上中文中应该不存在空格？
function isBothChar(char) {
    return char == " ";
}

// 英文合法字符。包含 Unicode 引号。
function canBeEnLetter(char) {
    // 标题，仅判断：数字字母、逗号、空格、斜杠、ASCII 引号，Unicode 引号，英文圆括号，英文句号
    return isLetter(char) || isQuote(char) || ([' ', ',', '/', '\\', '(', ')', '.']).includes(char);
}

function hasEnLetter(str) {
    return str != undefined && /[a-zA-Z]/g.test(str);
}

function isQuote(char) {
    return (['\'', '\"', '‘', '’', '“', '”']).includes(char);
}

function isEnOnlyQuote(char) {
    return (['\'', '\"']).includes(char);
}

function isOpenQuote(char) {
    return (['‘', '“']).includes(char);
}

function isCloseQuote(char) {
    return (['’', '”']).includes(char);
}

function isOpenDoubleQuote(char) {
    return (['“']).includes(char);
}

function isCloseDoubleQuote(char) {
    return (['”']).includes(char);
}

function openDoubleQuotingCn(str, index) {
    if (index == undefined || index < 0 || index >= str.length) {
        console.log(`Checking out of index ${index}`);
        return false;
    }
    if (index > str.length - 2) {
        // 中文引号至少要包含一个中文字符。
        // “中”
        return false;
    }
    if (isOpenDoubleQuote(str[index])) {
        let isQuotingCn = false;
        let i = index + 1;
        let stack = [];
        while (i < str.length) {
            if (isOpenDoubleQuote(str[i])) {
                stack.push(str[i]);
            }
            if (isCloseDoubleQuote(str[i])) {
                if (stack.length > 0) {
                    stack.pop();
                } else {
                    break;
                }
            }
            if (!canBeEn(str[i]) && stack.length == 0) {
                // 不是英文字符，且已经是最外层嵌套
                isQuotingCn = true;
                break;
            }
            i++;
        }
        return isQuotingCn;
    }

    return false;
}

function closeDoubleQuotingCn(str, index) {
    if (index == undefined || index < 0 || index >= str.length) {
        console.log(`Checking out of index ${index}`);
        return false;
    }
    if (index < 2) {
        // 中文引号至少要包含一个中文字符。
        // “中”
        return false;
    }
    if (isCloseDoubleQuote(str[index])) {
        let isQuotingCn = false;
        let i = index - 1;
        let stack = [];
        while (i >= 0) {
            if (isCloseDoubleQuote(str[i])) {
                stack.push(str[i]);
            }
            if (isOpenDoubleQuote(str[i])) {
                if (stack.length > 0) {
                    stack.pop();
                } else {
                    break;
                }
            }
            if (!canBeEn(str[i]) && stack.length == 0) {
                // 不是英文字符，且已经是最外层嵌套
                isQuotingCn = true;
                break;
            }
            i--;
        }
        return isQuotingCn;
    }

    return false;
}

// 目标 index 处若是引号，判断是不是英文引号
// 要求临近字符需要是英文或空格（你好 “eng” 你好）=> （你好 "eng" 你好）
function quotingEn(str, index) {
    if (index == undefined || index < 0 || index >= str.length) {
        console.log(`Checking out of index ${index}`);
        return false;
    }
    if (!isQuote(str[index])) {
        // 不是引号
        return false;
    }

    // 理论上讲开引号后、闭引号前不应该跟空格。
    if (isOpenQuote(str[index])) {
        // 开引号后，需要是英文，并且向后遍历是否是中文引号。
        let nextIsEN = (index == str.length - 1 || canBeEn(str[index + 1])) && !openDoubleQuotingCn(str, index);
        return nextIsEN;
    } else if (isCloseQuote(str[index])) {
        // 闭引号前，需要是英文。并且向前遍历是否是中文引号。
        let prevIsEN = (index == 0 || canBeEn(str[index - 1])) && !closeDoubleQuotingCn(str, index);
        return prevIsEN;
    } else if (isEnOnlyQuote(str[index])) {
        return true;
    }
}


// 糙快猛版。
// 
// 分割中英文字符串。不要求中英文之间包含空格（引入空格规则似乎实现更复杂，例如：`这是 eng。`，g 和句号之间没有空格。）。
// aa你好aa => aa && 你好 && aa
// 中文“eng”中文 => 中文 && "eng" && 中文
// 中文“it’me”中文 => 中文 && "it's me" && 中文
// 中文“it’me中文” => 中文“it’me中文”
// 中文 eng 中文 => 中文 && eng && 中文
// 他说：“Mary said,‘It’me.’”。 => 他说： && “Mary said,‘It’me.’” // 注释：理论上讲，应该使用中文引号包裹含有任意中文字符的句子，英文引号包裹仅英文单词或纯英文句子，但不太好实现。
// 
// 特别地，单引号的匹配检测比较困难，只能检测完整句子（依靠标点）。
// 例如：`他说：“Mary said,‘It’s me.’”`，其中由于单引号内是完整的句子，可以依靠句尾的标点明确得知此闭引号是包裹句子的。
// 但是：`“‘It’s me’ means xxx”`，则难以区分。
// 不过实际上不需要真的匹配单引号。因为英文单引号必然是出现在英文双引号之间的，可以认为上下文里都是英文。
function splitStringByLang(str) {
    let arr = [];
    let push = function(s) {
        // 合并空格
        if ((s.trim().length == 0 && arr.length != 0) || (arr.length == 1 && arr[0].trim().length == 0)) {
            arr[arr.length - 1] = arr[arr.length - 1] + s
        } else {
            arr.push(s)
        }
    }

    let lastStart = 0;
    for (let i = 0; i < str.length; i++) {
        if (canBeEn(str[i]) && // 是英文字符
            (!isQuote(str[i]) || quotingEn(str, i))) { // 若是引号，需要是英文引号
            if (lastStart != i) {
                push(str.slice(lastStart, i));
            }
            lastStart = i;

            i++;
            while (i < str.length && canBeEn(str[i]) && // 是英文字符
                (!isQuote(str[i]) || quotingEn(str, i))) { // 若是引号，需要是英文引号
                i++;
            }
            push(str.slice(lastStart, i));
            lastStart = i;
        }
    }
    if (str.length != lastStart) {
        push(str.slice(lastStart, str.length));
    }
    return arr;
}

function sanitizer(str) {
    let arr = splitStringByLang(str);

    let result = [];
    // let isEn;
    // if(onlyNeutralCharacter(arr[0])) {
    //     isEn = canBeEn(arr[1]) && hasEnLetter(arr[1]);
    // } else {
    //     isEn = canBeEn(arr[0]) && hasEnLetter(arr[0]);
    // }
    let isEn = canBeEn(arr[0]) && hasEnLetter(arr[0]);
    // 由于只支持中英，实际上只需要返回第一个元素的语言即可。
    // 不过为了调用者的方便，还是算了。
    for (let i = 0; i < arr.length; i++) {
        // if (onlyNeutralCharacter(arr[i])) {
        //   result.push({
        //     lang: "",
        //     content: arr[i],
        //   });
        // } else {
        result.push({
            lang: isEn ? "en" : "zh",
            content: arr[i],
        });
        isEn = !isEn;
        // }
    }
    return result;
}


function contextType(char) {
    return canBeEn(char) ? "en" : "zh";
}

// parser 版 - wip
// 解析过程：
// 每次语言与当前 context 不一致，都 push 一个新的 context
// 每个双引号对都 push 一个默认是 en 的 context，直到遇到中文将当前 context 改为 zh
// 解析完毕后合并临近的相同 context
function parse(str) {
    let arr = [];
    let lastStart = 0;

    let context = [];
    let indexes = [0];
    let peek = function() { return context[context.length - 1]; }
    context.push(canBeEn(str[0]))


    let stack = []; // double quote stack
    for (let i = 1; i < str.length; i++) {
        let curr = str[i];
        if (canBeEn(curr) == peek()) {
            if (isOpenQuote(curr)) { // 是开引号
                let i = index + 1;
                context.push(canBeEn(str[i])); // 插入引号内的 context
                while (i < str.length) {
                    if (isOpenQuote(str[i])) {
                        stack.push(str[i]);
                    }
                    if (isCloseQuote(str[i])) {
                        if (stack.length > 0) {
                            stack.pop();
                        } else {
                            break;
                        }
                    }
                    if (!canBeEn(str[i]) && stack.length == 0) {
                        // 不是中文字符，且已经是最外层嵌套
                        isQuotingCn = true;
                        break;
                    }
                    i++;
                }
            }
        } else {
            context.pop();
            arr.push((indexes.pop(), i));
            indexes.push(i);
            context.push(canBeEn(curr));
        }
    }
    return arr;
}

module.exports = sanitizer;
