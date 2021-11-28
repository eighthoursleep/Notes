# WebGL入门操作

## Canvas及其使用方式

Canvas在这里是指`<canvas>`标签，是HTML5中新引入的元素，它定义了网页的绘图区域。

HTML5出现前，只能在`<img>`标签上显示静态图像，不能实时绘制和渲染，要显示动态图像就通过第三方解决方案Flash Player等。

HTML5出现后，引入`<canvas>`标签，允许JS动态绘制二维图形。WebGL加入后，允许JS在`<canvas>`绘制三维图形。

## HTML引入WebGL JS文件

例子：

DrawRectangle.html

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>Draw a blue rectangle (canvas version)</title>
    </head>
    <body onload="main()">
        <canvas id="example" width="500" height="500">
            Please use a browser that supports canvas
        </canvas>
        <script src="DrawRectangle.js"></script>
    </body>
</html>
```

DrawRectangle.js

```javascript
function main(){
    var canvas = document.getElementById("example");//获取canvas标签
    if(!canvas){
        console.log("Fail to retrieve the <canvas> element");
        return;
    }
    
    var ctx = canvas.getContext('2d');//向canvas请求二维图形的绘图区域
    ctx.fillStype = 'rgba(0,0,255,1.0)';//设置填充色为蓝色
    ctx.fillRect(120,10,150,150);//填充矩形
}
```

- `<canvas>`标签通过属性`width`和`height`规定画布区域大小（像素数），用属性id指定唯一标识符。
- 默认情况下，如果不用JS做些什么，`<canvas>`是透明的。
- 如果浏览器不支持`<canvas>`，会直接忽略，因此可以在标签下写上提示错误的信息。
- `<body>`标签指定`onload`属性，告诉浏览器`< body >`元素加载完成后（即页面加载完成），以`DrawRectangle.js`为入口，执行里边定义的`main()`函数。

## 访问WebGL环境（WebGL Context）

WebGL Context是一个JS对象，我们可以通过它访问WebGL的函数和属性，即调用WebGL API。

**WebGL Context可以理解为一种类似状态机的东西，一旦你修改了它的属性，这个修改效果会一直保持着，直到下一次修改。**你可以在任何时候查询WebGL Context属性，来知道属性被改成什么样了才导致现在呈现的显示效果。

WebGL无需下载什么东西添加到你的项目文件夹里，因为它已经存在于Web浏览器中。

获取到canvas后，通过`getContext("webgl2")`函数获取到WebGL Context的引用。

`getContext()`方法还可以访问H5的2D图形库。

例子：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Real-Time 3D Graphics with WebGL2</title>
    <style type="text/css">
        canvas{
            border: 5px dotted blue;
        }
    </style>
    <script type="text/javascript">
        'use strict';
        function init(){
            const canvas = document.getElementById('webgl-canvas');
            if(!canvas){
                console.error('此页面没有找到canvas元素');
                return;
            }
            const glContext = canvas.getContext('webgl2');
            const msg = glContext
                ? '成功获取到WebGL2 Context'
                :'不支持WebGL';
            alert(msg);
        }
        //当document加载完成后调用init
        window.onload = init;
    </script>
</head>
<body>
    <canvas id="webgl-canvas" width="800" height="600">
        Your browser does not support the HTML5 canvas element.
    </canvas>
</body>
</html>
```

WebGL Context可以理解为一种类似状态机的东西，当你修改WebGL Context的属性，这个修改效果会一直保持，直到下一次修改。你可以在任何时候查询WebGLContext当前时刻的属性，以便对照当前的效果。

## 设置WebGL Context属性

