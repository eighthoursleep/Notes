# UE4笔试面试题

作者：冰来
链接：https://www.jianshu.com/p/6461afc2cfc7

一、

1. **Actor的EndPlay事件在哪些时候会调用？**

   EndPlay：在数个地方调用，保证 Actor 的生命走向终点。在游戏过程中，如包含流关卡的 Actor 被卸载，Destroy 将发射此项和关卡过渡。
   调用 EndPlay 的全部情形：

   1. 对 Destroy 显式调用
   2. Play in Editor 终结
   3. 关卡过渡（无缝行程或加载地图） 包含 Actor 的流关卡被卸载
   4. Actor 的生命期已过
   5. 应用程序关闭（全部 Actor 被销毁）

2. **`BlueprintImplementableEvent`和`BlueprintNativeEvent`之间有什么区别？**

   两者都是函数标记，用于修饰函数。
   
   `BlueprintImplementableEvent`：在C++可以声明函数（不能定义，蓝图重写），在C++里调用该函数，蓝图重写实现该函数`BlueprintNativeEvent`：在C++可以声明和定义函数，在C++里调用该函数，蓝图重写实现该函数（蓝图可以重写或不重写C++父类函数）
   使用方法:
   
   ```cpp
   UFUNCTION(BlueprintImplementableEvent) void TestA();
   UFUNCTION(BlueprintNativeEvent) void TestB();
   ```

   [UE4函数标记BlueprintImplementableEvent和BlueprintNativeEvent区别](https://blog.csdn.net/luomogenhaoqi/article/details/89311695)

3. **`BlurprintPure在什么时候使用？**

   BlueprintPure在C++和蓝图中都可以调用，但是其修饰的函数必须有函数返回值或函数参数输出，否则会编译失败。被声明的函数不会以任何方式拥有对象，并且可以在蓝图或级别蓝图图标中执行。

   因此，BlueprintPurs修饰的函数，主要用于

   1. 数学中的“+、-、*、/”操作  （数值处理）
   2. 变量获取节点（获取变量中的部分数据）

   [UE4入门-常见的宏-UFUNCTION](https://blog.csdn.net/u012793104/article/details/78487893)
   [UE4的BlueprintPure用法](https://blog.csdn.net/luomogenhaoqi/article/details/89313412)

4. **UE4的蓝图中对于`Foreach`等循环采用的是类似并行的方式，试实现一个串行的方法。**

   

5. **如何解决子弹穿墙问题？**

   如果采用的是射线检测的话，`LineTracebyChannel`函数只会返回首个命中对象。

   但为了防止真出现子弹穿墙问题，我们可以让`LineTracebyChannel`只要击中一个物体就会停止射线检测。

   如果采用的是为子弹单独制作成一个物体的话，在射击时，只要将墙体和子弹的碰撞属性设为Block,便会阻止子弹继续前进。

   [UE4-（蓝图）第二十一课射线](https://blog.csdn.net/lei_7103/article/details/95047081)
   [UE4碰撞规则详解](https://gameinstitute.qq.com/community/detail/121622)

6. **UE4对`UStruct`的内存会自动管理吗？**

   不会， 只有使用UPROPERTY宏标记的USTRUCT才能被计入垃圾回收。

   [UE4入门-常见的宏-UPROPERTY](https://blog.csdn.net/u012793104/article/details/78480085?spm=1001.2014.3001.5501)
   [UE4入门-常见的宏-USTRUCT](https://blog.csdn.net/u012793104/article/details/78594119)

7. **在客户端是否可以获取到`AIController`？**

   不可以，在DS（dedicated server）模型下，AIController只存在于服务端，其主要是通过在服务端对Pawn进行操控， 然后再同步到客户端。

   [UE4 AIController](https://zhuanlan.zhihu.com/p/120294058)
   [设置专用服务器](https://docs.unrealengine.com/4.26/zh-CN/InteractiveExperiences/Networking/HowTo/DedicatedServers/)

8. **客户端上面能够执行RPC的对象有哪些？**

   RPC（远程过程调用），是在本地调用但能在其他机器（不同于执行调用的机器）上远程执行
   的函数。
   在客户端上能够执行RPG的对象需要满足：
   （1）该Actor必须被复制
   （2）如果RPC是从客户端调用并在服务器上执行，客户端就必须拥有调用RPC的Actor。
   （3）如果是多播RPC是个例外：
   当从客户端调用时，只是在本地运行而非服务器上执行。

   [RPC](https://docs.unrealengine.com/4.26/zh-CN/InteractiveExperiences/Networking/Actors/RPCs/)

9. **如果在C++中需要使用windows的头文件，如何操作？**

   ```c++
   #include "AllowWindowsPlatformTypes.h"
   #include <windows.h>
   #include "HideWindowsPlatformTypes.h"
   ```

   [关于UE4引用windows头文件的类型冲突](https://blog.csdn.net/q526032763/article/details/101427723)
   [[UE4\][C++]使用Windows的SOCKET](https://blog.csdn.net/qq_36251561/article/details/103831478)

10. **在头文件中经常出现的`*.generated.h`是什么？**

    一个头文件中`include "xxx.generated.h"`，意味着这个头文件加入了反射系统。那些 `UPROPERTY`、`UFUNCTION`之类的宏，也标记着这些方法属性等等加入了 UE4 的反射系统，加入了反射系统，UE4 才能帮你做 GC（垃圾回收），你才能实现蓝图、C++ 通信等等很多功能。
    [【UE4】“xxx.generated.h”](https://blog.csdn.net/Bob__yuan/article/details/106200971)

二、

**1、对一个Actor调用AIMoveTo失败了，其可能原因是什么？**

（1）未放入NavMesh和NavRecast；

（2）Nav导航组件设置太大，也可能会导致失效；

（3）目标点超出Nav导航范围。

[UE4 AI移动到 出现的BUG以及解决方案](https://blog.csdn.net/qq529519633/article/details/89308907)

**2、试说出宏、函数、事件的部分区别和联系。**

函数与事件的区别：
1、函数有返回值，事件无返回值
2、函数调用会等待函数执行结果，事件调用只是触发但不会等待。
3、函数执行在同一个线程，事件执行在不同线程。
4、函数可以用局部变量，事件没有局部变量。
5、因为函数执行顺序有保证，所以优先使用函数
6、没有返回值的函数，在被子类Overide时，会变成事件。
宏与函数的区别在于：
（1）宏是直接展开，即直接将宏的代码直接复制替换到所有使用当前宏的地方，
这点类似于c++中的宏，而函数则是需要编译。
（2）宏运行时无实体，函数运行时有实体。
（3）宏有多个入口Exec多个出口Exec，函数只有一个入口Exec一个出口Exec。
（4）宏可以使用Delay,函数不可以使用Delay。
（5）宏不可以复制，函数可以复制。
（6）宏的参数可以使用“Exec”类型，函数不可以
[UE4函数和事件的区别](https://blog.csdn.net/weixin_30950887/article/details/98530975)
[UE4宏](https://www.cnblogs.com/timy/p/10186974.html)

**3、试使用C++实现一个对蓝图中任意Actor排序的框架。**

（1）创建蓝图宏库，鼠标右键->Blueprints->Blueprint Macro Library ->
All Classes->Object，以UObject作为蓝图宏库的基类。
（2）My Blueprint窗口，Add New创建二个宏Select Sort、Bubble Sort；
（3）实现代码逻辑
Description：
选择排序(详情请查阅选择排序方法)
bGreater=( Array[min] >Array[i] ) ? true : false;
将Array[min]与Array[i]成员的大小比较结果连接上bGreater(pin)
内部循环根据bGreater(bool)值判断是否交换Array[min]与Array[i]成员位置
排序结束，返回有序数组
[第1期 在蓝图实现任意类型数组排序](https://zhuanlan.zhihu.com/p/127344363)

**4、Blueprintable和BlueprintType的意义。**

Blueprintable：将使用该宏标志的类公开为创建蓝图的可接受基类（类似于：那些base类）。

其默认为NotBlueprintable，即不可以创建蓝图子类。

BlueprintType：将使用该宏标志的类公开为可用于蓝图中变量的类型（类似于：int）。

与之对应的有NotBlueprintType，即不可以在蓝图中创建该类型的变量。

[UE4入门-常见的宏-UCLASS](https://blog.csdn.net/u012793104/article/details/78547655?spm=1001.2014.3001.5501)

**5、客户端上面对一个Actor中的RPC事件调用失败，可能原因是什么？**

（1）该Actor不可被复制

（2）其他的客户端上，未拥有可以调用RPC的Actor。

（3）在Pawn派生类的蓝图收到Possessed事件时，Connection->ViesTarget还未被赋值。

[ue4 rpc调用不起作用](https://blog.csdn.net/xiaozhi0999/article/details/51489901)
[RPC](https://docs.unrealengine.com/4.26/zh-CN/InteractiveExperiences/Networking/Actors/RPCs/)

**6、UE4中的RPC事件有哪些？**

RPC主要包括Multicast（广播）、Run On Server（在服务端执行）和Run On Owning Client
（在客户端执行）三种类型。其中广播类型在服务器上调用执行，然后自动转发给客户端；
在服务端执行的函数有客户端调用，然后仅在服务器执行。在客户端执行的函数由服务器
调用，然后仅在自己的客户端上执行。
[UE4网络之（二） 远程调用函数（RPC）](https://www.jianshu.com/p/7648c57b8f9a)

**7、如何设置Actor的同步间隔？**

更改Actor中的：NetUpdateFrequency 网络更新频率属性。

[深入浅出UE4网络](https://www.cnblogs.com/Leonhard-/p/6511821.html)
[UE4网络同步属性笔记](https://www.cnblogs.com/mattins/p/9476073.html)

**8、若需要实现一个多播事件，如何操作？**

不是很理解这个问题问的是网络的多播，还是多播委托。
网络的多播：（1）先使用"Switch Has Authority"判断是否在服务器端。然后在事件的
Detials中将Replacates设置为Multicast。
（2）先创建一个只在服务端运行的事件，然后由该事件去执行播放方法。
多播委托：
（1）构建动态代理
（2）在类内部声明动态代理对象
（3）在蓝图中绑定
（4）在CPP中执行多播委托。
[UE4多播（广播）](https://www.cnblogs.com/timy/p/9977209.html)
[UE4在C++中实现多播通知到蓝图（动态代理应用）](http://www.uejoy.com/?p=476)

**9、连接服务器的命令是什么，如何传递参数？**

连接服务器的命令是Socket->Connect（*addr）； 其中的*addr是InternetAddr指针，用于传递IP和Port。

[UE4 客户端与服务器的通信](https://blog.csdn.net/weixin_39781267/article/details/81745853)
[UE4基础三：客户端服务器连接流程](https://zhuanlan.zhihu.com/p/60996708)
[网络概述](https://docs.unrealengine.com/4.26/zh-CN/InteractiveExperiences/Networking/Overview/)

**10、为什么需要TWeakPtr？**

TWeakPtr不会参与应用技术，当TWeakPtr指向的对象不存在共享指针指向时，TWeakPtr将 自动失效，所以该指针的时候需要有效性判断。用于非UObject类，想要引用它又不想因为引 用它而影响引用计数时。

[【UE4】共享（智能）指针用法](https://blog.csdn.net/github_38111866/article/details/107712692)
[TWeakptr，TWeakObjectPtr和TSoftPtr的概念，为什么要引入这几个概念？](https://blog.csdn.net/zhangxiaofan666/article/details/99733735)

三、

**1、如果要在游戏的开始和结束执行某些操作，可以在UE4哪儿处理？**

如果你是指的一个关卡的开始和结束位置执行某些操作的话，可以创建一个Actor专门用于执行
这些事件。开始的操作放在BeginPlay中，结束的操作是在EndPlay中。BeginPlay会在关卡开
始时调用，EndPlay会在关卡切换的时候调用。注意该Actor不能提前调用Actor的EndPlay。
如果是还要开始一些的话，就是LevelActor的Construct()函数。
如果是还要晚一些的话，就是LevelActor的BeginPlay()函数。
再开始一些的话，就是GameInstance中的Init()函数。
[Actor生命周期](https://docs.unrealengine.com/4.26/zh-CN/ProgrammingAndScripting/ProgrammingWithCPP/UnrealArchitecture/Actors/ActorLifecycle/)
[UE4 游戏模块初始化顺序](https://www.cnblogs.com/lixiao24/p/9325211.html)

**2、UE4中，各种字符编码如何转换？**

可以通过以下的五个宏来完成字符编码转换。
    TCHAR_TO_ANSI(str)
    TCHAR_TO_OEM(str)
    ANSI_TO_TCHAR(str)
    TCHAR_TO_UTF8(str)//TCHAR转UTF8
    UTF8_TO_TCHAR(str) 
[字符编码](https://docs.unrealengine.com/4.26/zh-CN/ProgrammingAndScripting/ProgrammingWithCPP/UnrealArchitecture/StringHandling/CharacterEncoding/)

**3、C++源文件中的注释在蓝图中显示为乱码，为什么？**

需要将C++源文件的文件编码格式改为UTF-8格式。

[【UE4】C++蓝图节点中文注释乱码解决](https://blog.csdn.net/o0pk2008/article/details/104895277)

**4、插件中的LoadingPhase是什么？**

LoadingPhase主要用于控制插件在引擎启动的何时被加载。 

有三个选项如下： 

Default为正常阶段加载该模块。 

PreDefault为正常阶段前来加载模块。

PostConfigInit为在引擎开始加载核心的子系统前加载该模块。

[插件](https://docs.unrealengine.com/4.26/zh-CN/ProductionPipelines/Plugins/)
[UE4 插件配置文件参数意义](https://blog.csdn.net/qq_35760525/article/details/76454488)

**5、如何切换不同的引擎版本？**

1、直接在Epic商城里面找到虚幻引擎选项，进入后，点击启动旁边的那个下拉符号，即可切换版本。

2、先找到项目文件夹下的.uproject文件，然后鼠标右键->Switch Unreal Engine version， 切换好版本后，直接打开即可。

[打开不同UE4版本的工程](https://blog.csdn.net/qq_40544338/article/details/105431899)

**6、对于一个团队项目，如何处理DDC？**

DDC为派生数据缓存。 如果是同一地点的团队或者是小团队，可以设置共享DDC。此为所有团队成员和构建计算机均可读取/写入的网络驱动器。

 如果是大型项目，并希望分发预构建DDC数据，则应该生成DDC pak。

[派生数据缓存](https://docs.unrealengine.com/4.26/zh-CN/ProductionPipelines/DerivedDataCache/)

**7、UFUNCTION，UPROPERTY等宏的作用是什么？**

UFUNCTION宏用于将C++函数设置为UE4反射系统可识别的C++函数。其函数说明符可以更改 UE4解释和使用函数的方式。

UPROPERTY宏则是可以通过定于属性元数据和变量说明符，来对属性实现一些UE的特定操作。 如显示到细节面板。

[UFUNCTION/UPROPERTY/UCLASS](https://zhuanlan.zhihu.com/p/149392857)

UE4的宏可以分为四种：UCLASS、USTRUCT、UFUNCTION、UPROPERTY。 

其中： 

UCLASS用于修饰类

USTRUCT用于修饰结构体

UFUNCTION用于修饰函数

UPROPERTY用于修饰变量。

[UE4类型系统、语言修饰符和元数据](https://www.cnblogs.com/kekec/p/14274356.html)
[UE4入门-常见的宏-UCLASS](https://blog.csdn.net/u012793104/article/details/78547655?spm=1001.2014.3001.5501)
[UE4入门-常见的宏-UPROPERTY](https://blog.csdn.net/u012793104/article/details/78480085?spm=1001.2014.3001.5501)
[UE4入门-常见的宏-USTRUCT](https://blog.csdn.net/u012793104/article/details/78594119)
[UE4入门-常见的宏-UFUNCTION](https://blog.csdn.net/u012793104/article/details/78487893)

**8、如何给AI增加playerstate？**

默认情况下，AI并没有playerstate，如果需要，可以在构造函数中增加   bWantsPlayerState = true;

[为AI增加playerstate](https://blog.csdn.net/haisong1991/article/details/79832754)

**9、ProjectileComponent是否同步？若未同步，如何操作？**

并不是同步的。需要通过RPC进行同步。

[【UE4】网游开发中的RPC和OnRep（一）](https://zhuanlan.zhihu.com/p/343847343)

**10、若要更改某个Actor中的组件为其派生的组件，如何操作？**

不知道我是否理解错误，这个“其派生的组件”中的“其”是指的Actor中的组件。 在一开始将该父类组件申明为指针，当要更改时，直接指向其派生的组件对象即可。

[怎么理解C++多态的“父类指针或引用指向子类对象”？](https://blog.csdn.net/qq_21989927/article/details/111226696)

四、

**1、UE4的游戏框架包含哪些内容？**

（1）使用玩家输入或者AI逻辑控制Pawns

Controller是一个负责指导Pawn的Actor。它们通常有两种版本，AIController和PlayerController。控制器可以“拥有”一个Pawn来控制它。
PlayerController是Pawn与玩家控制他之间的接口。其代表了玩家的意志。
AIController是一个可以控制Pawn的模拟意志。

（2）代表世界的玩家、朋友、敌人

Pawn是一个actor。Pawn可以被Controller持有，他们可以接收输入，可以做很多游戏逻辑。
Character是一个人形风格的Pawn，继承自Pawn。他默认自带一个胶囊体碰撞器和角色运 
动组件。他可以做到基本的人形移动，他可以平滑的复制移动并且有一些动画相关的功能。

（3）向玩家展现信息

HUD是一个抬头显示器。可以显示健康、弹药等，每个PlayerController通常有一个。
Camera相当于玩家的眼球并且管理他的行为。每个PlayerController通常也有其中一个。

（4）设置与追踪游戏的规则

游戏模式（GameMode）游戏的概念分为两类。GameMode与GameState是游戏的定义，
包括像游戏规则的事情，胜利的条件。他只存在于服务器上。他通常没有太多的数据变化，
也没有客户端需要了解的瞬态数据。
游戏状态（GameState）包括像关联球员名单得分，那里的作品是一盘棋，或者游戏中的
任务完成列表。GameState存在于所有服务器与客户端上，可自由复制使所有计算机保持
最新状态。
玩家状态（PlayerState）是游戏参与者的状态，PlayerState包含玩家姓名，得分，
类似MOBA的匹配等级。所有玩家的PlayerState存在于所有机器上，可以自由复制保持同步。
[UE4-游戏框架——GameMode、GameState、PlayerState、Controller、Pawn](https://blog.csdn.net/qq_33500238/article/details/99674576)
[Gameplay框架快速参考](https://docs.unrealengine.com/4.26/zh-CN/InteractiveExperiences/Framework/QuickReference/)

2、当前UE4在移动平台上面的问题有哪些？

3、如何获取UE4的源码？

4、UE4服务器的默认监听端口是哪一个？采用的是UDP还是TCP协议？

5、Tick中的帧时间是否可靠？若不可靠，如何操作？

6、UE4的打包方法有哪些？

7、如何制作差异包或者补丁？

8、试说出Selector、Sequence、Parallel的运作流程。

9、UE4中的AI感知组件有哪些？

10、在UE4的C++中调用父类的函数，如何操作？

五、

1、UE4内置的伤害接口是什么，有哪些类型？

2、UE4的蓝图部分在版本控制软件中无法进行比较，你是否有好的解决方案？

3、UE4中的联网会话节点有哪些？

4、UE4中的字符串有哪些？

5、获取和释放角色如何操作？

6、设置地图的游戏模式，有哪些方法？

7、玩家操作事件放在PlayerController和Pawn中，该如何选择？

**8、切换关卡的命令是什么？**

一般地图比较小，且关卡各自独立的时候，使用openLevel，通过输入一个LevelName来切换关卡。

当在开放世界，即地图特别大的时候，我们会将多个关卡拼接为一个大世界地图， 然后采用无缝切换地图的方式，来加载当前的地图。

此时有三个用来驱动转移的主要函数：
UEngine::Browse、UWorld::ServerTravel、 APlayerController::ClientTravel。
[Unreal Engine4关卡切换](https://www.jianshu.com/p/52d75ecf17c7)
[《Exploring in UE4》流关卡与无缝地图切换经验总结](https://zhuanlan.zhihu.com/p/34397446)
[多人游戏中的关卡切换](https://docs.unrealengine.com/4.26/zh-CN/InteractiveExperiences/Networking/Travelling/)

**9、UE4中是否可以支持回放？如何操作？**

**10、UE4的蓝图类型有哪些？**

六、

1、添加一个USTRUCT MyStruct，是否可以？

2、若要C++中的属性暴露给蓝图，如何操作？

3、在C++中为对象设置默认值有哪些方法？

4、C++中Reliable的意义是什么，该如何实现对应的操作？

5、如果项目中需要专用服务器，如何操作？

6、UE4中的Delegates有哪些？

7、如何分析性能瓶颈在哪儿？

8、UE4的碰撞类型有哪些？

9、UE4的服务器是否适应于MMO？若不适应，有什么解决方案？

10、动画蓝图是否支持同步？若不支持，有什么解决方案？

七、

注：后面的题目中，部分题目仅供参考，可能有争议。

1、材质参数、特效参数、声音参数如何使用？

2、若要对打包之后的版本进行跟踪和调试，如何操作？

3、C++中如何对组件或者Actor设置同步？

4、UE4的AA算法有哪些？

5、四元数相对于欧拉角的优点。

6、简述A*算法。

7、UE4中需要对一个原本不支持寻路的Actor实现寻路功能，如何实现？

8、UI中的锚是用来干什么的？

9、如何基于UE4的网络接口，实现一个网络层，如Steam？

10、对于打包之后的游戏资源，有什么加密方案？

八、

1、在Actor中增加了输入事件，但是输入事件却无法触发，其原因可能有哪些？

2、SpawnActor的位置不对，为什么？

3、在BeginPlay之后调用了某个RPC操作，客户端却没有执行到，可能原因是什么？

4、在客户端没有连接到服务器之前，有什么同服务器进行通信的方案吗？

5、如何在Actor中增加command命令？

6、命令行中ce和ke有什么作用？

7、UE4中的智能指针有哪些？

8、试描述你之前做过的项目中的部分功能。（没啥好说的，各个项目需求千差万别，主要目的是看有没有具体做过）

9、对根组件设置Scale会有问题吗？

10、如何在UE4中使用静态库或者动态库？

九、

1、试分析GameMode的运行流程，如从InitGame至Logout。（very hard， especially without source code）

2、UE4的自动化测试如何搞？

3、多个摄像机之间如何切换？

4、更新UI的方式有哪些？

5、如何区分并调节不同的音效？

6、如何销毁AIController？

7、在C++和蓝图中如何打印调试信息？

8、轴输入事件在值为0的时候会触发吗？

9、3DWidget如何使用？

10、游戏中的AI技术有哪些？

十、

1、导航网格和寻路组件各有什么作用？

2、对于编译整个引擎耗费的大量时间，有什么解决方案？

3、如何联机构建光照？

4、Montage是什么？

5、执行动画时，将动画和声音、特效匹配的较好的方案是什么？

6、如何获取动画的执行事件？

7、Service的执行时机是什么时候？

8、Observer Aborts的用途是什么？

9、如何更改UE4默认的同步带宽？

10、UE4中的数据存取方法有哪些？



来源：https://zhuanlan.zhihu.com/p/115267698

**A：C++篇**

```text
1.一个初始化语句，enum monthes{January,February = 3,March = 5,April = 7,May,June}，
则此时May的值为( )
A.4    B.5   C.8    D.9

2.UE4中用于访问基类方法的关键字是（ ）
A.this  B.supper    C.base  D.this

3.下列选项中属于UE4独有数据结构的是（ ）
A.List  B.Queue  C.TArray  D.数组[]

4.下面有关UE4 C++描述正确的是（ ）
A.UE4 C++使用的是 C++ 14版本的语法
B.蓝图可以调用C++的方法，C++不能调用蓝图的方法
C.UCLASS宏定义参数为空的时候，是没有任何意义的。所以这个宏仅仅只是为了阅读方便
D.自定义一个AActor子类，带有UPROPERTY标签的属性是支持反射的

5.下列方法中不能用来创建一个Actor的是（ ）
A.New  B.SpawnActor  C.NewObject  D.ConstructObject
```

**B:UE4篇【问答题】**

```text
1.在Play状态下，如何查看和更改一个UMG对象的属性？
2.在什么情况下必须使用C++开发？
3.蓝图与C++具体的区别，如何搭配使用？
4.详述GamePlay架构的理解
5.在切换场景的时候如何保持数据不被销毁。有哪些方式？
```

**答案：**

```text
A:1. C  2.B  3.C  4.D  5.A
B:静待下次更新.
```

# 腾讯2020 unreal虚幻面试题

版权声明：本文为CSDN博主「bommy游戏」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/qq_17347313/article/details/107877912

1.lua性能优化的方向
    申请的内存,是造成卡顿的原因之一，在C++与lua交互中，如果参数或者返回值有类变量，那么这个变量不会再交互的栈中存放数据，而会通过申请内存，再指定在交互，这样就造成卡顿，因此可以通过把C++的对象的每个参数分开单独传递，可以解决问题，当时我们游戏改完这个问题后，整体提升了2帧。

    其实，主要是Tick循环中，减少与C++的交互，需要的数据不要每帧都去拿，其次，经常拿的一些数据（比方说主角信息），可以做一个lua缓存，在lua中获取。

2.ui 排行榜做法
    分页请求数据，间隔更新数据，ui窗口池，循环使用

3.ui层级管理，以及显示
    主要是通过树实现，子树ui后渲染，同级按照从上到下的顺序渲染，通过设计

4.ui渲染的底层实现
    我们使用CEGUI渲染，原理可以参考下面博客：

    https://blog.csdn.net/pizi0475/article/details/6323860

5.jenkins 流水线有哪些步骤
SVN最新拉取
调用unity相关生成逻辑
打包代码
发布
通知
6.ios打包流程
证书申请 https://developer.apple.com，进入开发者账号中心
申请App IDs

 添加测试机 

 新建开发证书描述文件

打包时指定对应的钥匙串 

7.武器的生产流程
    2D原画图 -> 3D模型 -> 蒙皮 -> 动作 -> 皮肤生产 

8.帧同步原理
    每个client上报自己的输入，server负责收集每帧所有client的输入，并下发给每个client,client根据输入计算状态，并表现

9.udp的弊端
    包乱序，丢包问题

10.帧同步怎么防作弊
    https://www.zhihu.com/question/58909016  知乎大佬们讨论的基本都有了

11.弱网 怎么处理丢包以及网络抖动
    弱网，需要保持画面流畅，可以通过增加jitterbuffer(根据网络抖动值，计算出的一个值，表示当前客户端可以缓存的最大帧，不会一次执行完，而会还是每个逻辑帧执行一帧，服务器即便发过来多帧，也不会一下执行完)

12.移动同步怎么做的
    预测的话，就是client计算的结果，然后每段时间会跟服务器的结果进行对比，算上RTT相差在一定的范围内，去校验，不对会进行拉扯，或者加速，减速去拟合。

13.ECS的最大优势
    因为组件的数据存储在一起，因此对于大量具有相同行为的对象处理，可以大大增加缓存命中率；
    可以保存快照信息，做录制与回放
14.几种GC算法
    这个网上有很多详细的教程，但是推荐一下快速了解的：https://www.jianshu.com/p/4c8333f77e39

15.堆排序
    看了不少，觉得这个比较通俗易懂：https://www.cnblogs.com/chengxiao/p/6129630.html

16.反射原理，以及应用


我们生成的dll程序集，会把我们的class method property field event等信息一起保存在一个类似lookup的表中，当我们使用反射的时候，会从里面找。

应用：1.通过反射获取带同样attribute标签的class，然后进行处理

2.通过反射“name”获取assembly中的类的类型，从而创建该类

3.通过方法名，获取类的方法，并调用

17.C++ 多态，多态继承是怎么做的
    编译时多态：重载（运算符，函数）

    运行时多态：通过virtual关键字标记，虚函数 是在基类中使用关键字 virtual 声明的函数。在派生类中重新定义基类中定义的虚函数时，会告诉编译器不要静态链接到该函数。我们想要的是在程序中任意点可以根据所调用的对象类型来选择调用的函数，这种操作被称为动态链接，或后期绑定。虚函数通过虚表实现，类或者父类含有virtual标记的函数的时候，该类会生成一个虚指针，以及一个VTable，VTable保存本类所有的虚函数，因此在向上转换后，调用同名函数，还是会调用子类的VTable中的函数。
    
    多态在继承的情况下，对新类的创建会先创建一个VTalbe，把父类的虚函数加入VTable，对于没有重新定义的虚函数使用基类函数的地址，对于重新定义的，使用子类的函数地址，新增的直接加入VTable。

18.C++11 可变长模板
    https://www.cnblogs.com/tekkaman/p/3501122.html

19.函数什么情况下会发生链接失败
    当编译器遇到一个模板定义时，它并不生成代码。只有当我们实例化出模板的一个特定版本时，编译器才会生成代码。当我们使用（而不是定义）模板时，编译器才生成代码，这一特性影响了我们如何组织代码以及错误何时被检测到。
通常，当我们调用一个函数时，编译器只需要掌握函数的声明。类似的，当我们使用一个类类型的对象时，类定义必须是可用的，但成员函数的定义不必已经出现。因此，我们将类定义和函数声明放在头文件中，而普通函数和类的成员函数的定义放在源文件中。
模板则不同：为了生成一个实例化版本，编译器需要掌握函数模板或类模板成员函数的定义。因此，与非模板代码不同，模板的头文件通常既包括声明也包括定义。
来源链接：https://www.zhihu.com/question/404644440/answer/1315656973

20.C++ static_cast、dynamic_cast
    static_cast：static_cast< new_type >(expression) 
说明：将expression 的类型转换为new_type ，没有运行时类型检查保证装换的安全性

用法：

        1.类层次中，基类与子类的指针或者引用转换，向上安全
    
        2.基本数据类型转换，安全性开发人员保证
    
        3.void*转换为目标类型指针，不安全
    
        4.把任何类型的表达式转为void*

   dynamic_cast：dynamic_cast< new_type >(expression) 
说明：new_type必须是类的指针 类的引用，或者void*，new_type与expression必须同为指针或者引用

用法：用于类层次间的向上或者向下转换，向上安全，向下具有安全监测，失败会抛出异常，相对静态转换更安全

21.C++11 右值  以及跟左值的区别
正常我们的语句都是左值引用，在C++11中，标准库在<utility>中提供了一个有用的函数std::move，std::move并不能移动任何东西，它唯一的功能是将一个左值强制转化为右值引用，继而可以通过右值引用使用该值，以用于移动语义。从实现上讲，std::move基本等同于一个类型转换：static_cast<T&&>(lvalue);

区别在于右值引用传递后，左值没有引用了，只有右值有了。有点在于传递引用过程中可以减少一次资源的创建和释放。

# UE4面试问题

版权声明：本文为CSDN博主「白色小店」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/qq_39857272/article/details/108292725

为什么选择ue4
1.UE4的下限更低，而上限更高。下限更低，低在完全不需要有任何编程基础，蓝图直接上手；上限更高，高在虚幻底层代码完全是开源的，使用c++作为基础语言，代码执行效率更高。
2.UE4展现出惊艳的画面和视觉冲击感更容易吸引用户
3.UE4的PBR材质（PBR是Physically-Based Rendering（基于物理的渲染)）和渲染系统
4.对于程序员来说，ue人才缺失，待遇更优。
常见的一些类
Actor类
Pawn类
Character类
PlayerController类
GameMode类
ActorComponent类
SceneComponent类
其他
动画蒙太奇
网格体动画的原理
多态是怎么实现的
虚表是哪时候生成的
Inline标识符的作用
Actorcomponent和scenecomponent的区别
Pawn和actor的区别



[UE4]函数和事件的区别

一、函数有返回值，事件无返回值

二、函数调用会等待函数执行结果，事件调用只是触发但不会等待。

三、函数执行在同一个线程，事件执行在不同线程。

四、函数可以用局部变量，事件没有局部变量。

 五、因为函数执行顺序有保证，所以优先使用函数

六、没有返回值的函数，在被子类Overide时，会变成事件。



# UE4的宏

UE4中的宏，和函数比较相似，都是对一些功能算法进行了封装，都有一个输入点和输出点，调用方法也类似。
宏与函数的区别在于：

1. 宏是直接展开，即直接将宏的代码直接复制替换到所有使用当前宏的地方，这点类似于c++中的宏，而函数则是需要编译。
2. 宏运行时无实体，函数运行时有实体。
3. 宏有多个入口Exec多个出口Exec，函数只有一个入口Exec一个出口Exec。
4. 宏可以使用Delay,函数不可以使用Delay。
5. 宏不可以复制，函数可以复制。
6. 宏的参数可以使用“Exec”类型，函数不可以

宏的特点：

1. 类的成员函数可以被子类继承，但宏不会被继承，子类无法使用父类的宏
2. 可以自定义宏库，供所有蓝图使用
3. 宏特别适合于制作控制流，如引擎自带的FilpFlop。
4. 宏中定义局部变量，只能使用基本数据类型，不能使用类类型。

宏 ：执行快，功能更强，但占据空间多，安全性差

函数：执行较慢，占空间少，安全性高

个人总结：优先用函数，少用宏

[UE4蓝图——类型 宏（Macro）](https://zhuanlan.zhihu.com/p/234934910)
[UE4宏](https://www.cnblogs.com/timy/p/10186974.html)



# UE4的模块系统

首先：UE4中模块分为5部分：
Developer主要是跨平台工具，Merge和一些底层的工具。
Editor主要是编辑器相关的代码
Programs主要是独立于引擎，但大多数又依赖引擎的工具，UBT就在这里
ThirdParty第三方库或者插件
RunTime是主要的Gameplay等等和游戏相关的代码了。

[UE4模块系统详解](https://blog.csdn.net/pp1191375192/article/details/103139304)
[UE4中的模块（module）介绍](https://blog.csdn.net/weixin_43844254/article/details/109167484)

# 对象系统（UObject类）、类型系统（UClass类）

UObject类为对象系统的基类。该类的主要作用是存放对象的名字、标记信息
（ObjectFlags）、类型信息（ClassPrivate）、Outer对象和在对象管理数组中的索引。
UClass类主要用于描述C++中的类信息。在UE4在UClass实例不仅仅用于描述
C++(Native)类，也用来描述Blueprint生成的类。
[UE4对象系统_UObject&UClass](https://www.jianshu.com/p/1f2de6ea383c)

# Core模块包含了哪些基础类	

Core模块下有很多文件夹：
Containers 包含各种C++容器类：Array、List、Map、Queue、Set等等
Delegates 包含各种代理声明的宏：DECLARE_DELEGATE、DECLARE_MULTICAST_DELEGATE、DECLARE_EVENT等等
Logging 包含日志功能类和宏：UE_LOG、ELogVerbosity等等
Math 包含各种数学函数和结构：Box、Color、Matrix、Quat、Range、Rotator、
Vector、UnrealMath等等
[【UE4源代码观察】观察Core模块](https://blog.csdn.net/u013412391/article/details/104593130)

# RHI模块

RHI即RenderHardwareInterface, 即渲染硬件接口, 是UE为实现跨平台而实现的一套API. 
每个RHI接口都为OpenGL, Vulkan, DX11等做了不同的实现. 在引擎初始化时使用的绘图
接口就已经确定, 引擎就可以确定RHI所使用接口的版本.
[【UE4源代码观察】观察 RHI、D3D11RHI、RenderCore 这三个模块的依赖关系](https://blog.csdn.net/u013412391/article/details/105322419)

# Engine模块

Engine模块主要用于定义actor和组件，同时实现了游戏的基本框架。

# UMG 模块

UMG模块是虚幻运动图形的简称。
主要用到以下几种文件：
 1、Blueprint（ User Inteface-Blueprint） 也就是常说的UMG，是我们常用的
 	UI工程文件
 2、Font（字体资源拖入Content Browser自动生成）字体文件
 3、Texture (PNG资源拖进来可以自动生成) 图片资源文件
 4、Material 材质文件，可用于UI材质或者mesh材质
 5、Actor（Blueprint Class-Actor）可以摆放到场景中的文件类型，
 	用于制作3DUI
[UE4入门之路（UI篇）：UMG系统介绍](https://zhuanlan.zhihu.com/p/117582084)
[ue4之UMG](https://blog.csdn.net/weixin_41363156/article/details/114680770)
