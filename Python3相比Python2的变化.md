---
title: Python 3相比Python 2的变化
date: 2019-03-19 17:13:17
tags: Python
---

主要是编码方面的变化
<!-- more -->

### 编码方面

**Python 3**默认按**UTF-8**处理，支持中文字符；
**Python 2**默认按**ASCII**处理，不支持中文字符。

在Python 2中如需使用中文字符，比须首行声明字符集如下：

```python
# -*- coding:utf-8 -*-
```