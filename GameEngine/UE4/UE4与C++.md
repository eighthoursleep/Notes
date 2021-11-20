# UE4与C++



## IDE相关准备

### 重新生成VS工程

**什么时候生成？**

当添加、删除、重命名C++类、改变C++源码目录结构之后，需要重新生成



方法1：UE编辑器，File > Refresh

方法2：在uproject文件上右键 > Generate

方法3：命令行

```text
YourEnginePath/UE_4.25/Engine/Binaries/DotNET/UnrealBuildTool.exe -projectfiles -project="YourProjectPath/YourProject.uproject" -game -rocket -progress
```

### 编译方式

#### 热编译（Hot reload）

VS和UE未链接。

最简单，偶尔会出问题。

点击UE的Compile。（代码修改小可以用）

#### VS编译（推荐）

VS和UE链接。

彻底、问题少、可以代码调试。

VS菜单栏，Debug > Start Debugging（F5）

#### 命令行编译

UE4的工具栏，Launch Option > Project Launcher > 创建一个Profile并重命名为Build。

Project Launcher的Build Configuration设置为DebugGame，Advanced Setting勾选WindowsNoEditor，Cook设置Do not cook，Package设置Do not package，不勾选Achive，Deploy设置Do not deploy。

点击返回，然后点击Build项的Launch this profile按钮。

拷贝第2行消息，例如：

```text
Parsing command line: -ScriptsForProject=F:/work/UnrealProjects/TPSDemo/TPSDemo.uproject BuildCookRun -project=F:/work/UnrealProjects/TPSDemo/TPSDemo.uproject -noP4 -clientconfig=DebugGame -serverconfig=DebugGame -nocompile -nocompileeditor -installed -ue4exe=E:\UnrealEngine\UE_4.25\Engine\Binaries\Win64\UE4Editor-Cmd.exe -utf8output -platform=Win64+Win64 -targetplatform=Win64 -ini:Game:[/Script/UnrealEd.ProjectPackagingSettings]:BlueprintNativizationMethod=Disabled -build -skipcook -compressed

```

然后单击cancel。

删掉BuildCookRun前边的部分留下：

```text
BuildCookRun -project=F:/work/UnrealProjects/TPSDemo/TPSDemo.uproject -noP4 -clientconfig=DebugGame -serverconfig=DebugGame -nocompile -nocompileeditor -installed -ue4exe=E:\UnrealEngine\UE_4.25\Engine\Binaries\Win64\UE4Editor-Cmd.exe -utf8output -platform=Win64+Win64 -targetplatform=Win64 -ini:Game:[/Script/UnrealEd.ProjectPackagingSettings]:BlueprintNativizationMethod=Disabled -build -skipcook -compressed
```

然后在前边添加这个路径：

`YourEnginePath\Engine\Build\BatchFiles\RunUAT.bat`

例如：

```text
"E:\UnrealEngine\UE_4.25\Engine\Build\BatchFiles\RunUAT.bat" BuildCookRun -project=F:/work/UnrealProjects/TPSDemo/TPSDemo.uproject -noP4 -clientconfig=DebugGame -serverconfig=DebugGame -nocompile -nocompileeditor -installed -ue4exe=E:\UnrealEngine\UE_4.25\Engine\Binaries\Win64\UE4Editor-Cmd.exe -utf8output -platform=Win64+Win64 -targetplatform=Win64 -ini:Game:[/Script/UnrealEd.ProjectPackagingSettings]:BlueprintNativizationMethod=Disabled -build -skipcook -compressed
```

然后保存为`.bat`文件，例如`BuildYourProject.bat`

然后每次需要编译这个工程的时候双击这个`.bat`文件即可。

## UE4C++

类的定义不会消耗内存，但类的一个实例被创建时会消耗内存。

在UE中创建类时要注意两种类：Actor和Object。

任何**基于Actor的类**都**可以被放置到关卡场景中**，这些类都有视觉表现形式。

**基于Object的类**通常用于**存储数据**，它们的内存占用通常小于基于Actor的类。

## 添加C++代码

通过菜单栏File | New C++ Class。

举个例子，选Actor，名字默认MyActor，确认路径（建议头文件放在公共文件夹，源文件放在私人文件夹）。

