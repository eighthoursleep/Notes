---
title: Python头部“#!/usr/bin/env python” 和“#!/usr/bin/python”的区别
date: 2019-03-19 16:16:12
tags: Python
---

大部分Python文件的第一行写着`#!/usr/bin/env python`或者`#!/usr/bin/python`，这两条语句和运行模式有关。
<!-- more -->

如果我们用普通运行模式例如（在Linux下执行命令）：
```
python *.py
```

那么这两条头部语句没什么卵用。但如果打算让Python程序像普通程序一样运行，例如执行命令（注：文件要有可执行权限chmod a+x *.py）：
```
./*.py 
```

这两条头部语句就起作用了，它们用来为脚本语言指定解释器，通常认为用`#!/usr/bin/env python`要比`#!/usr/bin/python`更好，因为Python解释器有时并不安装在默认路径，比如安装在虚拟环境中。

两条语句逐一解释如下：

```python
#!/usr/bin/env python
```
当机器上安装了多个版本的Python时这种写法才有意义。程序运行时机器会先去取环境变量的`PATH`中指定的第一个Python来执行您的脚本。如果您配置了虚拟环境，这条头部语句可以保证脚本由您的虚拟环境python中的Python来执行。

```python
#!/usr/bin/python
```
表示写死了就是要用目录`/usr/bin/python`下的Python来执行您的脚本。这样写程序的可移植性比较差，如果此路径下的Python不存在就会报错。

因此一般情况下采用第一种写法。