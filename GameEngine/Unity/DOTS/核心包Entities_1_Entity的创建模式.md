# Entity的创建模式

## 一、Unity下创建游戏对象的过程

1. 在场景中创建GameObject
2. 为GameObject添加功能组件
3. 编写用于修改GameObject组件属性的MonoBehaviour脚本

或完全用MonoBehavior处理上述3步。

- UnityEngine.GameObject是一个C#类，是Unity.Component实例的容器。并且必须由一个Transform Component，可以组织成父子对象层级。
- UnityEngine.Component也是一个C#类，里边由Update方法和其他方法在引擎的Game Loop时调用，并且可以被多个托管类型对象引用，包括GameObject和其他Component,Asset等。
- 托管对象无法使用Burst编译，所以除一些特殊类型外，一般来说无法在Jobs中使用，并且托管对象需要GC回收，所以创建和销毁GameObject和它们的Components开销较高。
- 托管对象无法整体的在内存中打包，对Cache不友好。

## 二、Unity下创建Entities对象的模式

- Authoring模式（创作模式、编排模式）创建
- Runtime模式创建

### 2.1 编排模式创建Entities对象的过程

1. 创建一个EntitySubScene
2. 在SubScene下创建GameObject
3. 为GameObject添加默认Component和自定义的IComponentData
4. 自定义IComponentData创建Baker来完成数据编排

- Entity SubScene是一个用于GameObject Bake的场景
- Baking将编辑器中的GameObject转换为写入Entity Scene的Entity,也就是将Authoring下的数据转换为运行时数据。每次编辑Entity Scene中的对象时都会触发Baking，并且是增量Baking。
- Baker用来创建自定义数据，用来将自定义组件数据附加到所属的已经创建的Entity上。
- Baking System用来处理Baker产生的数据输出，它只作用在Entity数据上，不能作用在托管的Authoring数据上，可以使用Jobs和Burst。此功能可选。

## 2.2 运行模式创建Entities对象的过程

1. 创建一个World
2. 通过World中的EntityManager创建管理Entity
3. 通过该World中的EntityManager创建Entity对应的Component
4. 根据创建的Entity或EntityAchetype来实例化Entity
5. 通过System实现Entity对应的逻辑

- World是Entities的集合，每个Entity在一个世界中ID是唯一的，但也可能和其他世界的Entity ID相同，所以通常情况下通过ID查找不是一个安全的方式。
- EntityManager用来管理世界的所有Entities，有CreateEntity，DestroyEntity，AddComponent, RemoveComponent，GetComponentData，SetComponentData等接口。
- Entity是一个整型Id与Version数据组成的结构体，会与Unity.Entities的Component有映射，Entity之间没有父子关系。
- Unity.Entities.IComponentData是一个C#结构体（或者类），可以被Entities ID索引，但无法被托管对象引用（一般情况），并且没有任何方法（通常），在内存中紧密排列存储，通过Query访问更高效。
- System包括SystemBase与ISystem，SystemBase是托管类，简单。但运行在主线程，不能被burst编译，ISystem是Struct，非托管，可以被编译，相当快，但实现起来会有点复杂。

例子：
```c#
//创建新world
var world = new World("test");
//获取World中的EntityManager
var entityMgr = world.EntityManager;
//创建Entity
Entity entity = entityMgr.CreateEntity();
//为创建的entity绑定Component
entityMgr.AddComponent<CubeGeneratorByScript>(entity);
//获取Component数据副本，并设置相关数据后再设置回对应的Component
var generator = entityMgr.GetComponentData<CubeGeneratorByScript>(entity);
generator.cubeCount = CubeCount;
entityMgr.SetComponentData(entity, cubePrototype);

...

//System中实例化
var generator = SystemAPI.GetSingleton<CubeGeneratorByScript>();

var cubes = CollectionHelper.CreateNativeArray<Entity>(generator.cubeCount, Allocator.Temp);
state.entityManager.Instantiate(generator.cubeEntityProtoType, cubes);

cubes.Dispose();
```