完场操作后，UE开始添加代码到工程并开始编译C++代码。这时项目根目录会多出以下文件夹：

- **Binaries**：存放可执行文件以及其他的编译产生的文件，可以在引擎编辑器没有运行的时候删掉，然后再下次编译生成。
- **Intermediate**：这里存放临时文件和Visual Studio生成的项目文件，可以放心删除。
- **Source**：这里存放具体游戏代码文件。

在Source文件夹里，会多出一些文件，比如：

YourProjectName.Target.cs、YourProjectName.Build.cs。

Target文件包含打包的设置信息，Build文件包含了参与打包的模块的信息。模块是包含了C++类文件和C#打包文件（*.build.cs）。

当你打包一个模块的时候，相应的DLL文件会在Binaries文件夹里生成。

当你发布项目的时候，所有的模块都会链接成一个可执行文件（*.exe）。

在工程目录的Source文件夹下，找到和你游戏名称一致的文件夹。 根据不同人创建的工程结构不同，你可能会发现下面两种文件结构： 

1. `public`文件夹，`private`文件夹，`.build.cs`文件。
2. 一堆`.cpp`和`.h`文件，`.build.cs`文件。

第一种文件结构是标准的虚幻引擎模块文件结构。 

1. 创建你的`.h`和`.cpp`文件，如果你是第一种文件结构，.h文件放在`public`文件夹内，`.cpp`文件放置在`private`文件夹内。
2. 在.h中声明你的类：如果你的类继承自`UObject`，你的类名上方需要 加入`UCLASS()`宏。同时，你需要在类体的第一行添加`GENERATED_UCLASS_BODY()`宏，或者`GENERATED_BODY()`宏。前者需要手动实现一个带有`const FObject Initializer&`参数的构造函数。后者需要手动实现一个无参数构造函数。注意，是“实现”而非声明。 
3. 在你的`.cpp`文件中，包含当前模块的PCH文件。一般是模块名 +private PCH.h。如果是游戏模块，有可能包含的是游戏工程名.h。
4. 编译。

### 头文件结构

以`MyActor.h`为例。

```cpp
#pragma once
```

这个是预处理指令，意思是对这个头文件仅仅include一次。

如果后边在其他文件里include MyActor.h很多次，都会被忽略。

```cpp
UCLASS()
```

这是一个宏指令，是为了能让UE引擎识别到这个类。

与之同时出现的还有下边另一个宏指令

```cpp
GENERATED_BODY()
```

这个宏指令用于包含类体里额外的函数和类型声明。

`UCLASS()`宏指令可以传入参数，详细见：

https://docs.unrealengine.com/en-US/Programming/UnrealArchitecture/Reference/Classes/Specifiers/index.html.

```cpp
class BOOKTEMPLATE_API AMyActor:public AActor
```

其中的`_API`宏指令和DLL链接有关，在DLL文件里将类、函数、数据标记为public。其他导入了这个API模块的模块可以直接访问这里边的类和函数。

`:public AActor`表示这个类继承Actor类。

MyActor之所以在这变为AMyActor是因为UE引擎的反射系统需要类名前有前缀。以下是不同前缀对应的含义：

- A：继承自Actor类，比如：AActor、AComtroller、AGameMode。
- U：继承自UObject，但不继承自Actor，比如：UObject、UActorComponent、USceneComponent。
- T：模板，比如：TWeakPtr，TArray，TMap。
- S：Slate控件相关类，比如：SWidget、SCompundWidget、SCurveEditor。
- I：接口，比如： IAssetRegistry，ILevelViewport，IAsyncTask。
- E：枚举，比如：EAnchorWidget，EAcceptConnection。
- G：Global，比如：GEditor，GWorld。
- F：纯C++类，比如：FVector，FGameplayTag。

UE的头文件工具Unreal Header Tool会在编译前检查你的类命名。如果命名出错，会提出警告并终止编译。

## 将变量和函数暴露给蓝图

### 修改头文件

例如：

