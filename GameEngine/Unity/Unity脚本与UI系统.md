# Unity脚本与UI系统



## 用脚本操控常用UI控件

在界面系统的术语中，将一个具有独立的状态、外观和操作的对象称为**控件**。

例如，常见的**交互控件**有按钮、输入框、滑动条等，常见的**非交互控件**有文本标签、图片等。

Unity采用了父子物体和组件的设计思想，它的每个界面控件，往 往也是由游戏物体挂载组件，以及一些子物体实现的。例如，按钮控 件是由按钮物体加上一个文本子物体构成的，而按钮核心的功能组件 也叫按钮（Button）。

### Canvas与EventSystem

一般来说**所有的UI控件都必须是Canvas的子物体**，这样才能方便统一布局。

Unity允许存在多个Canvas，形成多个独立的界面层。但是过多的 Canvas会影响游戏性能。

EventSystem代表着事件系统。UI系统一定会用到事件系统，例如 单击按钮、输入文字等操作都需要事件系统的辅助。事件系统不是UI 系统专用的，它本身也有其他用途。脚本与事件系统

### 界面比例问题

如果新建多个UI控件，会发现在Game窗口里能看到控件，而在场景中，UI控件会以非常巨大的比例展现，必须要将场景镜 头拉得很远才能看清楚UI控件整体。

这是由于UI系统是以Canvas为载体，而Canvas很多时候和最终屏 幕显示有直接的对应关系。UI的默认比例是以1像素为单位的，而正常三维场景是以1米为单位的。因此，UI的1个像素等价于三维世界的1米。对1920像素×1080像素的界面来说，横向就有1920 米，这比一个标准尺寸的操场还要大几倍。

三维游戏场景的比例尺与默认界面系统的比例尺的差距很大，这 就导致在编辑界面时感到很不自然。为了改善操作的便利性，Unity在 场景中提供了2D按钮，为编辑界面带来了方便。

**导入自定义图片的设置**

Unity支持多种图片格式，只需将图片素材拖曳到Project窗 口，或者将图片复制到当前工程的Assets文件夹下，就可以实现导入。

关键是在图片导入以后，选中图片文件并在Inspector窗口中将 Texture Type（贴图类型）设置为Sprite (2D and UI)。这是因为在3D工程中，图片被默认为材质贴图，这与UI系统或2D精灵需要的 格式不同。



### 矩形变换组件（Rect Transform）

选中界面上的控件，会发现每个物体并不带有基本的Transform组件，取而代之的是Rect Transform（矩形变换）组件。其实Rect Transform组件是Transform组件的子类，因此并不违反“每个 物体必须有且只有一个Transform组件”的规定。其中的Rect是Rectangle的简写，即“矩形”的意思。

**在UI系统中不得不用Rect Transform组件，而不能直接用基本的 Transform组件，是由于界面控件的位置、大小相对于游戏中的其他物 体来说要复杂得多。**

它的复杂性体现在很多方面，例如以下情况：

1. **界面布局直接受到客户端屏幕大小、长宽比例的影响**。例如，移 动端显示屏具有多种分辨率和长宽比，分辨率有720P、1080P、1440P 等多种情况，长宽比有4：3、16：9、18：9 等情况，加上个人计算 机、电视机等设备，情况就更多了。
2. **界面上的控件位置、大小直接影响着用户体验。**界面元素位置不合适或比例不合适，会直接导致糟糕的用户体验。
3. **在很多游戏和应用程序中，用户可以拖曳窗口的位置或修改窗口的大小。**例如，游戏的聊天窗口位置和大小通常是可以动态调整的。在这种情况下使窗口内部元素动态适应窗口大小、自动改变窗口内部元素的布局十分必要。

由于存在种种复杂的情况，如果UI控件还使用简单的“位置、旋转和缩放”来定义自身位置，显然无法满足需求。因此Unity总结了众多游戏屏幕适配的经验和方法，设计了Rect Transform组件。

简单来说，**Rect Transform组件是用多种相对参数取代了绝对的位置参数。**例如，所有的物体都是默认的 “居中对齐”方式。这时右边的位置参数为Pos X、Pos Y，其代表的是控件与父控件之间的偏移量，（Pos X=0, Pos Y=0）代表位于父控件的正中央。

