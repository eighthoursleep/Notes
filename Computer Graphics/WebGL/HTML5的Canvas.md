# HTML5的Canvas

HTML5的Canvas是屏幕上由JS控制的**即时模式位图区域**。

**即时模式**：指在画布上呈现像素的方式。Canvas通过JS调用Canvas API，在每一帧中完全重绘屏幕上的位图。

开发人员要做的就是在**每一帧渲染之前**设置屏幕上的内容显示。

## DOM和Canvas

DOM（文档对象模式）代表HTML页面上的所有对象，它是语言中立且平台中立的。

DOM允许页面的内容和样式被Web浏览器渲染之后再次更新。用户可以通过JS访问DOM。

DOM是JS、DHTML、CSS开发中最重要的一部分。

Canvas本身可以通过DOM在Web浏览器中经过Canvas2D环境访问。但在Canvas中创建的单个图形元素不能通过DOM访问。

Canvas工作在即时模式，不保存自己的对象，只是说明在单个帧里绘制什么。

在使用Canvas前需要了解两个DOM对象：

1. document，它包含HTML页面上的所有HTML标签。
2. window，DOM的最高一级，需要检测这个对象来确保在开始使用Canvas应用程序之前，所有资源和代码已经加载。

## JS和Canvas

用JS创建的Canvas应用程序能在现有的任何Web浏览器里运行。

在创建的页面中哪里是JS程序的起点？（两种方式）

1. 将起点放在`<head>`元素中，意味着整个HTML页面要加载完JS才能配合HTML运行。在运行该程序前必须检查HTML页面是否已经加载完毕。
2. 将起点放在`<body>`元素中，可以确保JS运行时整个页面已经加载完毕。

在运行Canvas程序前需要使用JS测试页面是否加载，因此以上方法各有利弊。

## Canvas的"HelloWorld"

由于Canvas只在屏幕上特定区域内执行并显示结果，可以说它的功能时独占的，不太会受到页面上其他内容的影响。如果要在同一个也页面放置多个Canvas应用，必须在定义时将对应代码分开。

为避免受页面其他内容影响，将变量和函数都封装在一个函数里。

### 封装JS代码

```javascript
function eventWindowLoaded(){//canvas入口函数
	canvasApp();
}
function canvasApp(){
	drawScreen();
	...
	function drawScreen(){
		...
	}
}
```

### 将Canvas添加到HTML页面中

在`<body>`标签中添加一个`<canvas>`标签，它通过属性设置名字、宽度、高度：

```html
<canvas id="myCanvas" width="500" height="500">
若看到这个文字，说明浏览器不支持WebGL!</canvas></div>
```

DOM引用`<canvas>`，document对象加载后可以引用HTML页面的任何元素。需要一个canvas对象的引用，这样就可以直到当JS调用Canvas API时，结果在哪显示了。

```js
var myCanvas = document.getElementById("myCanvas");
```

### 检查浏览器是否支持Canvas

可以使用`modernizr.js`库中的Modernizr，它是一个易用且轻量级的库，可以检测Web技术的支持情况。Modernizr创建一组静态布尔值，可以检测是否支持Canvas。

```js
<script src="js/modernizr.js"></script>
function canvasSupport(){
	return Modernizr.canvas;
}
```

### 获取2D环境

需要得到2D环境的引用才可以操作它。HTMLL5的Canvas被设计为可以于多个环境工作，包含一个建议的3D环境。在这里我们可以获取2D环境。通过`getContext()`方法获取context，在Canvas上运行的各种操作都要通过context对象，因为它引用了HTML页面上的对象。

```js
var context=myCanvas.getContext("2d");
```

### 绘制函数

现在可以创建实际的Canvas程序了，首先清空绘图区域

```js
context.fillStyle="#ffffaa";
context.fillRect(0,0,500,300);
```

上边的代码在屏幕上绘制一个于画布大小相同的黄色方块。

`fillStyle`设置颜色

`fillRect()`创建矩形并放到屏幕上。

下边是一个比较完整的绘图函数：

```js
function drawScreen(){
    context.fillStyle="#aaaaaa";	//背景颜色
    context.fillRect(0,0,500,300);	//创建矩形
    context.fillStyle='#000000';	//文字颜色
    context.font='20px Sans-Serif';		//设置字体的大小和字号
    context.textBaseline='top';		//设置字体的垂直对齐方式
    context.fillText("Hello World!",195,80);	//将文本显示在屏幕上
    var image = new Image();	//添加2D图片
    image.onload = function(){	//设置一个图像加载完成的回调函数
        context.drawImage(image,155,110);
    }
    image.src = "pic/YouPicture.png";
    context.strokeStyle = "#000000";	//设置边框
    context.strokeRect(5,5,490,290);
}
```

### 绘制基础图像

Sample.html