```cpp
#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "MyActor.generated.h"
UCLASS()
class BOOKTEMPLATE_API AMyActor : public AActor
{
    GENERATED_BODY()
public:
    AMyActor();
    
    UFUNCTION(BlueprintCallable, Category = "My Actor")
	void CollectMe(bool bDestroy = true);
    
private:
	UPROPERTY(VisibleAnywhere)
    UStaticMeshComponent* MeshComponent;
	
	UPROPERTY(EditAnywhere)
    bool bCanBeCollected;

	UPROPERTY(EditAnywhere, meta = (EditCondition = "bCanBeCollected"))
    int32 ToggleableOption;
}
```

- **UCLASS**宏指令，暴露类。`UCLASS`会告诉编译器，为这个类生成一些模板文件。

  因为UE有一套自己的反射数据的方法，这样编译器可以生成一些反射需要的代码，这些代码将替换下边的`GENERATED_BODY()`。这些代码来自`MyActor.generated.h`文件。

- **UPROPERTY**宏指令，暴露变量（属性）

- **UFUNCTION**宏指令，暴露函数

UPROPERTY是一个特殊的引擎宏指令，你需要在里边写具体如何暴露变量。

- **EditAnywhere**：可以在默认蓝图中编辑，也可以在场景中放置的实例上编辑。
- **EditDefaultsOnly**：只可以在默认蓝图中编辑。
- **EditInstanceOnly**：只可以在场景中放置的实例上编辑。
- **VisibleAnywhere**：可以在默认蓝图中编辑，在场景中放置的实例上只读。
- **VisibleDefaultsOnly**：在默认蓝图中只读。
- **VisibleInstanceOnly**：在场景中放置的实例上只读。

属性编辑可以生效与否还可以通过布尔值控制。结合元数据解释器`EditCondition`。

### 修改源代码

例子：

```cpp
#include "MyActor.h"
#include "Components/StaticMeshComponent.h"
AMyActor::AMyActor()
{
    MeshComponent = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("MeshComponent"));
	RootComponent = MeshComponent;
 	bCanBeCollected = true;
 	ToggleableOption = 0;
 	PrimaryActorTick.bCanEverTick = true;
}
void AMyActor::CollectMe(bool bDestroy /*= true*/)
{
	if (bCanBeCollected)
 	{
 		if (bDestroy)
 		{
             UE_LOG(LogTemp, Log, TEXT("Actor collected and destroyed."));
             Destroy();
 		}
 		else
 		{
             UE_LOG(LogTemp, Warning, TEXT("Actor collected but not destroyed."));
		}
 	}
 	else
 	{
         UE_LOG(LogTemp, Error, TEXT("Actor not collected."));
 	}
}
```

在例子中，我们要在构造函数里获取一个Mesh组件，调用引擎自带的函数`CreateDefaultSubobject()`，这个函数创建一个给定类型的物体，而且在编辑器里可见。注意这个函数只可以在构造函数里调用，在运行时调用将使编辑器崩溃。

## 类对象

#### 类对象的产生

在标准C++中，一个类产生一个对象，被称为“实例化”。实例化对象的方法是通过new关键字。

而在UE中，这一个问题变得略微复杂。对于某些类型，我们不得不通过调用某些函数来产生对象。具体而言：

1. 如果你的类是一个**纯C++类型（F开头）**，你可以通过`new`来产生对象。
2. 如果你的类**继承自UObject但不继承自Actor**，你需要通过`NewObject`函数来产生出对象。
3. 如果你的类**继承自AActor**，你需要通过`SpawnActor`函数来产生出对象。

`New Object`函数定义：

```cpp
template<class T>
T* NewObject(
	UObject* Outer = (UObject*)GetTransientPackage(),
    UClass* class = T::StaticClass(),
    FName Name = NAME_None,
    EObjectFlags Flags = RF_NoFlags,
    UObject* Template = nullptr,
    bool bCopyTransientsFromClassDefaults = false,
    FObjectInstancingGraph* InInstanceGraph = nullptr
)
```

可以这样调用：

```cpp
NewObject<T>()
```

返回一个指向你的类的指针，此时这个对象被分配在临时包中。下一次加载会被清除。

如果你的类继承自`Actor`，你需要通过`UWorld`对象（通过`GetWorld()`获得）的`SpawnActor`函数来产生对象。函数其中一个定义如下：