如果改为“上方对齐”，那么（Pos X=0, Pos Y=0） 就代表位于父控件上方；如果改为“右下角对齐”，则（Pos X=0, Pos Y=0）代表位于父控件右下角。

在各种对齐情况下（所有的非拉伸情况，用红色参考线表示），控件的大小都可以通过Height（高度）和Width（宽度）指定。也就是说，**物体的位置是相对的，物体的大小是确定的。**

而当用户选择Stretch（拉伸）模式时，位置和大小的参数会发生根本的变化。

在拉伸模式下，定位物体的Pos X、Pos Y消失了，取而代之的是 Left（左偏移）、Top（顶偏移）、Right（右偏移）和Bottom（底偏 移）。如果将4个偏移参数改为0，则代表这个控件将铺满父控件的全部空间，而且无论父控件扩大或缩小，依然会保持铺满的状态。

这时“左偏移”代表的是“离左边有多远”，“顶偏移”代表的 是“离顶部有多远”，如左偏移文本框中填写10代表离左边10个单 位，填写负数则表示可以超出父控件的范围。这种铺满的模式适合用于表示游戏中的主体窗口。

### 图片组件（Image）

图片组件（Image）用于展示UI上的图片。在界面上可以设置的属性如下：

1. 指定任意**图片源**（Source Image）。
2. 修改图片的**叠加颜色**（Color）。
3. 指定**图片材质**（Material），一般应该置为空。
4. **射线检测目标**（Raycast Target），大部分的UI组件都包含这 一选项，它决定了控件是否会被单击到。
5. **图片类型**（Image Type），包括**简单（Simple）**、**切片 （Sliced）**、**瓦片（Tiled）**与**填充（Filled）**4种类型。其中的切片与瓦片类型需要对图片导入参数进行设置后才能正常使用。**切片类型**通常用于制作可以**任意缩放但边缘不变形的图片**（也称为**九宫格图片**）
6. **Set Native Size（设为原始大小）按钮**可以重置整个图片为原始像素大小。
7. 当图片类型为简单和填充时，会出现“Preserve Aspect（保留长宽比）”选项，勾选它能够保证图片在放大、缩小时长宽比例不 变，这一功能比较常用。

用脚本控制图片的基本方法例子：

```c#
using UnityEngine;
using UnityEngine.UI; // UI 脚本要包含此命名空间
public class ImageAnimTest : MonoBehaviour
{
    Image image;
    // 可以在编辑器里指定另一张图片
    public Sprite otherSprite;
    float fillAmount = 0;
    void Start()
    {
        // 获取Image组件
        image = GetComponent<Image>();

        // 直接将图片换为另一张图片
        if (otherSprite != null)
        {
            image.sprite = otherSprite;
        }
        // 将图片类型改为Filled，360°填充，方便制作旋转动画
        image.type = Image.Type.Filled;
        image.fillMethod = Image.FillMethod.Radial360;
    }
    void Update()
    {
        // 制作一个旋转显示的动画效果，直线效果也是类似的
        // 取值为0~1
        image.fillAmount = fillAmount;
        fillAmount += 0.02f;
        if (fillAmount > 1)
        {
            fillAmount = 0;
        }
    }
}
```

在运行之前，可以给脚本的Other Sprite字段指定一张新的图片，这样在运行时，就会将内容替换为新的图片，并产生旋转显示的效果。

**注意：使用第三方字体务必注意版权问题**

Unity的Asset Store有很多免费和收费的字体可供使用，但大部分是英文字体，中文字体请自行寻找。

要强调的是，任何字体如果用于商业目的或互联网传播，都要小心授权协议，特别是中文字体。Windows系统的字体也并非都可以用于商业用途，依据具体的字体授权方式有所不同。作为开发者应当具有法律意识，谨防侵权。

### 文本组件（Text）

文本组件在界面上可以设置的属性如下：

