(参考[Laya官网](https://layabox.com))

# LayaAir的资源类型

`.ls`为场景文件，选择导出Scene类别时生成。其中包含了场景需要的各种数据、光照贴图、模型、位置等。需使用 **Scene3D** 类加载。

`.lh`为预设文件，选择导出Sprite3D类别时生成。其中缺少场景信息，其他的特征与.ls文件相同，但是需要使用 **Sprite3D** 类加载。

`.lm`为模型数据文件，通常是FBX格式的转换而成。可以使用 **MeshSprite3D** 类加载。

`.lmat`为材质数据文件，是在unity中为模型设置的材质信息。加载.ls或.lh文件时会自动加载.lmat文件来产生材质。可以使用 **BaseMaterial** 类来加载。

`.lani`为动画数据文件。如果模型上有动画，导出后将生成的动画配置文件，其中包含了动画帧数据。加载可以使用 **AnimationClip** 类来加载。

`.jpg`,`.png`：为普通的图片文件。

`.ktx` :安卓平台下的压缩纹理的图片格式。

`.pvr` ：iOS平台下的压缩纹理的图片格式。

`.ltc` ：天空盒文件，该天空盒为Cube天空盒，文件中记录了六张图片，分别对应天空盒的六个面。

`.ltcb` : 二进制的天空盒文件，该天空盒文件为一张图片，其中记录了反射场景的反射信息。

`.jpg`,`.png`,`.ktx`,`.pvr`,`.ltc`,`.ltcb`等是贴图文件。如果有使用到贴图，unity导出后将会生成贴图文件。可以使用 **Texture2D** 类来加载。

# LayaAir的资源加载

## 单个资源加载

### 1. 场景加载

单个场景加载的时候，使用的`Laya.Scene3D.load()`方法。

```typescript
//3d场景加载
Laya.Scene3D.load("res/YourSceneFolder/YourScene.ls",Laya.Handler.create(null,function(scene){
    //加载完成获取到了Scene3d    
	Laya.stage.addChild(scene);
    //获取摄像机
	var camera = scene.getChildByName("MainCamera");
    //清除摄像机的标记
	camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
    //添加光照
	var directionLight = scene.addChild(new Laya.DirectionLight());
	directionLight.color = new Laya.Vector3(1, 1, 1);
	directionLight.transform.rotate(new Laya.Vector3( -3.14 / 3, 0, 0));
}));
```

`Laya.Scene`和`Laya.Scene3D`有什么不同？



### 2. 材质加载

在单个材质进行加载的时候，我们使用的`Laya.BaseMaterial.load()`方法。在这次示例里，我们加载了一个天空盒给上面的示例摄影机加上。

```typescript
//材质加载        
Laya.BaseMaterial.load("res/YourSkyBoxFolder/skyBox0.lmat", Laya.Handler.create(null, function(mat){    
    //获取相机的天空渲染器
    var skyRenderer:Laya.SkyRenderer = camera.skyRenderer;
    //创建天空盒的mesh
    skyRenderer.mesh = Laya.SkyBox.instance;
    //设置天空盒材质
    skyRenderer.material = mat;
}));
```

### 3. 纹理加载

加载单个纹理使用`Laya.Texture2D.load()`方法。这里我们创建了一个正方体，并且将加载的纹理设置为他的纹理。这个操作实际上和3D简单示例的操作是相同的。

```typescript
//加载纹理
Laya.Texture2D.load("res/YourTextureFolder/YourTexture.png", Laya.Handler.create(null, function(tex) {
    //使用纹理
    var obj = scene.addChild(new Laya.MeshSprite3D(PrimitiveMesh.createSphere(5, 32, 32)));
    obj.transform.translate(new Laya.Vector3(10, 20, -8));
    var yourMaterial = new Laya.BlinnPhongMaterial();
    yourMaterial.albedoTexture = tex;
    yourMaterial.albedoIntensity = 1;
    obj.meshRenderer.material = yourMaterial;
}));
```

### 4. 网格加载

 单个网格加载使用的 `Laya.Mesh.load()` 方法。

```typescript
//加载Mesh
Laya.Mesh.load("res/YourMeshFolder/YourMesh.lm", Laya.Handler.create(null,function(mesh) {
    var obj = sprite3D.addChild(new Laya.MeshSprite3D(mesh));
    obj.transform.localScale = new Laya.Vector3(4, 4, 4);
    obj.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);   
    obj.transform.translate(new Laya.Vector3(0, 0, 7));
}));
```

### 5. 预设加载

单个预设的加载，我们使用`Laya.Sprite3D.load()`方法。

```typescript
//加载精灵
Laya.Sprite3D.load("res/YourPrefabsFolder/YourPrefab.lh", Laya.Handler.create(null, function(sp){
    var obj = scene.addChild(sp);
    obj.transform.localScale = new Laya.Vector3(4, 4, 4);
    obj.transform.translate(new Laya.Vector3(-10, 13, 0));
}));
```

### 6. 动画加载

单个动画加载，本次示例使用的角色导出时是有动画信息的，在导出后我们删除`.lh`文件中动画相关的信息，只是演示使用。在后期使用中替换骨骼动画可以使用这种方式。

```typescript
//加载胖子精灵
Laya.Sprite3D.load("res/YourFrefabsFolder/YourFrefab.lh", Laya.Handler.create(null, function(sp) {
    var obj = scene.addChild(sp);
    obj.transform.localScale = new Laya.Vector3(4, 4, 4);
    obj.transform.translate(new Laya.Vector3(-20, 13, 0));
    //获取动画组件
    var animator = obj.getChildAt(0).getComponent(Laya.Animator);
    //AnimationClip的加载要放在Avatar加载完成之后
    Laya.AnimationClip.load("res/YourAnimFolder/YourAnim.lani", Laya.Handler.create(null, function(aniClip) {
        //创建动作状态
        var state1 = new Laya.AnimatorState();
        //动作名称
        state1.name = "hello";
        //动作播放起始时间
        state1.clipStart = 0 / 581;
        //动作播放结束时间
        state1.clipEnd = 581 / 581;
        //设置动作
        state1.clip = aniClip;
        //设置动作循环
        state1.clip.islooping = true;
        //为动画组件添加一个动作状态
        animator.getControllerLayer(0).addState(state1);
        //播放动作
        animator.play("hello");
    }));
}));
```

### 批量预加载资源

上面的例子`Laya.Scene.load()`方法是资源的**异步加载**，有时候3D的资源比较大，需要**预加载**来来提升首屏的体验。这时候我们可以用**加载器预加载**。

2D游戏资源我们是用`Laya.loader.load()`方法预加载；

3D资源必须用`Laya.loader.create()`这个方法。

在加载完成后，我们就可以直接使用`Laya.loader.getRes()`这个方法来获取加载完成的资源。请参考的相关的 [API描述](https://layaair.ldc.layabox.com/api2/Chinese/index.html?category=Core&class=laya.net.LoaderManager) 。

```typescript
......
//批量预加载方式
PreloadingRes(){
    //预加载所有资源
    var resource:Array = ["res/threeDimen/scene/TerrainScene/XunLongShi.ls",
                          "res/threeDimen/skyBox/skyBox2/skyBox2.lmat",
                          "res/threeDimen/texture/earth.png",
                          "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm",
                          "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh",
                          "res/threeDimen/skinModel/BoneLinkScene/PangZiNoAni.lh",
                          "res/threeDimen/skinModel/BoneLinkScene/Assets/Model3D/PangZi-Take 001.lani",];
    Laya.loader.create(resource, Laya.Handler.create(this, this.onPreLoadFinish));
}
onPreLoadFinish() {
    //初始化3D场景
    var _scene = Laya.stage.addChild(Laya.Loader.getRes("res/threeDimen/scene/TerrainScene/XunLongShi.ls"));
    //获取相机
    var camera = _scene.getChildByName("Main Camera");
    //设置相机清楚标记，使用天空
    camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
    //调整相机的位置
    camera.transform.translate(new Laya.Vector3(0, 45, -60));
    camera.transform.rotate(new Laya.Vector3(0, 180, 0), false, false);
    //相机视角控制组件(脚本)
    camera.addComponent(CameraMoveScript);
    //添加光照
    var directionLight = _scene.addChild(new Laya.DirectionLight());
    //光照颜色
    directionLight.color = new Laya.Vector3(1, 1, 1);
    directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0));
    //使用材质
    var skyboxMaterial = Laya.Loader.getRes("res/threeDimen/skyBox/skyBox2/skyBox2.lmat") as BaseMaterial;
    var skyRenderer = camera.skyRenderer;
    skyRenderer.mesh = Laya.SkyBox.instance;
    skyRenderer.material = skyboxMaterial;
    //关闭场景中的子节点
    (_scene.getChildByName('Scenes').getChildByName('HeightMap') as Laya.MeshSprite3D).active = false;
    (_scene.getChildByName('Scenes').getChildByName('Area') as Laya.MeshSprite3D).active = false;
    //使用纹理
    var earth1 = _scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(5, 32, 32)));
    earth1.transform.translate(new Laya.Vector3(10, 20, -8));
    var earthMat = new Laya.BlinnPhongMaterial();
    earthMat.albedoTexture = Laya.Loader.getRes("res/threeDimen/texture/earth.png");
    earthMat.albedoIntensity = 1;
    earth1.meshRenderer.material = earthMat;
    //获取Mesh资源
    var mesh = Laya.Loader.getRes("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm");
    //为精灵设置Mesh资源
    var layaMonkey = _scene.addChild(new Laya.MeshSprite3D(mesh));
    layaMonkey.transform.localScale = new Laya.Vector3(4, 4, 4);
    layaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
    layaMonkey.transform.translate(new Laya.Vector3(0, 3, 7));
    //使用精灵
    var sp = Laya.Loader.getRes("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh");
    var layaMonkey2 = _scene.addChild(sp);
    layaMonkey2.transform.localScale = new Laya.Vector3(4, 4, 4);
    layaMonkey2.transform.translate(new Laya.Vector3(-10, 13, 0));
    //使用精灵
    pangzi = Laya.Loader.getRes("res/threeDimen/skinModel/BoneLinkScene/PangZiNoAni.lh") as Sprite3D;
    pangzi = _scene.addChild(pangzi);
    pangzi.transform.localScale = new Laya.Vector3(4, 4, 4);
    pangzi.transform.translate(new Laya.Vector3(-20, 13, 0));
    //获取动画组件
    pangziAnimator = pangzi.getChildAt(0).getComponent(Laya.Animator);
    var pangAni = Laya.Loader.getRes("res/threeDimen/skinModel/BoneLinkScene/Assets/Model3D/PangZi-Take 001.lani");
    //创建动作状态
    var state1 = new Laya.AnimatorState();
    //动作名称
    state1.name = "hello";
    //动作播放起始时间
    state1.clipStart = 0 / 581;
    //动作播放结束时间
    state1.clipEnd = 581 / 581;
    //设置动作
    state1.clip = pangAni;
    //设置动作循环
    state1.clip.islooping = true;
    //为动画组件添加一个动作状态
    pangziAnimator.getControllerLayer(0).addState(state1);
    //播放动作
    pangziAnimator.play("hello");
}
```

在项目中，一般采用加载器的方式，这样做对资源有很好的管理。