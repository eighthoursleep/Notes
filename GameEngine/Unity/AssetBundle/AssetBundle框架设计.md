# AssetBundle框架设计

[TOC]

## 创建AssetBundle

1. 首先定位需要打包与加载的资源，资源可以是任意类型（如：贴图、材质、音频、预设等）。在项目视图中点击文件，属性窗口下方可以看到资源预览。在AssetBundle后面输入需要打包的AssetBundle名称。

2. 写打包脚本（比如`BuildAssetBundle.cs`），并一定要放在特殊文件夹`Editor`下。

3. 打包核心API:

   ```c#
   BuildPipeline.BuidAssetBundles("YourABPath",BuidAssetBundleOptions.None, BuildTarget.StandaloneWindows64);
   ```

4. 编写脚本，在Unity编辑器顶部菜单会出现自定义的AB菜单。点击菜单后开始打包，大约几秒后在项目视图的StreamingAssets目录下我们可以看到打好包的资源文件。

   ```c#
   using System.IO;
   using UnityEngine;
   using UnityEditor;
   
   public class BuildAssetBundle : MonoBehaviour
   {
       [MenuItem("AssetBundleTools/BuildAllAssetBundles")]
       public static void BuildAllAB()
       {
           string outputPath = string.Empty;
           outputPath = Application.streamingAssetsPath;
           if (!Directory.Exists(outputPath))
           {
               Directory.CreateDirectory(outputPath);
           }
   
           BuildPipeline.BuildAssetBundles(outputPath, BuildAssetBundleOptions.None, BuildTarget.StandaloneWindows64);
       }
   }
   ```

   

## 下载AssetBundle

Unity目前提供2种通过WWW类下载AssetBundle文件的方式。

1. **“缓存机制”**：采用这种机制下载的AssetBundle文件会存入Unity引擎的缓存区，通过WWW类的静态方法`LoadFromCacheOrDownload`实现下载。
2. **（常用）“非缓存机制”**：采用这种机制下载的AssetBundle文件不会存在Unity引擎的缓存区。

示例：加载ab包，并将包中的贴图赋在一个Cube上。

```c#
using System;
using System.Collections;
using UnityEngine;

public class AssetBundleDemo : MonoBehaviour
{
    public GameObject gameObj;//编辑器内放入物体，比如放一个Cube
    public string textureName;
    private Texture texture;
    private string abUrl;
    private Action callback;
    
    private void Awake()
    {
        abUrl = "file://" + Application.streamingAssetsPath + "/" + "texture1";
        textureName = "unitychan_tile3";
        callback += ChangeTexture;
    }

    void Start()
    {
        StartCoroutine(LoadTexture(abUrl,textureName,callback));
    }

    void ChangeTexture()
    {
        gameObj.GetComponent<MeshRenderer>().material.mainTexture = texture;
    }

    private void OnDestroy()
    {
        callback = null;
    }

    IEnumerator LoadTexture(string assetBundleUrl, string textureName,Action callback)
    {
        if (string.IsNullOrEmpty(assetBundleUrl))
        {
            Debug.LogError("AssetBundle url is invalid.");
        }
        using (WWW www = new WWW(assetBundleUrl))
        {
            yield return www;
            AssetBundle ab = www.assetBundle;//接收ab包
            if (ab != null)
            {
                //提取包中材质
                if (textureName == "")
                {
                    texture = (Texture)ab.mainAsset;
                }
                else
                {
                    texture = (Texture) ab.LoadAsset(textureName);
                }
                callback.Invoke();
                ab.Unload(false);//卸载ab包
            }
            else
            {
                Debug.LogError("assetBundle path is invalid.");
            }
        }
    }
}
```



## AssetBundle原理



## AssetBundle依赖关系