1. Text（文本内容），就是要显示的文字内容，支持富文本标签。
2. Font（字体），默认为Arial字体。Unity支持用户安装其他类型的字体，只要将合适的字体文件复制到工程的Assets/Fonts文件夹下即可自动导入。
3. Font Style（字体风格），包括普通、黑体、斜体、黑体加斜 体4种选择。
4. Line Spacing（行间距），行间距可调。
5. Rich Text（富文本），可以开启或关闭富文本功能。后文会举一个简单的例子说明富文本的简单使用方法。
6. Alignment（段落对齐方式），包括横向的靠左、居中和靠右对齐，以及纵向的靠左、居中和靠右对齐。
7. Horizontal Overflow（横向超出），指定横向超出控件大小的字符的处理方式，可以选择Wrap（折行）或Overflow（放任超出边界）。
8. Vertical Overflow（纵向超出），指定纵向超出控件大小的字符的处理方式，可以选择Truncate（丢弃）或Overflow（放任超出边界）。
9. Best Fit（最佳匹配），自动根据文本控件的大小改变字体的大小，可以限制自动调整的最大值和最小值。
10. Color（文字颜色），默认的文字颜色。
11. Material（材质），与2D图片一样，字体也可以指定材质，一般留空即可。
12. Raycast Target（射线检测目标），大部分的UI组件都包含这一选项，它决定了控件是否会被单击到。

富文本使用方法：

文本控件支持用户给文字添加丰富的小变化，支持修改局部字体的大小、颜色、风格等。

```text
这是一段<color=#ff0000ff>富<b>文</b><size=50>本</size></color>
```

![uiRichText](UnityScriptingImg/uiRichText.png)

**富文本**是一种**用特殊标签标记的字符串**，**语法类似于HTML**，支持常规的变色、加粗、改变大小等功能。

如果文字不显示或显示不全，可以将文本框拉大一些。测试时会发现字体的颜色、大小和加粗风格都可以变化，更多细节功能可以查阅相关资料，自行尝试。



### 按钮组件（Button）

按钮的主要属性介绍如下：

1. Interactable（是否可交互）。
2. Transition（外观状态切换），每个按钮都有**普通、高亮、按下和禁用**4种状态，这4种状态下按钮外观应该表现出区别。Unity提供了几种方式来定义外观的变化，后文会展开说明。
3. Navigation（导航顺序），当玩家使用键盘或手柄在UI控件之 间切换时，按键切换的顺序会变成一个复杂的问题，“导航顺序”就 是为了解决这一问题而存在的。Visualize（导航可视化）按钮也是为导航准备的。

**按钮外观状态切换的方法**

按钮状态切换与按钮的实际应用密切相关，默认按钮的状态切换是Color Tint（颜色叠加，实际上是对颜色做乘法运算）。

在做简单测试时，用颜色叠加十分方便。因为只需要准备一张按钮图片，默认状态下乘以白色，也就是不改变图片颜色；在高亮时乘亮灰色；在按下时乘深灰色，按钮明显变暗；在禁用按钮时，乘 半透明的深灰色，按钮不仅变暗还会有透明效果。如此一来，就可以用一张图片代表4种状态，效果也不错，简单易行。

另一种效果更好的方式是根据需要准备2~4张图片，然后选择 Sprite Swap（切换精灵图）模式。在此模式下，需要对按钮的普通状态、高亮状态、按下状态和禁用状态分别指定不同的图片。当然，如果游戏中不会出现高亮或禁用状态，也可以不指定高亮或禁用对应的图片。

**按钮是组合的控件**

仔细观察按钮在Inspector窗口中的详细信息，会发现它不仅具有 Button组件，还具有Image组件，另外它还包含一个Text子物体，这说 明按钮是由多种组件和父子物体组成的。其中的Image组件代表按钮默 认的外观，而Text子物体决定了按钮上显示的文字。例如，需要一个 不带文字的纯图片按钮，就可以删除Text子物体。

 **OnClick（点击）事件**

按钮最常用的功能就是单击，单击需要和脚本联动，一般是通过调用某个方法来实现的。事件的关联可以直接在编辑器中操作。

