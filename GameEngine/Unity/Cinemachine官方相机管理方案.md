# Cinemachine

[TOC]

## CinemachineBrain

相机上的CinemachineBrain和创建的虚拟相机绑定，构成cinemachine的基本运行逻辑。

相机上绑定了CinemachineBrain以后无法直接修改相机的属性。CinemachineBrain通过读取虚拟相机的配置来改变相机的属性。

我们可以根据需要再场景中创建任意数量的虚拟相机，并随时在虚拟相机之间切换。

### CinemachineBrain基本属性

Live Camera : 可以看到相机当前正在使用哪一个虚拟相机的配置

Live Blend : 当前的虚拟相机的切换过程。（可以通过SetActive方法禁用当前虚拟相机切换到另一个虚拟相机。）

Show Debug Text : 显示Debug文本，勾选后可以在Game视窗左上角里看到当前使用哪个虚拟相机以及当前执行的相机切换。

Show Camera Frustum : 显示当前相机的视锥体。（处于视锥体内的物体才可以通过相机看到，如果没有勾选此项，则默认只有在选中相机的时候才显示视锥体。）

Ignore Time Scale : 相机的行为是否受时间缩放值的影响。

World Up Override : 相机的上方向重写，如果默认None,表示相机的上方向是世界坐标的上方向（Y轴正方向）。当相机旋转至局部坐标上方向和相机的上方向夹角大于90度时，会CinemachineBrain会自动重新设置相机的方向至这个夹角小于90度。我们可以通过这个属性用其他物体的局部上方向来代替世界坐标上方向，帮助避免突然的镜头重设。

Update Method : 相机的行为与什么同步
- Fixed Update 与物理引擎同步
- Late Update 与画面绘制同步
- Smart Update 根据实际情况智能选择同步
- Manual Update 手动指定方法同步

Blend Update Method : 两个虚拟相机之间的切换行为与什么同步
- Fixed Update
- Late Update

Default Blend : 默认的相机切换模式，以及切换时间设置
- Cut 瞬间切换
- Ease In Out 减速切入且减速切出
- Ease In 减速切入，匀速切出
- Ease Out 匀速切入，减速切出
- Hard In 加速切入，匀速切出
- Hard Out 匀速切入，加速切出
- Linear 匀速切入切出
- Custom 自定义切入切出曲线

Custom Blends : 自定义切换，可以放入切换资源文件，在切换资源文件里定制不同的相机之间的不同切换方式。

Events : 相机的事件触发
- Camera Cut Event 相机瞬间切换时触发的事件
- Camera Activated Event 相机非瞬间切换，切换的第1帧触发的事件

## 虚拟相机的跟随和瞄准行为

### 虚拟相机的Transposer属性