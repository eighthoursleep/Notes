# UE4物理和射线

[TOC]

## 仿真物理

当一个物体在下落或者通过受力而移动，则这是在实现仿真物理。

要实现仿真物理，首先网格体得有碰撞形状。

因为实际的3D物体形状太复杂，在UE4里使用简单的形状来替代，比如盒子，球体，胶囊体等。

物理设置出现在actor蓝图的mesh组件细节里。

打开一个actor，选中它的mesh组件，在细节里找到Physics项，有以下属性：

- Simulate Physics：勾选了可以打开仿真物理效果。如果这个选项是灰的，说明该网格体没有物理资产。
- MassInKg：物体的质量单位设为千克。
- Linear Damping：应用牵拉力到线性动作中。
- Angular Damping：应用牵拉力到旋转动作中。
- Enable Gravity：设置仿真物理中是否存在重力效果。

## 碰撞

碰撞分两种：

- 阻挡碰撞（Blocking collisions）：两个物体碰撞后无法穿透。（例子：物体撞墙）
- 重叠碰撞（Overlap collisions）：两个物体碰撞并重叠。（例子：物体落入水中）

碰撞设置在mesh组件的细节的Collistion项，属性如下：

- Simulation Generates Hit Events：如果勾选了，当这个物体在成功碰撞后调用自身的`On Component Hit`事件。
- Phys Material Override：分配一个物理材质，定义摩檫力、恢复、密度。
- Generate Overlap Events：如果勾选了，当该物体碰撞开始，就调用自身的`On Begin Overlap`事件，在重叠结束时，调用自身的`On End Overlap`事件。
- Can Character Step Up On：如果勾选了，玩家角色可以踏上去，如果未勾选，将拒绝玩家的踏入尝试。

碰撞有4种不同的状态：

- No Collision：表示没有任何碰撞的表现形式，即没有阻挡也没有重叠。
- Query only：物体仅可以触发重叠事件但没有刚体碰撞，即该物体不能阻挡碰过来的物体。
- Physics only：该物体可以和其他参与碰撞的物体交互，但没法重叠。
- Collision enabled：物体可以重叠和阻挡其他物体。

## 射线

当你在游戏中要捡起一个物体时，先看到这个物体，然后按下某个按键，这时在摄像机所在的位置会射出一条看不见的射线，射线碰到物体，返回碰撞信息，然后执行后续操作。

`LineTraceByChannel`节点、`BreakHitResult`节点