1. 看Button组件的On Click ()选项，第一个Runtime Only选项不变 （Runtime Only代表仅在游戏运行时有效，Editor And Runtime则表示在 编辑器中也会响应单击）。
2. 单击左下角编辑框右侧的小圆圈，然后选择Image物体；也可以 将场景列表中的图片物体拖曳到该编辑框中。小圆圈代表单击按钮后对哪个物体进行操作。
3.  右边是一个下拉框，可以指定被调用的方法。指定物体后，该下拉框就变成了可编辑状态。

OnClick事件可以对场景中的任意物体操作，且可以调用物体的任何一个公开方法。

```c#
using UnityEngine;
public class ButtonTest : MonoBehaviour
{
    public void TestButtonClick(int param)
    {
        Debug.Log("按钮被点击");
        Debug.Log("事件参数为："+para m);
    }
}
```

将该脚本挂载到界面的图片上。在按钮组件中，依然选中图片物体，在下拉框中找到 ButtonTest.TestButtonClick。由于此方法具有一个int参数，因此可以指 定参数的值，如“233”。运行游戏进行测试，单击按钮，会在Console窗口中看到输出的信息。

**OnClick事件触发的方法可以有任意参数**

按钮OnClick事件可以触发任意物体的任何方法，而且该方法可以是无参数的、有一个参数的或者有多个参数的，读者可以自行实验。 甚至还可以在按下按钮时触发多个方法。单击编辑框下方的加号即可添加更多方法。



### 单选框（Toggle）组件

单选框组件（Toggle）与按钮组件类似，只不过它具有“勾选” 和“不勾选”两种状态。在创建物体的菜单中选择UI>Toggle即可创建单选框。

相比按钮组件，单选框组件多出几个选项，说明如下：

1. Is On选项，代表是否处于勾选状态。
2. Transition（外观状态切换），用于定义外观和切换效果，类似按钮组件。
3. Toggle Transition代表勾选时的动态效果，有“淡入淡出”和 “无效果”两种选择。
4. Graphic代表对钩图片对应的子物体。一般单选框对应的对钩图 片是CheckMark子物体，如果需要替换小图片外观，修改CheckMark子物体即可。
5. Group代表单选框组，可以让多个单选框组成多选一的结构。
6. 勾选或取消勾选单选框时，会触发OnValueChanged消息，带有一个bool参数。

在勾选或取消勾选单选框时会触发一个方法，只要将TestToggleChange方法添加到单选框的响应方法中即可。

```c#
using UnityEngine;
using UnityEngine.UI;
public class TestToggle : MonoBehaviour
{
    Toggle toggle;
    void Start()
    {
        toggle = GetComponent<Toggle>();
        // 初始不勾选
        toggle.isOn = false;
    }
    public void TestToggleChange(bool b)
    {
        if (b) {
            Debug.Log(" 勾选了单选框");
        }
        else {
            Debug.Log(" 取消勾选单选框");
        }
    }
}
```

单选框不仅可以用来表示一个单独的状态，通常也用于从多个选项中选取一个选项的情况，例如常见的单项选择题。这种选项的特点 是，多个单选框形成一个组，同一时间只有其中之一处于勾选状态。如果勾选了其中一个，另外几个选项会自动取消勾选。

1. 创建3个单选框（Toggle）物体，摆在合适的位置。并修改子物 体Label上的文字，以方便查看。
2. 在UI画布中创建一个空物体，并取一个名字，如Group1。
3. 在场景列表中，将3个单选框拖曳到空物体上，使它们都作为 Group1的子物体。
4. 给这个父物体添加组件Toggle Group，即单选框组组件。
5. 将每个单选框的Group选项，都指定为这个空物体。这一步可以 同时选中这3个单选框，统一操作，比较方便。

完成之后就可以运行游戏进行测试。勾选其中任意一个选项，另 外两个选项都会自动取消勾选。如果初始状态下三者都是勾选状态， 那么可以通过修改Is On选项来改变初始状态。注意在这个例子中为了管理方便使用了“父子”物体，其实不一定要用此方法实现，只要指定好分组即可。



### 滑动条组件（Slider）

Slider（滑动条组件）通常用来显示和编辑一定范围内的数据， 一般左边是最小值，右边是最大值。另外也有垂直布局、异形布局的滑动条组件。例如很多游戏中的血条就具有特殊的形状，但它们依然可以利用滑动条控件制作。

