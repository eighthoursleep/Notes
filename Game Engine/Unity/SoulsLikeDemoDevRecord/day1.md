新建角色的动画控制器（人形）

新建三个动画遮罩，分别对应左手、右手、双手

左手动画遮罩取消选择左臂和左手，右手遮罩取消选择右臂和右手，双手遮罩取消选择双臂和双手。

进入角色的动画控制器，添加4个动画层，分别对应左右手双手以及Override。

给所有动画层（除了BaseLayer）都创建一个叫Empty的动画状态。

给左右手双手动画层分别添加上对应的动画遮罩，Override层的权重设置为1，右手层的权重设置为0.75，左手为0.8，双手为0.8。

给动画控制器添加2个浮点型控制参数：vertical, horizontal，和1个布尔控制参数two_handed

Override层拖入动画生成新动画状态，分别是3个不同的单手攻击动画和2个双手攻击动画，并且都指向Empty动画状态。

双手层拖入双手闲置动画，将双手闲置动画和Empty互相指向，给箭头设置转换条件：当two_handed为true时，才从Empty转向双手限制动画，当two_handed为false时，从双手闲置动画转向Empty。

左右手层也同样设置动画与Empty的转换条件，two_handed为true时都传向Empty，false时转向各自的动画,

在BaseLayer层新建一个混合树取名locomotion，勾选Foot IK。

进入locomotion，设置混合类型为1D，添加3个动作槽，分别拽入idle动画，走路动画，冲刺动画，阈值分别设置0，0.5，1。

新建脚本Helper。

在Helper的Start()里：

- 获取animator

在Update()里：

- 给animtor的“vertical”控制参数赋值
- 当可以播放其他动画时，vertical置零，过度播放其他动画，过渡时间0.2f

将Helper拖拽到角色模型上

将近战武器模型拖到角色右手节点下

进到动画控制器右手动画层里，新建一个状态，动画用单手闲置动画，并设置为默认状态