```html
<!DOCTYPE HTML>
<html><head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Sampel1_24</title>
<script src="js/modernizr.js"></script>
<script src="js/arc.js"></script>
<script src="js/bezier.js"></script>
<script src="js/line.js"></script>
<script src="js/linejoin.js"></script>
<script src="js/rect.js"></script>
<script type="text/javascript">
var context;
function eventWindowLoaded(){
	canvasApp();
}

function canvasSupport(){
	return Modernizr.canvas;
}
function canvasApp(){
	if(!canvasSupport()){
		return;
	}else{
		var theCanvas = document.getElementById("canvas");
		context=theCanvas.getContext("2d");
	}
	drawScreen();
	//arcdrawScreen();
	//bezierdrawScreen();
	//linedrawScreen();
	//linejoindrawScreen();
	//rectdrawScreen();
	function drawScreen()//绘制2D图形的方法
	{
		//画布背景色为白色不利于辨识，填充一个有颜色的区域便于标示。
		context.fillStyle="#aaaaaa";
		context.fillRect(0,0,500,500);
		context.fillStyle='#000000';
		context.font='20px _sans';
		context.textBaseline='top';
		context.fillText("Canvas!",0,0);
	}
}
</script>
</head>
<body onload="eventWindowLoaded();">
<!-- onload函数在页面加载完毕后调用 -->
<div style="position: absolute; top: 50px;left:50px;">
<canvas id="canvas" width="500" height="500">
若看到这个文字，说明浏览器不支持WebGL!</canvas></div>
</body>
</html>
```

arc.js

```js
function arcdrawScreen(){
	//画布背景色为白色不利于辨识，填充一个有颜色的区域便于标示。
	context.fillStyle="#aaaaaa";
	context.fillRect(0,0,500,500);
	//绘制圆弧
	context.beginPath();
	context.strokeStyle="red";
	context.lineWidth=5;
	context.arc(100,100,20,(Math.PI/180)*0,(Math.PI/180)*360,false);//绘制整圆
	//context.arc(100,100,20,(Math.PI/180)*0,(Math.PI/180)*90,false);//绘制1/4圆
	//context.arc(100,100,20,(Math.PI/180)*0,(Math.PI/180)*90,true);//anticlockwise值改为true绘制3/4圆
	context.stroke();
	context.closePath();
}
```

bezier.js

```js
function bezierdrawScreen(){
	context.beginPath();
	context.strokeStyle="red";
	context.lineWidth=5;
	//画布背景色为白色不利于辨识，填充一个有颜色的区域便于标示。
	context.fillStyle="#aaaaaa";
	context.fillRect(0,0,500,500);
	//绘制简单平法贝塞尔曲线
	context.moveTo(0,0);
	context.quadraticCurveTo(100,25,0,50);
	//有两个控制点的贝塞尔曲线
	context.moveTo(150,0);
	context.bezierCurveTo(0,125,300,175,150,300);
	context.stroke();
	context.closePath();
}
```

line.js

```js
function linedrawScreen(){
	//画布背景色为白色不利于辨识，填充一个有颜色的区域便于标示。
	context.fillStyle="#aaaaaa";
	context.fillRect(0,0,500,500);
	//简单直线路径
	context.strokeStyle="red";//设置笔触样式，定义线和形状边框的颜色和样式。
	context.lineWidth=10;//设置线宽
	context.lineCap='square';//定义上下文中线的端点，butt为默认值，端点是垂直于线段边缘的平直边缘
	//round端点是在线段边缘处以线宽为直径的半圆square端点在线段边缘处以线宽为长一半线宽为宽的矩形。
	context.beginPath();//调用函数开始一个路径
	context.moveTo(20,80);//设置起点
	context.lineTo(100,80);//设置终点
	context.stroke();//画出构建的路径
	context.closePath();//结束一个路径
}
```

linejoin.js

```js
function linejoindrawScreen(){
	//画布背景色为白色不利于辨识，填充一个有颜色的区域便于标示。
	context.fillStyle="#aaaaaa";
	context.fillRect(0,0,500,500);
	//高级线段绘制，圆形端点，斜角链接，在画布左上角
	context.strokeStyle="red";
	context.lineWidth=10;
	context.lineJoin='bevel';//定义两条线相交产生的拐角，可将其称为连接。在连接处创建一个填充三角形
	//miter为默认值，在连接处边缘延长相接。miterLimit是角长和线宽所允许的最大比例（默认10）
	//bevel连接处是一个对角线斜角，round连接处是一个圆
	context.lineCap='round';
	context.beginPath();
	context.moveTo(0,0);
	context.lineTo(25,0);
	context.lineTo(25,25);
	context.stroke();
	context.closePath();
	//圆形端点，斜角连接，不在画布左上角
	context.beginPath();
	context.moveTo(10,50);
	context.lineTo(35,50);
	context.lineTo(35,75);
	context.stroke();
	context.closePath();
	//平直端点，圆形连接，不在画布左上角
	context.lineJoin="round";
	context.lineCap='butt';
	context.beginPath();
	context.moveTo(10,100);
	context.lineTo(35,100);
	context.lineTo(35,125);
	context.stroke();
}
```

rect.js

```js
function rectdrawScreen(){
	//画布背景色为白色不利于辨识，填充一个有颜色的区域便于标示。
	context.fillStyle="#aaaaaa";
	context.fillRect(0,0,500,500);
	//绘制矩形
	context.fillStyle='#000000';//设置Canvas绘图时所需的填充或描边样式。
	context.strokeStyle='#ff00ff';
	context.lineWidth=2;//设置画笔
	context.fillRect(10,10,40,40);//绘制填充矩形,绘制矩形的四个参数前两个为位置，后两个为宽与高
	context.strokeRect(0,0,60,60);//绘制矩形边框，需要使用当前strokeStyle、lineWidth、lineJoin以及miterLimit设置。
	context.clearRect(20,20,20,20);//清除指定区域并使其完全透明。
}
```