滑动条控件由多个物体组成：

1. Background（背景物体）作为滑动条的整体外观；
2. Fill Rect（已填充区域），滑动手柄时，左侧就是已填充区域；
3. 滑动条的Handle Rect（手柄区域），用户可以拖曳手柄改变滑动条的值。

Slider的属性如下：

1. Interactable（是否可交互），不可交互的滑动条可以用来作为血条、进度条等。
2. Transition（外观状态切换），用于定义外观和切换效果，类似按钮组件。
3. Fill Rect（填充区域），对应滑动条的左侧已填满区域。
4. Handle Rect（手柄区域），对应滑动条的手柄区域。单独定义这两个区域，目的是将Slider与子物体联系起来。
5. Direction（滑动条方向），支持从左到右、从右到左、从上到 下、从下到上4种方向的滑动条。
6. Min Value（最小值）、Max Value（最大值），指定滑动条所表示的最小值和最大值。
7. Whole Numbers（整数），可以简单理解为“勾选之后数值都只能取整数”。
8. Value（值），是Slider中最重要的属性，是目前滑动条上的数值，这个值一定在最大值与最小值之间。直接修改这个值会引起滑动条显示的相应变化。可以用脚本修改这个值。

例子：

```c#
using UnityEngine;
using UnityEngine.UI;
public class TestSlider : MonoBehaviour
{
    // 所控制的图片
    public Image image;
    // 滑动条组件
    Slider slider;
    void Start()
    {
        slider = GetComponent<Slider>();
        slider.minValue = 0;
        slider.maxValue = 1;

        // 将图片类型改为Filled，360°填充
        image.type = Image.Type.Filled;
        image.fillMethod = Image.FillMethod.Radial360;
    }
    void Update()
    {
        // 每一帧都让滑动条的值决定图片的填充大小
        image.fillAmount = slider.value;
    }
}
```

将编写好的脚本挂载到滑动条上，再指定Image变量为场景 中的图片，即可进行测试。

### 输入框组件（Input Field）

用户在输入文字的时候，就会用到Input Field（输入框组件）。

Input Field也是由父子物体组成的，简单来说父物体上的Input Field用来定义外观、处理输入，而文本显示则由子物体的Text属性负责。 

Input Field的属性如下。

1. Interactable（是否可交互）。
2. Transition（外观状态切换），用于定义外观和切换效果，类似按钮组件。
3. Text Component（关联的文本组件），是对子物体的引用，将子物体的Text与父物体关联起来。
4. Text（文本内容），是一个字符串。用户输入的内容可以从此属性中获取，也可以用脚本设置它的内容。
5. Character Limit（字符数量限制），限制用户输入的最大字符数量。
6. Content Type（内容类型），指定输入的格式，例如 Standard（普通输入）、Password（密码输入）、Integer Number（只能输入整数）、Email Address（邮箱地址格式）等。各种应用场景中输入需求有所不同，例如输入密码时要隐藏字符，因此这个属性十分必要。
7. Line Type（换行方式），可以指定单行或多行文本。
8. Place Holder（占位符），也是对子物体的引用。默认占位符是显示一个灰色文本，例如灰色的“请输入姓名……”字样，起到指 引和提示的作用。
9. 与光标相关的选项，包括Caret Blink Rate（光标闪烁频 率）、Caret Width（光标宽度）、Custom Caret Color（是否自定义 光标颜色）。
10. Selection Color（选中颜色），用于指定用户选中的文字的背景色。
11. Hide Mobile Input（隐藏移动设备输入），用于隐藏移动设备的虚拟键盘。
12. Read Only（只读），只读状态下无法输入内容。

Input Field有两种事件：

1. On Value Changed（内容变化）事件，在内容产生变化（添加、删除和修改文字）时触发。
2. On End Edit（结束编辑）事件， 用户结束编辑时触发。

### 滚动区域组件（Scroll Rect）

