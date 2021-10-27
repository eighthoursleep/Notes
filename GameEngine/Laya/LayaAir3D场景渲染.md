# LayaAir场景渲染

(参考[Laya官网](https://layabox.com))

## 场景渲染配置

Scene3D继承于Sprite。

在LayaAir中，3D和2D可以混合使用，创建的3D场景Scene 和2D容器或2D元素的Sprite可以同时加载到舞台上。

### 在Unity中导出光照渲染配置

首先编辑渲染设置，以便渲染出更出色的游戏场景。在Unity中编辑器可以更直观的看到渲染效果，所以请在Unity中编辑好渲染设置，最后再导出使用场景。

#### 光照渲染配置

在Unity 2018.4.7中，通过工具栏Window|Rendering|Lighting Settings打开光照渲染面板

![lightWindow](sceneRendering/lightWindow.png)

以下属性在LayaAir支持范围内

1. Environment 环境设置

   1. Skybox Material 天空盒材质。

      **注意**：请使用LayaAir3D/Sky目录下的Shader。

   2. Environment Lighting 环境光照

      1. Source：光源选项目前可以使用Skybox和Color两种。

         设置为Color时，可以通过Ambient Color设置的环境光的颜色。

      2. Ambient Mode：环境模式，只能使用 `Realtime`实时光照。

   3. Environment Reflections 环境反射

      支持使用Custom自定义环境反射。

2. Lightmapping Settings 光照贴图设置

   全部支持，但是不包含Directional Mode(Directional)

   **注意**：烘焙光照贴图必须使用Non-Directional

3. Other Settings

   Fog场景雾化

4. Baked Lightmaps

   可导出，效果和PC，Mac&Linux Standalone保持一致。

#### 导出场景

 在确认要导出的场景后，打开导出插件面板（工具栏LayaAir3D|Export Tool），点击 **浏览** 选择导出目录，选择好导出目录后，点击 **导出** 导出场景。

![lightWindow](sceneRendering/layaExport.png)

![lightWindow](sceneRendering/layaSceneExport.png)

`..\bin\unitylib\Conventional\MainScene.ls`就是刚导出的场景文件了，里面记录了场景的各种**数据**、**模型**、**光照贴图**、**位置**等。

`Library`文件夹下的`unity default resources-xxx.lm`是默认碰撞体。

`xxxGIReflection.ltcb.ls`是全局光照文件。