下边的例子，通过`clearColor()`函数换颜色清空canvas，通过`getParameter(glContext.COLOR_CLEAR_VALUE)`获取canvas当前的清屏颜色。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Real-Time 3D Graphics with WebGL2</title>
    <style type="text/css">
        canvas{
            border: 5px dotted blue;
        }
    </style>
    <script type="text/javascript">
        'use strict';
        let glContext;
        function updateClearColor(...color) {
            glContext.clearColor(...color);
            glContext.clear(glContext.COLOR_BUFFER_BIT);
            glContext.viewport(0,0,0,0);
        }
        function checkKey(event) {
            console.log("event.keyCode",event.keyCode);
            switch (event.keyCode) {
                case 49:{   //键盘数字键1的keyCode
                    updateClearColor(0.2,0.8,0.2,1.0);//绿色
                    break;
                }
                case 50:{   //键盘数字键2的keyCode
                    updateClearColor(0.2,0.2,0.8,1.0);//蓝色
                    break;
                }
                case 51:{   //键盘数字键3的keyCode
                    updateClearColor(Math.random(), Math.random(), Math.random(), 1.0);//随机颜色
                    break;
                }
                case 52:{   //键盘数字键4的keyCode
                    const color = glContext.getParameter(glContext.COLOR_CLEAR_VALUE);
                    alert(`clearColor = (
                        ${color[0].toFixed(1)},
                        ${color[1].toFixed(1)},
                        ${color[2].toFixed(1)},
                    )`)
                    window.focus();
                    break;
                }
            }
        }
        function init(){
            const canvas = document.getElementById('webgl-canvas');
            if(!canvas){
                console.error('此页面没有找到canvas元素');
                return;
            }
            glContext = canvas.getContext('webgl2');
            const msg = glContext
                ? '成功获取到WebGL2 Context'
                :'不支持WebGL';
            alert(msg);
            //当键盘上某个键被按下时调用checkKey
            window.onkeydown = checkKey;
        }
        //当document加载完成后调用init
        window.onload = init;
    </script>
</head>
<body>
    <canvas id="webgl-canvas" width="800" height="600">
        Your browser does not support the HTML5 canvas element.
    </canvas>
</body>
</html>
```



## 清空绘图区

```javascript
glContext.clear(buffer)
```
该函数**指定缓冲区设定为预定的值**。如果清空的是颜色缓冲区，将使用`clearColor()`指定的值。

参数buffer指定待清空的缓冲区，位运算操作符“或”（|）可用来指定多个缓冲区，它可以接收以下常量：
`glContext.COLOR_BUFFER_BIT`指定颜色缓存
`glContext.DEPTH_BUFFER_BIT`指定深度缓存区
`glContext.STENCIL_BUFFER_BIT`指定模板缓冲区


例子：

HelloCanvas.html

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>Clear Canvas</title>
    </head>
    <body onload="main()">
        <canvas id="example" width="500" height="500">
            Please use a browser that supports canvas
        </canvas>
        <script src="../lib/webgl-utils.js"></script>
        <script src="../lib/webgl-debug.js"></script>
        <script src="../lib/cuon-utils.js"></script>
        <script src="HelloCanvas.js"></script>
    </body>
</html>
```

HelloCanvas.js

```javascript
function main(){
    var canvas = document.getElementById("example");
    if(!canvas){
        console.log("Fail to retrieve the <canvas> element");
        return;
    }
    //获取WebGL绘图区域
    var glContext = getWebGLContext(canvas);
    if(!glContext){
        console.log("Failed to get the rendering context for WebGL");
        return;
    }
    //指定清空canvas的填充色 red, green, blue, alpha
    //如果任何参数值小于0.0或者大于1.0，会被截断为0.0或1.0
    glContext.clearColor(0.0, 0.0, 0.0, 1.0);
    //清空canvas
    glContext.clear(glContext.COLOR_BUFFER_BIT);
}
```

由于WebGL继承自OpenGL，因此它遵循OpenGL颜色分量的取值范围，从0.0到1.0而非0到255。RGB值越高，颜色越亮，第4分量α值越高，颜色越不透明。

背景色一旦指定，会驻存在WebGL系统中，在下一次调用`clearColor()`方法前不会改变。

如果没有调用glContext.clearColor()指定背景色，则使用默认值如下表：

