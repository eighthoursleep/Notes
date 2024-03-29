# 行为树

AI框架选择的是状态机来实现。

因为同样的AI模式，用状态机会涉及大量的跳转，但是用行为树就相对来说更加简化。同时由于行为树的“退行”特点，也就是“逐个尝试，不行就换”的思路，更加接近人类的思维方式。

[TOC]

## 行为树原理

“行为树”是一种通用的AI框架或者说模式，其并不依附于特定的引擎存在，并且UE的行为树也与标准的行为树模式存在一定的差 异。

行为树包含三种类型的节点： 

- **流程控制**：包含**Selector选择器**和**Sequence顺序执行器**（关于平行执行parallel节点，暂时不做分析）。
- **装饰器**：对**子树的返回结果进行处理**的节点。
- **执行节点**：执行节点必然是**叶子节点**，**执行具体的任务**，并在任务执行一段时间后，根据任务执行**成功与否，返回true或者false。**

除去根节点Root，Selector就是一个流程控制节点。Selector节点会 从左到右逐个执行下面的子树，如果有一个子树返回true，它就会返回 true，只有所有的子树均返回false，它才会返回false。这就类似于日常生活中“几个方案都试一试”的概念。

假如流程节点被换为了Sequence，那么Sequence节点就会按顺序执行自己的子树，只有当前子树返回true，才会去执行下一个子树，直到全部执行完毕，才会向上一级返回true。任何一个子树返回了false，它就会停止执行，返回false。类似于日常生活中“依次执行”的概念。把一个已有的任务分为几个步骤，然后逐个去执行，任何一个步骤无法完成，都意味着了任务失败。

行为树其实包含了许多信息：

Selector：成功一支即终止、优先级。

Sequence：顺序性 、任何一个步骤失败都失败，全部步骤做完才成功。

标准的装饰器节点，是对子树返回的结果进行处理，再向上一级进行返回的。例如Force Success节点，就是强制让子树返回true，不管子树真正返回的是什么。

行为树对行为进行分析的关键在于：一定要从宏观到微观。先切分大的步骤， 再逐步细化。

通过顺序来定义“从一般到特殊”的AI行为。这是行为树很强大的一个地方。