在实际中，经常会遇到信息显示长度远大于设备显示器大小的情况。例如手机中的通讯录、游戏中的道具列表等，往往都有几十条甚 至上百条内容，但屏幕一次只能显示有限的条数。这时需要使用一种 能够纵向、横向自由滑动，方便查看所有内容的控件，即Scroll View（滚动视图控件），核心功能组件名为ScrollRect（滚动区域组件）。

观察Scroll View的子物体，可以看到它具有3个子物体：

1. Viewport（视口）
2. Scrollbar Horizontal（横向滚动条）
3. Scrollbar Vertical（纵向滚动条）

Viewport区域是控件的显示主体，用户只能通过Viewport看到 Content的一部分。Content可以比Viewport小，也可以比Viewport 大。

实际制作时，可以借用默认的Content物体，将图片、文字等内容作为Content的子物体，然后计算并设置Content的大小，让Content的 大小刚好能容纳所有内容，这样就可以实现滚动浏览所有内容的效果了。

**注意：不要设计既能横向滑动，又能纵向滑动的滚动视图**

一般来说，人们阅读较多信息时，习惯是从上到下，从左到右。需要显示更多内容时需要向下滑动，或者向右滑动，但只需要向一个方向滚动。

既能左右滚动、又能上下滑动的设计，往往是违背用户使用习 惯的。这种设计不仅不易理解，而且用户在滚动时会找不到参照物，不清楚自己正在看的是哪个部分。

在实际设计时，可以让Content宽度不大于Viewport宽度，这样就只需要纵向滑动，不需要横向滑动。同理也可以固定Viewport高度，仅横向滑动而不纵向滑动。

在现代界面中的滚动条有很多注重体验的设计，如流畅的动画、 惯性和超出范围时的弹性效果等。这些细节实现起来非常麻烦，好在 Unity已经提供了常用的动态效果，只需简单设置即可使用。Scroll Rect的关键属性如下：

1. Content（内容引用），指向子物体Content，通过Content包含 所有的内容。它是实现滚动功能的关键之一。
2. Horizontal（是否可以横向滚动）。
3. Vertical（是否可以纵向滚动）。
4. Movement Type（移动方式），包含Elastic（弹性）、 Clamped（硬限制）和Unrestricted（不限制）。这个选项指的是滚动窗口达到边缘时的效果。“弹性”效果常用于手机界面，“硬限制” 常用于PC端界面，“不限制”效果不常用。
5. Elasticity（弹性），在使用弹性效果时，指定回弹力度的大小。
6. Inertia（惯性），快速滚动时，可以开启惯性效果。开启惯性 后可以指定Deceleration Rate（减速率）。
7. Scroll Sensitivity（滚动灵敏度），影响滚动速度。
8. Viewport（视口引用），指向子物体Viewport，它是实现滚动功能的关键之一。
9. Horizontal Scrollbar（横向滚动条），指向子物体Scrollbar Horizontal，该子物体又有一个组件Scrollbar，以实现指示当前位置的功能。
10. Vertical Scrollbar（纵向滚动条），指向子物体Scrollbar Vertical，与横向滚动条类似。

当指定了横向或纵向滚动条时，还可以指定当Content不超出Viewport范围时，是否隐藏滚动条。

可选项有：

Permanent（始终显示）

Auto Hide（自动隐藏）

Auto Hide And Expand Viewport（自动隐藏并扩展）

Auto Hide And Expand Viewport的方式可以自动根据Viewport大小调整滚动条长度，建议在实际开发中试验。

Scroll Rect默认含有On Value Changed事件，可以在用户滚动滚动条时调用脚本方法，方法参数为当前滚动的位置，类型为 Vector2。

```c#
public void OnScrollChange(Vector2 pos)
{
    Debug.Log("滚动位置：" + pos);
}
```



## 脚本与事件系统

在场景中创建了UI画布之后，就会自动创建 另一个物体——事件系统（EventSystem）。

界面上各 个控件的响应事件，如按钮OnClick事件、输入文字事件等，它们的调用都离不开EventSystem的支持。如果不慎删除了EventSystem物体， 就会得到界面控件都不响应的结果，按钮不能单击，输入框也无法输入。

