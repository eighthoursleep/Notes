---
title: Hexo搭建个人博客注意事项记录
date: 2019-03-20 02:56:44
updated: 2019-01-14 16:19:00
tags: Hexo
categories: 搭建博客
---

# 如何插入图片？

安装[hexo-asset-image插件](https://github.com/dangxuandev/hexo-asset-image)

```
npm install hexo-asset-image --save
```

确保Hexo博客总目录下的`_config.yml`中的`post_asset_folder`的值为true（默认是false）。

然后在要插入图片的文章的目录下新建一个同名文件夹，并在其中放入要插入的图片，例子：

MacGesture2-Publish
├── apppicker.jpg
├── logo.jpg
└── rules.jpg
MacGesture2-Publish.md

直接用语句`![logo](logo.jpg)`插入图片`logo.jpg`。

---2020-01-10 更新---

# 邮件链接格式

```
mailto:xxx@xxx.com
```

---2020-01-14 更新---

# .md文件名如果包含特殊字符，需要转义

例如，文件名“C#入坑与VS的使用.md”需要改成“C%23入坑与VS的使用.md”。否则点击文章标题进入页面时，发送一个get请求，参数包含“#”，结果无法成功进入文章页面。

原理：将特殊的字符转换成ASCII码，格式为：%加字符的ASCII码，即一个百分号%，后面跟对应字符的ASCII（16进制）码值。例如 空格的编码值是"%20"。

URL特殊符号及对应的十六进制值编码：

```
+   URL中+号表示空格 %2B   
空格    URL中的空格可以用+号或者编码 %20   
/   分隔目录和子目录 %2F    
?   分隔实际的 URL 和参数 %3F    
%   指定特殊字符 %25    
#   表示书签 %23    
&   URL中指定的参数间的分隔符 %26    
=   URL中指定参数的值 %3D
```
参考链接：https://segmentfault.com/a/1190000010854567

尽管这样做可以解决跳转的问题，但文章中的所有图片依旧无法显示，因此给md文件和存图片的文件夹取名应尽力避免夹带特殊符号。

# tags包含特殊字符“#”需要转义

例如，以“C#”为一个标签名，则应写成
```
tags: C&#35;
```

原理：对特殊符号进行转义，用对应的HTML字符实体进行替换

各种常用特殊字符对应的HTML字符实体：

```
! &#33; — 惊叹号 Exclamation mark
" &#34; &quot; — 双引号 Quotation mark
# &#35; — 数字标志 Number sign
$ &#36; — 美元标志 Dollar sign
% &#37; — 百分号 Percent sign
& &#38; &amp; — 与符号(&) Ampersand
' &#39; — 单引号 Apostrophe
( &#40; — 小括号左边部分 Left parenthesis
) &#41; — 小括号右边部分 Right parenthesis
* &#42; — 星号 Asterisk
+ &#43; — 加号 Plus sign
< &#60; &lt; 小于号 Less than
= &#61; — 等于符号 Equals sign
- &#45; &minus; — 减号
> &#62; &gt; — 大于号 Greater than
? &#63; — 问号 Question mark
@ &#64; — Commercial at
[ &#91; — 中括号左边部分 Left square bracket
\ &#92; — 反斜杠 Reverse solidus (backslash)
] &#93; — 中括号右边部分 Right square bracket
{ &#123; — 大括号左边部分 Left curly brace
| &#124; — 竖线Vertical bar
} &#125; — 大括号右边部分 Right curly brace
空格 &nbsp;
```

参考链接：https://segmentfault.com/a/1190000020528571?utm_source=tag-newest