[toc]

# AssetBundle的工作流程

## 一、 指定资源的AssetBundle属性

首先需要设置要生成AssetBundle包的资源名称和后缀名，这个名称跟后缀名没有特定的规则，单击要生成AssetBundle包的资源，然后在Inspector视图的最下面，就可以看到设置名称和后缀名的地方

## 二、 构建AssetBundle包

构建AssetBundle包，需要根据依赖关系进行打包，将需要同时加载的资源放在一个包里面，各个包会保存相互依赖的信息

手动Build脚本
```c#
using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEngine;
 
public class BulidAssetBundle : MonoBehaviour
{
	[MenuItem("Framework/AssetBundleHelper/Build", false, 1)]
	private static void BuildAssetBundle()
	{
		string path = "Assets/AssetBundles";
		if (!Directory.Exists(path))
		{
			Directory.CreateDirectory(path);
		}
 
		BuildPipeline.BuildAssetBundles(path, BuildAssetBundleOptions.None, BuildTarget.StandaloneWindows64);
		AssetDatabase.Refresh(); //刷新工程目录的缓存
	}
}
```

`xxx.ab`是构建出来的AssetBundle本地，`xxx.manifest`是这个AssetBundle对应的清单文件


## 三、 上传AssetBundle包

上传AssetBundle包需要有一台服务器收发AssetBundle包。

## 四、 加载AssetBundle包和包里面的资源

下载AssetBundle包后，就要去读取并加载AssetBundle包里面的资源


加载AssetBundle有四种方式：
1. 从本地文件加载
`AssetBundle.LoadFromFile()`
2. 从流加载
`AssetBundle.LoadFromMemory()`
3. 从内存加载
`AssetBundle.LoadFromStream()`
4. 从远程服务器加载
`UnityWebRequestAssetBundle.GetAssetBundle()`

### 4.1 AssetBundle.LoadFromFile

如果AssetBundle未压缩或采用了数据块(`LZ4`)压缩方式，`LoadFromFile`将直接从磁盘加载AssetBundle。

使用此方法加载完全压缩 (`LZMA`) 的AssetBundle将首先解压缩AssetBundle，然后再将其加载到内存中。

```c#
// 同步方式制指定资源
private static void LoadMethodSync()
{
    string path = "Assets/AssetBundles/sphere";
    AssetBundle assetBundle = AssetBundle.LoadFromFile(path);
    GameObject sphere= assetBundle.LoadAsset<GameObject>("Sphere");
    Instantiate(sphere);
}
// 异步方式指定资源
IEnumerator LoadMethodAsync()  
{  
    string path = "Assets/AssetBundles/sphere";  
    AssetBundleCreateRequest request = AssetBundle.LoadFromFileAsync(path);  
    yield return request;  
    var sphere= request.assetBundle.LoadAsset<GameObject>("Sphere");  
    Instantiate(sphere);  
}
//同步加载所有资源
private static void LoadAllSync()
{
    string path = "Assets/AssetBundles/sphere";
    AssetBundle assetBundle = AssetBundle.LoadFromFile(path);
    UnityEngine.Object[] objs = assetBundle.LoadAllAssets();
}
//异步加载所有资源
IEnumerator LoadAllAsync()
{
    string path = "Assets/AssetBundles/sphere";
    AssetBundle assetBundle = AssetBundle.LoadFromFile(path);
    AssetBundleRequest request = assetBundle.LoadAllAssetsAsync();
    yield return request;
    var assets = request.allAssets;
    foreach (var asset in assets)
    {
        var obj = Instantiate(asset);
    }

}
```

### 4.2 AssetBundle.LoadFromMemory

该方法传入一个包含AssetBundle数据的字节数组，也可以根据需要传递`CRC校验码`。

如果捆绑包采用的是`LZMA`压缩方式，将在加载时解压缩AssetBundle。

`LZ4`压缩包则会以压缩状态加载。当下载的是加密数据并需要从未加密的字节创建AssetBundle时会用到。

```c#
// 同步方法
private static void LoadMethodSync()  
{  
    string path = "Assets/AssetBundles/sphere";  
    AssetBundle assetBundle = AssetBundle.LoadFromMemory(File.ReadAllBytes(path));  
    Instantiate(sphere);  
}
// 异步方法
IEnumerator LoadMethodAsync()  
{  
    string path = "Assets/AssetBundles/sphere";  
    AssetBundleCreateRequest request = AssetBundle.LoadFromMemoryAsync(File.ReadAllBytes(path));  
    yield return request;  
    var sphere= request.assetBundle.LoadAsset<GameObject>("Sphere");  
    Instantiate(sphere);  
}
```

### 4.3 AssetBundle.LoadFromStream

从托管Stream加载AssetBundle。如果是LZMA压缩，则将数据解压缩到内存。

如果是未压缩或使用块压缩的捆绑包，则直接从Stream读取。

需要注意的是，在加载AssetBundle或其中的资源时，不应该释放Stream资源，应该在`AssetBundle.Unload`之后再释放。

相比于从内存加载，从流加载的优势是加载加密资源时，占用的内存较小。

```c#
// 同步方法
private static void LoadMethodSync()
{
	AssetBundle.UnloadAllAssetBundles(true);
	string path = "Assets/AssetBundles/sphere";
	
	FileStream stream = new FileStream(path, FileMode.Open,FileAccess.Read);
	AssetBundle assetBundle = AssetBundle.LoadFromStream(stream);
	GameObject sphere= assetBundle.LoadAsset<GameObject>("Sphere");
	Instantiate(sphere);
	assetBundle.Unload(false);
	stream.Close();
}
// 异步方法
IEnumerator LoadMethodAsync()
{
	string path = "Assets/AssetBundles/sphere";
	FileStream stream = new FileStream(path, FileMode.Open,FileAccess.Read);
	AssetBundleCreateRequest request = AssetBundle.LoadFromStreamAsync(stream);
	yield return request;
	var sphere= request.assetBundle.LoadAsset<GameObject>("Sphere");
	Instantiate(sphere);
	request.assetBundle.Unload(false);
	stream.Close();
}
```

### 4.4 UnityWebRequestAssetBundle.GetAssetBundle

该方法会创建经过优化的`UnityWebRequest`，以通过 `HTTP GET`下载AssetBundle。

请求成功后，使用`DownloadHandlerAssetBundle`方法将数据流式传输到缓冲区并解压缩。与一次性下载所有数据相比，这种方式节省了很多内存。

如果加载本地数据，需要在路径前加上`file://`

```c#
IEnumerator LoadMethodAsync()
{
	string path = @"[远程资源路径]";
 
	UnityWebRequest request = UnityWebRequestAssetBundle.GetAssetBundle(path);
	yield return request.SendWebRequest();
	AssetBundle assetBundle = DownloadHandlerAssetBundle.GetContent(request);
	GameObject sphere= assetBundle.LoadAsset<GameObject>("Sphere");
	Instantiate(sphere);
 
}
```
