# ZH/EN Quote Sanitizer

将中英混合字符串按语言解析，方便后续处理。

主要为了解决 Unicode 的引号问题。

实现非常糙快猛，如果之后有空，也许可以写得好看一点，并扩展到[更多有问题的字符](https://www.zhihu.com/question/31424658)或语言上。

## Example

```js
const sanitizer = require("./sanitizer");
sanitizer("他站在那，感叹了句“What a beautiful scene!”。")
// [
//   { lang: 'zh', content: '他站在那，感叹了句' },
//   { lang: 'en', content: '“What a beautiful scene!”' },
//   { lang: 'zh', content: '。' }
// ]
```

![image](https://user-images.githubusercontent.com/14567045/109621310-c287c580-7b75-11eb-827e-61267b729c05.png)

啊，生命如此美好。