```cpp
template<class T>
T* SpawnActor(
	FVector const& Location,
    FRotator const& Rotation,
    const FActorSpawnParameter& SpawnParameters = FActorSpawnParameter()
)
```

你可以这样调用：

```cpp
GetWorld()->SpawnActor<AYourActorClass>();
```

#### 类对象的获取

获取一个类对象的唯一方法，就是通过某种方式传递到这个对象的 指针或引用。 

但是有一个特殊的情况：在一个场景中，借助Actor迭代器获取某种Actor的所有实例。

TActorIterator示例代码：

```cpp
for(TActorIterator <AActor> Iterator(GetWorld());Iterator;++Iterator)
{
    ...
}
```

其中TActorIterator的泛型参数不一定是Actor，可以是你需要查找的其他类型。你可以通过`*Iterater`来获取指向实际对象的指针。或者，你可以直接通过`Iterater->YourFunction()`来调用你需要的成员函数。

#### 类对象的销毁

##### 纯C++类

如果你的纯C++类是在函数体中创建，而且不是通过new来分配内 存，例如：

```cpp
void YourFunction( )
{
    FYourClass YourObject = FYourClass();
    ...
}
```

此时这个类的对象会在函数调用结束后，随着函数栈空间的释放， 一起释放掉。不需要你手动干涉。

如果你的纯C++类是使用new来分配内存，而且你直接传递类的指针。那么你需要意识到：除非你手动删除，否则这一块内存将永远不 会被释放。如果你忘记了，这将产生内存泄漏。

如果你的纯C++类使用new来分配内存，同时你使用智能指针`TSharedPtr/TSharedRef`来进行管理，那么你的类对象将不需要也不应该被你手动释放。智能指针会使用引用计数来完成自动的内存释放。你可以使用`MakeShareable`函数来转化普通指针为智能指针：

```cpp
TSharedPtr<YourClass> YourClassPtr = MakeShareable(new YourClass());
```

强烈建议：**在你没有充分的把握之前，不要使用手动 new/delete方案**。你可以**使用智能指针。**

##### UObject类

你无法使用智能指针来管理`UObject`对象 。

`UObject`采用自动垃圾回收机制。当一个类的成员变量包含指向`UObject`的对象，同时又带有`UPROPERTY`宏定义，那么 这个成员变量将会触发引用计数机制。

垃圾回收器会定期从根节点Root开始检查，当一个`UObject`没有被别的任何`UObject`引用，就会被垃圾回收。你可以通过`AddToRoot`函数来让一个`UObject`一直不被回收。

##### Actor类

`Actor`类对象可以通过调用`Destory`函数来请求销毁，这样的销毁意味着将当前Actor从所属的世界中“摧毁”。但是对象对应内存的回收依然是由系统决定。

## 使用类

在IDE里编译和启动工程，然后回到内容浏览器C++ Class目录里的类上右键，选择“基于xxx创建蓝图类”。

### 在蓝图里调用C++函数

#### UPROPERTY宏

当你需要将一个UObject类的子类的成员变量注册到蓝图中时，你只需要借助`UPROPERTY`宏即可完成。

```cpp
UPROPERTY(...)
```

你可以传递更多参数来控制UPROPERTY宏的行为，通常而言，如果你要注册一个变量到蓝图中，你可以这样写：

```cpp
UPROPERTY(BlueprintReadWrite, VisibleAnywhere, Category="Object")
```

#### UFUNCTION宏

你也可以通过`UFUNCTION`宏来注册函数到蓝图中。下面是一个注册的案例：

```CPP
UFUNCTION(BlueprintCallable,Category="Test")
```

其中`BlueprintCallable`是一个很重要的参数，表示这个函数可以被蓝图调用。

可选的还有：

`BlueprintImplementEvent`：这个成员函数由其蓝图的子类实现，你不应该尝试在C++中给出函数的实现，这会导致链接错误。

`BlueprintNativeEvent`：这个成员函数提供一个“C++的默认实现”，同时也可以被蓝图重载。你需要提供一个`YourfunctionName_Implement`为名字的函数实现，放置于`.cpp`中。