EventSystem提供了一种向游戏物体发送消息的途径，这些消息通常是输入消息，包括键盘、鼠标、触摸和自定义输入事件。 EventSystem包含了一系列组件，它们互相配合，以达到管理和触发事件的功能。

如果查看物体的EventSystem，会发现可调参数并不多，这是因为EventSystem本身被设计为一种管理器，而不是事件的具体处理者。

EventSystem的功能包含以下几个方面：

1. Message System（消息分发系统）
2. Input Modules（输入模块）
3. 提供多种常用输入事件接口
4. 管理各种射线，包括图形射线（Graphic Raycaster，用于UI系统）、物理射线和2D物理射线

**EventSystem不是UI专用的**

EventSystem在界面系统中最为常见，初学者也往往是在学习UI时学到EventSystem的。但这并不表示EventSystem只是UI的子系统，相反，EventSystem是一个基础系统，为其他系统提供支持。例如，整个游戏的按键检测、触摸输入、射线检测等许多需要异步调用的系统背后都有着EventSystem的支持。

甚至还可以通过编写脚本创建自定义事件，让EventSystem为特定目标服务。

### 常用输入事件

Unity至少支持17种常用输入事件：

| 事件名称（接口名称）            | 说明                                 |
| ------------------------------- | ------------------------------------ |
| IPointerEnterHandler            | 鼠标进入                             |
| IPointerExitHandler             | 鼠标离开                             |
| IPointerDownHandler             | 鼠标按下                             |
| IPointerUpHandler               | 鼠标抬起                             |
| IPointerClickHandler            | 鼠标单击（按下再抬起）               |
| IInitializePotentialDragHandler | 发现可拖拽物体，可用于初始化一些变量 |
| IBeginDragHandler               | 开始拖拽                             |
| IDragHandler                    | 拖拽中                               |
| IEndDragHandler                 | 拖拽结束                             |
| IDropHandler                    | 拖拽释放                             |
| IScrollHandler                  | 鼠标滚轮                             |
| IUpdateSelectedHandler          | 选中物体时，反复触发                 |
| ISelectHandler                  | 物体被选择                           |
| IDeselectHandler                | 物体被取消选择                       |
| IMoveHandler                    | 物体移动                             |
| ISubmitHandler                  | 提交按钮按下                         |
| ICancelHandler                  | 取消按钮按下                         |

各种输入事件不仅能用于UI控件，也能用于任意的游戏物体。例子：

```c#
using UnityEngine;
using UnityEngine.EventSystems;
public class SupportedEvents : MonoBehaviour, IPointerEnterHandler, IPointerExitHandler, IPointerDownHandler, IPointerUpHandler, IPointerClickHandler, IInitializePotentialDragHandler, IBeginDragHandler, IDragHandler, IEndDragHandler, IDropHandler, IScrollHandler, IUpdateSelectedHandler, ISelectHandler, IDeselectHandler, IMoveHandler, ISubmitHandler, ICancelHandler
{
    public void OnBeginDrag(PointerEventData eventData) {
        Debug.Log("OnBeginDrag");
    }

    public void OnCancel(BaseEventData eventData) {
        Debug.Log("OnCancel");
    }

    public void OnDeselect(BaseEventData eventData) {
        Debug.Log("OnDeselect");
    }

    public void OnDrag(PointerEventData eventData) {
        Debug.Log("OnDrag");
    }

    public void OnDrop(PointerEventData eventData) {
        Debug.Log("OnDrop");
    }

    public void OnEndDrag(PointerEventData eventData) {
        Debug.Log("OnEndDrag");
    }
    public void OnInitializePotentialDrag(PointerEventData
                                          eventData) {
        Debug.Log("OnInitializePotentialDrag");
    }

    public void OnMove(AxisEventData eventData) {
        Debug.Log("OnMove");
    }

    public void OnPointerClick(PointerEventData eventData) {
        Debug.Log("OnPointerClick");
    }

    public void OnPointerDown(PointerEventData eventData) {
        Debug.Log("OnPointerDow n");
    }
    public void OnPointerEnter(PointerEventData eventData) {
        Debug.Log("OnPointerEnter");
    }
    public void OnPointerExit(PointerEventData eventData) {
        Debug.Log("OnPointerExit");
    }
    public void OnPointerUp(PointerEventData eventData) {
        Debug.Log("OnPointerUp");
    }

    public void OnScroll(PointerEventData eventData) {
        Debug.Log("OnScroll");
    }

    public void OnSelect(BaseEventData eventData) {
        Debug.Log("OnSelect");
    }

    public void OnSubmit(BaseEventData eventData) {
        Debug.Log("OnSubmit");
    }

    public void OnUpdateSelected(BaseEventData eventData) {
        Debug.Log("OnUpdateSelected");
    }
} 
```

