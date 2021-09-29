# VSCode无法进行Unity C#智能提示、代码补全、方法跳转等功能的解决方案

在Unity Package Manager里，VisualStudio Code Editor要下载没有bug的版本1.2.2。

这个插件应该是可以生成脚本工程文件，类似下面的文件

`Assembly-CSharp-vs.csproj `
`Assembly-CSharp-firstpass-vs.csproj`
`Assembly-CSharp-Editor-vs.csproj`
`Assembly-CSharp-Editor-firstpass-vs.csproj`

这些文件把当前的文件夹组织成了一个工程。

注意文件中的目标框架版本，在`Assembly-CSharp.csproj`里标有，例如：

```
<TargetFrameworkVersion>v4.7.1</TargetFrameworkVersion>
```

去微软的这个[链接](https://dotnet.microsoft.com/download/visual-studio-sdks?utm_source=getdotnetsdk&utm_medium=referral)下载安装对应版本的Developer Pack。

除此之外，文件夹中可能有多个项目，而VSCode选择了错误的项目（即`.sln`文件）！

解决方案：
打开vscode按下：`ctrl` +`shift` + `P` 快捷键

输入：`OmniSharp: select project`，或者点击工具栏的**查看|命令面板**

选择正确的项目（`.sln`文件），它将正确读取`.csproj`文件，智能提示等功能即可恢复

