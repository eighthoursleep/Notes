# UE4玩法类（Gameplay Class）

## Actor

Actor类是所有可以在游戏世界中放置和生成的对象的基类。

Actor支持对象的位置、角度、缩放的变换

Actor可以挂载任意数量的Actor组件类，这些Actor组件类定义了这个Actor是如何移动和被渲染的。

Actor默认没有任何可视化的表现形式，它的表现形式取决于挂在上边的组件。

Actor支持复用和函数调用。

生命周期



## Game Mode Base

GameMode基类定义了游戏的基本规则

GameMode是玩法框架中的蓝图最顶层



## Game State Base



## Game Instance



## Pawn



## Character



## Player Controller



## Player State



## Component

### ActorComponent

### SceneComponent





## UObject

功能：

1. 反射
2. 垃圾回收
3. 序列化（存档，反序列化：读档）
4. COD（Class Object Default，类默认对象）