# UE4的Gameplay框架

## Game Mode

GameMode控制游戏流程，定义关卡的游戏规则。在网游里会被放在服务端。

### Game Mode Base类

GameMode基类定义了游戏的基本规则

GameMode是玩法框架中的蓝图最顶层



## Game State

GameState和GameMode配合使用。

GameState记录着游戏的状态信息。在网游中都存在于客户端和服务端。客户端可以请求GameState关于游戏的当前状态。服务端可以修改游戏的当前状态，并发给所有客户端。

### Game State Base类



## Game Instance

当游戏启动的时候，GameInstance就成功创建了。只要游戏还在运行，GameInstance就一直存在。GameInstance贯穿游戏的始终。

GameInstance适合放置独立于关卡的数据，例如主界面UI的数据。

GameInstance可以在不同关卡之间传递消息。例如，玩家在某个关卡里打赢了一个挑战，可以将具体的信息存在GameInstance里。当玩家来到主界面的时候可以看到屏幕上显示的挑战项已被完成。

GameInstance是UObject的子类，不可被复制。存在于服务端和客户端。服务端或客户端除了自身，不会发现其他的GameInstance。

GameInstance用过Project Settings | Maps &Modes | Game Instance class进行设置。

## Actor类

Actor类是所有可以在游戏世界中放置和生成的对象的基类。

Actor支持对象的位置、角度、缩放的变换

Actor可以挂载任意数量的Actor组件类，这些Actor组件类定义了这个Actor是如何移动和被渲染的。

Actor默认没有任何可视化的表现形式，它的表现形式取决于挂在上边的组件。

Actor支持复用和函数调用。

生命周期



## Pawn类

Pawn是Actord的子类。它具有游戏中角色的物理表现和NPC的AI。

Pawn由Controller控制，可以是PlayerController也可以是AIController。

pawn即使默认没有视觉表现，也能在游戏世界里表示自身的位置，角度，缩放等。

pawn可以由自己的动作逻辑，但最好由Controller来控制。

Pawn可以在网络间复制。

## Character类

Character是Pawn的子类，在Pawn的基础上进行了很多拓展，比如可以移动、有碰撞。

Character的视觉表现支持动画的骨骼网格体。

Character自带胶囊体组件，并以此模拟物理碰撞。

Character的Movement组件，具有丰富的操控角色的功能，包括：走、跑、条、游、飞等。而且这个组件是Charactor特有的，区别于其他的class。

Character具有网络功能。

Character是操作两足类长相的角色的首选class。

当我们进入到一个创建的Charactor蓝图里，会看到如下组件：

- 胶囊体组件（CapsuleComponent）：这是actor的根部组件。它负责处理物理碰撞。CharacterMovement按照玩家输入，使胶囊体进行移动等活动。
- 箭头组件（ArrowComponent）：这是一个editor-only组件，它指明了角色的朝向。
- 网格体组件（Mesh）：Mesh是角色的视觉表现，并且属于骨骼网格体组件类型。
- 角色动作组件（CharacterMovement）：这个组件处理角色的动作逻辑。更新胶囊体的位置和转向，使其可以移动。



## Player Controller

PlayerController是Controller的子类。由玩家输入来控制Pawn，相应的，AIController由人工智能控制。

可以用一个PlayerController代表一个玩家。

默认情况下，一个Controller可以在任何时候通过调用`Possess()`函数控制一个Pawn。通过调用`UnPosses()`函数来停止控制。Controller也可以接收来自正在控制的Pawn的通知。

在网游里，服务端可以发现所有的客户端的controller，客户端只能发现自身的controller。



## Player State

PlayerState是每个玩家的可以访问的一个Actor。在单人游戏里只存在一个PlayerState，在多人游戏里，每个玩家都有自己的一个playerstate。

因为PlayerState是一种拷贝，客户端和服务端都可以发现所有玩家的PlayerState。

PlayerState可以通过`GameState`类访问。GameState是一个存放玩家数据的地方，比如分数，昵称等。



## 蓝图

UE特有的一种图形化编程工具。

## 关卡蓝图

关卡蓝图是特殊的蓝图，每一个关卡绑定一个关卡蓝图。关卡蓝图不能添加组件，只能进行图表操作。关卡蓝图不能复用。开发者可以在关卡蓝图中引用场景中的物体。

## 蓝图类

类似Unity的预制体。包含了很多组件和功能（代码），可以复用，放到场景中相当于实例化。



## 例子

如果你在写一个大逃杀类游戏，你可以使用以下类：

- `Game Mode`：这个类定义游戏规则。在这个类里，你可以记录每一局的玩家参与数、追踪没被淘汰的玩家的数量、被淘汰的玩家数量和，中途退游的玩家数。除此之外，这个类还可以记录游戏中的载具、局数等。
- `Game State`：这个类记录所有的游戏状态。例如当游戏从等待开始进入正式开始，GameState接收到这一状态转变后通知所有的客户端，游戏正式开始。
- `Game Instance`：这个类用于存储游戏中的挑战完成等记录，以便玩家回到主界面的时候能看到。
- `Character`：所有角色的视觉表现。
- `Pawn`：游戏中的某辆载具或某只动物。
- `Player Controller`：这个类处理玩家输入，创建并管理UI。同时可以发送RPC（远程方法调用）到服务端。让服务端可以察觉到所有客户端的controller。
- `Player State`：这个类用于存储玩家的具体数据，例如：击杀数、子弹数等。



## Component

### ActorComponent

### SceneComponent





## UObject

功能：

1. Garbage collection垃圾回收
2. Reference updating引用自动更新
3. Reflectio反射
4. Serialization序列化
5. Automatic updating of default property changes自动检测默认变量的更改
6. Automatic property initialization自动变量初始化
7. Automatic editor integration和UE编辑器的自动交互
8. Type information available at runtime运行时类型识别
9. Network replication网络复制