将脚本挂载到任意UI控件上，比如文本框控件，此时运行游戏进行测试，会发现用鼠标指针在文本框上移动、单击、鼠标右键单击、转动滚轮、按滚轮、拖曳等操作，都会在 Console窗口中输出对应的信息，这说明正确捕获到了各类事件。

**捕获到这些事件**需要以下多种组件的配合支持。

第1种，EventSystem物体上挂载的**EventSystem组件**和**Standalone Input Module组件**（独立输入模块组件）。

第2种，**画布**上挂载的**Graphic Raycaster组件**，这种射线一般**只对UI物体生效**。

EventSystem不仅支持单击、拖曳界面上的控件，还支持让场景中的2D物体、3D物体也响应这些操作。只需稍加改动，就可以让场景中的3D物体也支持上文的事件，其步骤如下：

1. 在场景中创建一个球体。
2. 将球体放在游戏中可以看到的位置，注意不要被UI控件遮挡。
3. 给球体挂载同样的SupportedEvents测试脚本。
4. 给摄像机增加一个组件——Physics Raycaster（物理射线发射器），这种射线会对具有3D碰撞体的物体起效。

运行游戏，用鼠标对Game窗口中的球体做各种输入操作，得到与UI控件类似的事件响应，这说明EventSystem对UI物体与3D物体都能起作用。

### 常用输入事件的参数

上一小节中介绍的多种输入事件，它们的参数类型有所不同。

参数是与事件相关的数据，目前以下3种有：

BaseEventData：所有事件数据的基类

PointerEventData：用于表示指针滑动、单击的数据

AxisEventData：所有的轴类输入数据，如常见手柄的摇杆就属于轴类输入

这3个类中有一些属性比较实用，如下表所示：

| BaseEventData属性  | 数据类型        | 说明                             |
| ------------------ | --------------- | -------------------------------- |
| currentInputModule | BaseInputModule | 当前输入模块                     |
| selectedObject     | GameObject      | 当前选中的物体，也就是“焦点”物体 |

| AxisEventData属性 | 数据类型          | 说明                                    |
| ----------------- | ----------------- | --------------------------------------- |
| moveVector        | Vector2           | 输入的原始值，横向、纵向的值            |
| moveDir           | MoveDirection枚举 | 将原始输入转化未上下左右或无方向5种情况 |

| PointerEventData属性  | 数据类型           | 说明                             |
| --------------------- | ------------------ | -------------------------------- |
| button                | InputButton枚举    | 触发此事件的按钮，鼠标的左中右键 |
| clickCount            | int                | 短时间内连击按钮的次数           |
| clickTime             | float              | 上次发送OnClick事件的时间        |
| delta                 | Vector2            |                                  |
| dragging              | bool               |                                  |
| enterEventCamera      | Camera             |                                  |
| hovered               | List< GameObject > |                                  |
| lastPress             | GameObject         |                                  |
| pointerCurrentRaycast | RaycastResult      |                                  |
| pointerDrag           | GameObject         |                                  |
| pointerEnter          | GameObject         |                                  |
| pointerId             | int                |                                  |
| pointerPress          | GameObject         |                                  |
| pointerPressRaycast   | RaycastResult      |                                  |
| position              | Vector2            |                                  |
| pressEventCamera      | Camera             |                                  |
| pressPosition         | Vector2            |                                  |
| rawPointerPress       | GameObject         |                                  |
| scrollDelta           | Vector2            |                                  |



### 动态添加事件响应方法



### 事件触发器（Event Trigger）



### 动态绑定事件的高级技巧

