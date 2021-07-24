---
title: 如何设置Win10右键打开CMD
date: 2020-01-23 11:31:58
tags: cmd
widgets: null
---

转载出自：https://blog.csdn.net/itas109/article/details/86618799



将如下代码保存为*.reg的注册表文件，双击运行

```
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\Directory\Background\shell\cmd_here]
"ShowBasedOnVelocityId"=dword:00639bc8

[HKEY_CLASSES_ROOT\Directory\Background\shell\cmd_here\command]
@="cmd.exe /s /k pushd \"%V\""
```

效果：

![image-20200123113510340](image-20200123113510340.png)