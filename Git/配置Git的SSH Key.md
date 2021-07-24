---
title: 配置Git的SSH Key
date: 2020-01-08 00:28:11
tags:
- Hexo
- git
widgets: null
---

生成SSH并添加到GitHub

回到你的git bash中，

> git config --global user.name "yourname"
> git config --global user.email "youremail"

这里的yourname输入你的GitHub用户名，youremail输入你GitHub的邮箱。这样GitHub才能知道你是不是对应它的账户。

可以用以下两条，检查一下是否输对

> git config user.name
> git config user.email

然后创建SSH,一路回车

> ssh-keygen -t rsa -C "youremail"

这个时候它会告诉你已经生成了.ssh的文件夹。在你的电脑中找到这个文件夹。

ssh，简单来讲，就是一个秘钥，其中，id_rsa是你这台电脑的私人秘钥，不能给别人看的，id_rsa.pub是公共秘钥，可以随便给别人看。把这个公钥放在GitHub上，这样当你链接GitHub自己的账户时，它就会根据公钥匹配你的私钥，当能够相互匹配时，才能够顺利的通过git上传你的文件到GitHub上。

而后在GitHub的setting中，找到SSH keys的设置选项，点击New SSH key
把你的id_rsa.pub里面的信息复制进去

作者：程序员黄小斜
链接：https://www.jianshu.com/p/5efd8c6eb3e9
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。