| 缓冲区     | 默认值               | 相关函数                                      |
| ---------- | -------------------- | --------------------------------------------- |
| 颜色缓冲区 | (0.0, 0.0, 0.0, 0.0) | glContext.clearColor(red, green, blue, alpha) |
| 深度缓冲区 | 1.0                  | glContext.clearDepth(depth)                   |
| 模板缓冲区 | 0                    | glContext.clearStencil(s)                     |

## 着色器

### 通过着色器绘制一个点

例子：

HelloPoint.html

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>Draw a point (1)</title>
    </head>
    <body onload="main()">
        <canvas id="example" width="500" height="500">
            Please use a browser that supports canvas
        </canvas>
        <script src="../lib/webgl-utils.js"></script>
        <script src="../lib/webgl-debug.js"></script>
        <script src="../lib/cuon-utils.js"></script>
        <script src="HelloPoint1.js"></script>
    </body>
</html>
```

HelloPoint.js

```javascript
var VSHADER_SOURCE = `
    void main(){
        gl_Position = vec4(0.0, 0.0, 0.0, 1.0);//顶点位置指定为(0.0, 0.0, 0.0)，此处有4个分量是因为位置使用齐次坐标表示。
        gl_PointSize = 10.0;//顶点大小指定为10个像素
    }
`
var FSHADER_SOURCE = `
    void main(){
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);//顶点颜色指定为红色
    }
`
function main(){
    var canvas = document.getElementById("example");
    if(!canvas){
        console.log("Fail to retrieve the <canvas> element");
        return;
    }

    var glContext = getWebGLContext(canvas);
    if(!glContext){
        console.log("Failed to get the rendering context for WebGL");
        return;
    }
    //初始化着色器
    if (!initShaders(glContext, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Failed to initialize shaders.");
        return;
    }

    glContext.clearColor(0.0, 0.0, 0.0, 1.0);
    glContext.clear(glContext.COLOR_BUFFER_BIT);
    //绘制一个点
    glContext.drawArrays(glContext.POINTS, 0, 1);//从第0个点开始绘制，绘制一个点
}
```

- 什么是着色器？

使用WebGL绘图必须使用着色器。

在WebGL代码中，着色器程序以字符串的形式嵌在JavaScript中，在程序真正开始运行前它就已经设置好了。

WebGL需要两种着色器：

- **顶点着色器（Vertex shader）**
  - 用来描述顶点的特性（比如位置、颜色等）。

- **片元着色器（Fragmentshader）**
  - 进行逐片元处理过程（比如光照）

着色器使用类似C的OpenGL ES着色器语言（`GLSL ES`）编写，代码作为字符串存储在变量`VSHADER_SOURCE`和`FSHADER_SOURCE`中。

例子程序执行流程：

1. 运行JavaScript程序
2. 调用WebGL相关方法
3. 执行顶点着色器
4. 执行片元着色器
5. 在颜色缓冲区内绘制
6. 清空绘图区
7. 颜色缓冲区的内容在canvas上显示

- 关于初始化着色器

`initShader()`在`cuon.util.js`中定义，源码如下

```javascript
/**
 * Create a program object and make current
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return true, if the program object was created and successfully made current 
 */
function initShaders(gl, vshader, fshader) {
  var program = createProgram(gl, vshader, fshader);
  if (!program) {
    console.log('Failed to create program');
    return false;
  }

  gl.useProgram(program);
  gl.program = program;

  return true;
}
```

initShaders()将着色器代码传给WebGL系统，并建立着色器以便随时可用。

注意：着色器运行在WebGL系统中，而非JavaScript程序中。

### 顶点着色器

和C语言程序一样，着色器程序必须包含一个**无返回值**且**不能指定参数**的`main()`函数。

顶点着色器的内置变量：

| 类型  | 变量名       | 描述                   |
| ----- | ------------ | ---------------------- |
| vec4  | gl_Position  | 表示顶点位置           |
| float | gl_PointSize | 表示点的尺寸（像素数） |

`gl_Position`必须被赋值，否则着色器无法正常工作。

`gl_PointSize`不是必须的，因为默认值为1.0。

GLSL ES是一种强类型语言，开发者需要明确指出某个变量属于某种“类型”。通过给变量指定类型，系统可以轻易理解变量中存储的是何种数据，进而优化处理这些数据。

类型`vec4`表示由4个浮点数组成的矢量。

### 片元着色器

`gl_FragColor`是片元着色器的唯一内置变量，控制者像素在屏幕上的最终颜色（RGBA格式）。

## 绘制函数

`glContext.drawArrays()`是一个强大的函数，可以用来绘制各种图形。规范如下：

```javascript
glContext.drawArrays(mode, first, count)
//执行顶点着色器，按照mode参数指定的方式绘制图形

//mode：指定绘制方式，可接收以下常量符号：
//glContext.POINTS
//glContext.LINES
//glContext.LINE_STRIP
//glContext.LINE_LOOP
//glContext.TRIANGLES
//glContext.TRIANGLES_STRIP
//glContext.TRIANGLE_FAN

//first：整型，指定从哪个顶点开始绘制，0表示第1个

//count：整型，指定绘制需要用到多少个顶点
```

当程序调用`glContext.drawArrays()`时，顶点着色器被执行`count`次，每次处理一个顶点。

一旦顶点着色器执行完毕后，片元着色器才会开始执行。

## WebGL坐标系统

WebGL使用**笛卡尔坐标系**，具有XYZ三个轴。

当开发者面向屏幕时：

**X轴**是水平的，**正方向向右**；

**Y轴**是垂直的，**正方向向下**；

**Z轴**垂直于屏幕，**正方向向外**。

这套坐标系又称**右手坐标系**。

## 从JavaScript向着色器传输数据

使用attribute变量和uniform变量可以做到这点。

**attribute变量**是一种GLSL ES变量，用来从外部向顶点着色器传输数据，只有顶点着色器可使用。

**uniform变量**传输对于所有顶点都相同的数据或与顶点无关的数据

#### attribute变量

关键词`attribute`一个**存储限定符**，还有一个存储限定符叫`uniform`，`attribute`表示接下来的变量是一个attribute变量。

**attribute变量必须声明为全局变量。**

变量的声明格式：

> < 存储限定符 > < 类型 > < 变量名 >

我们在使用`initShaders()`在WebGL系统中建立顶点着色器后，WebGL会对着色器进行解析，辨识出着色器具有的attribute变量，每个变量都有一个存储地址，以便外部通过存储地址向变量传输数据。

**怎么获取attribute变量?**

使用`gl.getAttributeLocation()`函数。

```javascript
gl.getAttributeLocation(program, name)
//获取由name指定的attribute变量的存储地址
/*
参数program: 着色器程序对象（包含顶点着色器和片元着色器）
参数name: 想要获取其存储地址的attribute变量的名称
返回值大于等于0: attribute变量的存储地址
返回-1: 指定的attribute变量不存在，或者命名具有gl_或webgl_前缀
*/
```

**怎么向attribute变量赋值？**

使用`gl.vertexAttrib3f()`函数。

```js
gl.vertexAttrib3f(location, v0, v1, v2)
//将数据(v0,v1,v2)传入由location参数指定的attribute变量
/*
参数location: 要修改的attribute变量的存储位置
v0~v2均为浮点型数值，即xyz坐标值
无返回值
*/
```

`gl.vertexAttrib3f()`的同族函数：

```js
gl.vertexAttrib1f(location, v0)
gl.vertexAttrib2f(location, v0, v1)
gl.vertexAttrib3f(location, v0, v1, v2)
gl.vertexAttrib4f(location, v0, v1, v2, v3)//函数名最后一个字母f表示浮点型，改成i则表示整型
gl.vertexAttrib4v(location, v)//传四维向量，4表示数组中的元素个数
```

```js
var position =  new Float32Array([1.0, 2.0, 3.0, 1.0]);
gl.vertexAttrib4fv(a_Position, position);
```

**步骤**：

1. 在顶点着色器声明attribute变量；
2. 将attribute变量赋值给`gl_Position`变量；
3. 向attribute变量传数据。

**例子**（通过attribute变量给顶点着色器传输位置信息）：

HelloPoint2.html

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>Draw a point (2)</title>
    </head>
    <body onload="main()">
        <canvas id="example" width="500" height="500">
            Please use a browser that supports canvas
        </canvas>
        <script src="../lib/webgl-utils.js"></script>
        <script src="../lib/webgl-debug.js"></script>
        <script src="../lib/cuon-utils.js"></script>
        <script src="HelloPoint2.js"></script>
    </body>
</html>
```

```javascript
//HelloPoint2.js
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_PointSize;
    void main(){
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
    }
`
var FSHADER_SOURCE = `
    void main(){
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`
function main(){
    var canvas = document.getElementById("example");
    if(!canvas){
        console.log("Fail to retrieve the <canvas> element");
        return;
    }

    var glContext = getWebGLContext(canvas);
    if(!glContext){
        console.log("Failed to get the rendering context for WebGL");
        return;
    }

    if (!initShaders(glContext, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Failed to initialize shaders.");
        return;
    }

    //获取attribute变量的存储位置
    var a_Position = glContext.getAttribLocation(glContext.program, "a_Position");
    if (a_Position < 0) {
        console.log("Failed to get the storage location of a_Position");
        return;
    }
    var a_PointSize = glContext.getAttribLocation(glContext.program, "a_PointSize");
    if (a_PointSize < 0) {
        console.log("Failed to get the storage location of a_PointSize");
        return;
    }

    //将顶点位置传输给attribute变量
    glContext.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
    //将顶点大小传输给attribute变量
    glContext.vertexAttrib1f(a_PointSize, 5.0);

    glContext.clearColor(0.0, 0.0, 0.0, 1.0);
    glContext.clear(glContext.COLOR_BUFFER_BIT);

    glContext.drawArrays(glContext.POINTS, 0, 1);
}
```

WebGL系统的绘制操作实际上是在颜色缓冲区中进行绘制，绘制结束后系统将缓冲区中的内容显示在屏幕上，然后颜色缓冲区就会被重置，其中的内容会丢失（默认操作）。

**例子**（点击画点）

```js
//ClickPoint.js
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    void main(){
        gl_Position = a_Position;
        gl_PointSize = 5.0;
    }
`
var FSHADER_SOURCE = `
    void main(){
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`
function main(){
    var canvas = document.getElementById("example");
    if(!canvas){
        console.log("Fail to retrieve the <canvas> element");
        return;
    }

    var glContext = getWebGLContext(canvas);
    if(!glContext){
        console.log("Failed to get the rendering context for WebGL");
        return;
    }

    if (!initShaders(glContext, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Failed to initialize shaders.");
        return;
    }

    //获取attribute变量的存储位置
    var a_Position = glContext.getAttribLocation(glContext.program, "a_Position");
    if (a_Position < 0) {
        console.log("Failed to get the storage location of a_Position");
        return;
    }

    glContext.clearColor(0.0, 0.0, 0.0, 1.0);
    glContext.clear(glContext.COLOR_BUFFER_BIT);

    canvas.onmousedown = function (ev){
        click(ev, canvas, glContext, a_Position);
    }
}
var g_points = [];
function click(ev,canvas, glContext, a_Position){
    var rect = ev.target.getBoundingClientRect();
    var canvasWidth = canvas.clientWidth;
    var canvasHeight = canvas.clientHeight;
    var point_x = (ev.clientX - rect.left - canvasWidth/2)/(canvasWidth/2);
    var point_y = ( - (ev.clientY - rect.top - canvasHeight/2))/(canvasHeight/2);
    g_points.push([point_x,point_y]);
    glContext.clear(glContext.COLOR_BUFFER_BIT);//每一次点击，画前先清屏
    var tempPoint;
    for (var i=0;i<g_points.length;i++){
        tempPoint = g_points[i];
        glContext.vertexAttrib2f(a_Position, tempPoint[0], tempPoint[1]);//传入每个点的位置
        glContext.drawArrays(glContext.POINTS, 0, 1);//绘制每个点
    }
}
```

#### uniform变量

只有顶点着色器才可以使用`attribute`变量，使用片元着色器需要使用`uniform`变量或者`varying`变量。

获取uniform变量的存储地址，使用`getUniformLocation()`函数，和获取attribute变量的地址类似。

给uniform变量赋值的函数也和attribute类似：

```js
gl.uniform1f(location, v0)
gl.uniform2f(location, v0, v1)
gl.uniform3f(location, v0, v1, v2)

gl.uniform4f(location, v0, v1, v2, v3)
```



**例子**（点击画出不同象限对应的颜色的点）

```js
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    void main(){
        gl_Position = a_Position;
        gl_PointSize = 5.0;
    }
`
var FSHADER_SOURCE = `
    precision mediump float;//精度限定词，用于指定变量的范围和精度，这里用中等精度。
    uniform vec4 u_FragColor;
    void main(){
        gl_FragColor = u_FragColor;
    }
`
function main(){
    var canvas = document.getElementById("example");
    if(!canvas){
        console.log("Fail to retrieve the <canvas> element");
        return;
    }

    var glContext = getWebGLContext(canvas);
    if(!glContext){
        console.log("Failed to get the rendering context for WebGL");
        return;
    }

    if (!initShaders(glContext, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Failed to initialize shaders.");
        return;
    }

    //获取attribute变量的存储位置
    var a_Position = glContext.getAttribLocation(glContext.program, "a_Position");
    if (a_Position < 0) {
        console.log("Failed to get the storage location of a_Position");
        return;
    }
    var u_FragColor = glContext.getUniformLocation(glContext.program,"u_FragColor");
    if (u_FragColor < 0) {
        console.log("Failed to get the storage location of u_FragColor");
        return;
    }

    glContext.clearColor(0.0, 0.0, 0.0, 1.0);
    glContext.clear(glContext.COLOR_BUFFER_BIT);

    initColors();

    canvas.onmousedown = function (ev){
        click(ev, canvas, glContext, a_Position, u_FragColor);
    }
}

var g_points = [];
var g_colors = [];
function click(ev,canvas, glContext, a_Position, u_FragColor){
    var rect = ev.target.getBoundingClientRect();
    var canvasWidth = canvas.clientWidth;
    var canvasHeight = canvas.clientHeight;
    var point_x = (ev.clientX - rect.left - canvasWidth/2)/(canvasWidth/2);
    var point_y = ( - (ev.clientY - rect.top - canvasHeight/2))/(canvasHeight/2);
    g_points.push([point_x,point_y]);
    glContext.clear(glContext.COLOR_BUFFER_BIT);//每一次点击，画前先清屏
    var tempPoint;
    for (var i=0;i<g_points.length;i++){
        tempPoint = g_points[i];
        var tempColor = getColor(tempPoint[0],tempPoint[1]);
        glContext.vertexAttrib2f(a_Position, tempPoint[0], tempPoint[1]);//传入每个点的位置
        glContext.uniform4f(u_FragColor,tempColor[0],tempColor[1],tempColor[2],tempColor[3]);
        glContext.drawArrays(glContext.POINTS, 0, 1);//绘制每个点
    }
}

function initColors(){
    g_colors.push([1.0, 0.0, 0.0, 1.0]);
    g_colors.push([0.0, 1.0, 0.0, 1.0]);
    g_colors.push([0.0, 0.0, 1.0, 1.0]);
    g_colors.push([1.0, 1.0, 1.0, 1.0]);
}

function getColor(posX, posY){
    var color;
    if (posX >= 0 && posY >= 0){
        color = g_colors[0];
    }else if (posX < 0 && posY >= 0){
        color = g_colors[1];
    }else if (posX < 0 && posY < 0){
        color = g_colors[2];
    }else if (posX >= 0 && posY < 0){
        color = g_colors[3];
    }
    return color;
}
