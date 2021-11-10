# UE4与C++

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

- A：Actor类型，比如：AActor、AComtroller、AGameMode。
- U：UE引擎的Object类型，比如：UObject、UActorComponent、USceneComponent。
- T：Template，比如：TWeakPtr，TArray，TMap。
- S：Slate，比如：SWidget、SCompundWidget、SCurveEditor。
- I：Interface，比如： IAssetRegistry，ILevelViewport，IAsyncTask。
- E：Enum，比如：EAnchorWidget，EAcceptConnection。
- G：Global，比如：GEditor，GWorld。
- F：Float，比如：FVector，FGameplayTag。

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

- **UCLASS**宏指令，暴露类
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

## 使用类

在IDE里编译和启动工程，然后再内容浏览器里右键，选择蓝图类，在弹窗里选择MyActor。

### 在蓝图里调用C++函数



