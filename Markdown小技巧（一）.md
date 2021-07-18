---
title: Markdown小技巧（一）
date: 2019-02-13 17:54:39
tags: markdown
hide_excerpt: true
---

关键词：上标下标

<!--more-->

我在使用<u>作业部落</u>出品<u>CmdMarkdown编辑器</u>编写.md文件时遇到的问题：

我希望连续出现两个引用块，而两个引用块中间隔着一个空行，两个引用快还是连在一起的。查阅网上的帖子后发现解决方法：

两个引用块之间需要间隔两个空行，其中第二个空行行首必须打出一个全角空格。

例子：
```md
> ＂I used to be an adventurer like you, then I took an arrow in the knee.＂

（全角空格）
> ＂Never should you come here.＂
```

效果：
> I used to be an adventurer like you, then I took an arrow in the knee.

> Never should you come here.



## 如何打出下标和上标？

上标的HTML标签的是< sup >，所以如果要打上标的话就用以下格式：

```xml
<sup>xxx</sup>
```

其中xxx表示上标的内容，看个例子：
 我现在想写一个公式：n的平方等于n+1，写法如下：

```xml
n<sup>2</sup>=n+1
```

显示效果：n<sup>2</sup>=n+1


下标的标签是< sub >，同理我们来实现一个例子：a=log<sub>2</sub>b
 写法如下：

```xml
a=log<sub>2</sub>b
```