---
title: Python 3的byte和string
date: 2019-03-20 02:25:50
tags: Python
---

Python 3最大的新特性是对文本和二进制数据作了更为清晰的区分。文本总是Unicode,由string类型表示，二进制数据则由byte类型表示。Python 3不会以任意隐式方式混用string和byte。
<!-- more -->

字符串可以通过**编码(encode)**转成一串字节，一串字节通过**解码(decode)**转成字符串

例子：

```python
msg="华南理工大学"
encodeResult = msg.encode(encoding='utf-8')
#python 3.x 默认编码器按utf-8编码
decodeResult = encodeResult.decode(encoding="utf-8")
print("msg:",msg)
print("encode:",encodeResult)
print("type of encodeResult: ",type(encodeResult))
print("decode:",decodeResult)
print("type of decodeResult: ",type(decodeResult))
```

运行后：
> msg: 华南理工大学
encode: b'\xe5\x8d\x8e\xe5\x8d\x97\xe7\x90\x86\xe5\xb7\xa5\xe5\xa4\xa7\xe5\xad\xa6'
type of encodeResult:  <class 'bytes'>
decode: 华南理工大学
type of decodeResult:  <class 'str'>
