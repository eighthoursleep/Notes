# WebGL简单绘图

## Canvas及其使用方式

Canvas在这里是指`< canvas >`标签，是HTML5中新引入的元素，它定义了网页的绘图区域。

HTML5出现前，只能在`< img>`标签上显示静态图像，不能实时绘制和渲染，要显示动态图像就通过第三方解决方案Flash Player等。

HTML5出现后，引入`< canvas >`标签，允许JS动态绘制二维图形。WebGL加入后，允许JS在`< canvas >`绘制三维图形。

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

- `< canvas >`标签通过属性`width`和`height`规定画布区域大小（像素数），用属性id指定唯一标识符。
- 默认情况下，如果不用JS做些什么，`< canvas >`是透明的。
- 如果浏览器不支持`< canvas >`，会直接忽略，因此可以在标签下写上提示错误的信息。
- `< body >`标签指定`onload`属性，告诉浏览器`< body >`元素加载完成后（即页面加载完成），以`DrawRectangle.js`为入口，执行里边定义的`main()`函数。

## 简单的WebGL绘图函数

### 从清空绘图区开始

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
    //指定清空canvas的填充色
    glContext.clearColor(0.0, 0.0, 0.0, 1.0);
    //清空canvas
    glContext.clear(glContext.COLOR_BUFFER_BIT);
}
```

- 关于指定背景色

```javascript
glContext.clearColor(red, green, blue, alpha)
//如果任何参数值小于0.0或者大于1.0，会被截断为0.0或1.0
```

由于WebGL继承自OpenGL，因此它遵循OpenGL颜色分量的取值范围，从0.0到1.0而非0到255。RGB值越高，颜色越亮，第4分量α值越高，颜色越不透明。

背景色一旦指定，会驻存在WebGL系统中，在下一次调用`clearColor()`方法前不会改变。

- 关于清空canvas

```javascript
glContext.clear(buffer)
//该函数指定缓冲区设定为预定的值。如果清空的是颜色缓冲区，将使用clearColor()指定的值

//buffer指定待清空的缓冲区，位运算操作符“或”（|）可用来指定多个缓冲区，它可以接收以下常量：
//glContext.COLOR_BUFFER_BIT 指定颜色缓存
//glContext.DEPTH_BUFFER_BIT 指定深度缓存区
//glContext.STENCIL_BUFFER_BIT 指定模板缓冲区
```

如果没有调用glContext.clearColor()指定背景色，则使用默认值如下表：

| 缓冲区     | 默认值               | 相关函数                                      |
| ---------- | -------------------- | --------------------------------------------- |
| 颜色缓冲区 | (0.0, 0.0, 0.0, 0.0) | glContext.clearColor(red, green, blue, alpha) |
| 深度缓冲区 | 1.0                  | glContext.clearDepth(depth)                   |
| 模板缓冲区 | 0                    | glContext.clearStencil(s)                     |

### 从绘制一个点开始认识着色器

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

- 顶点着色器（Vertex shader）
  - 用来描述顶点的特性（比如位置、颜色等）。

- 片元着色器（Fragmentshader）
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

和C语言程序一样，着色器程序必须包含一个无返回值且不能指定参数的`main()`函数。

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

### 绘制操作

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

### WebGL坐标系统

WebGL使用**笛卡尔坐标系**，具有XYZ三个轴。

当开发者面向屏幕时：

**X轴**是水平的，**正方向向右**；

**Y轴**是垂直的，**正方向向下**；

**Z轴**垂直于屏幕，**正方向向外**。

这套坐标系又称**右手坐标系**。

### 从JavaScript向着色器传输数据

使用**attribute变量**和**uniform变量**可以做到这点。

attribut变量是一种GLSL ES变量，用来从外部向顶点着色器传输数据，只有顶点着色器可使用。

uniform变量传输对于所有顶点都相同的数据或与顶点无关的数据

#### attribute变量

使用步骤：

1. 在顶点着色器声明attribute变量；
2. 将attribute变量赋值给`gl_Position`变量；
3. 向attribute变量传数据。

例子（通过attribute变量给顶点着色器传输位置信息）：

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

HelloPoint2.js

```javascript
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    void main(){
        gl_Position = a_Position;
        gl_PointSize = 10.0;
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

    var gl = getWebGLContext(canvas);
    if(!gl){
        console.log("Failed to get the rendering context for WebGL");
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Failed to initialize shaders.");
        return;
    }

    //获取attribute变量的存储位置
    var a_Position = gl.getActiveAttrib(gl.program, "a_Position");
    if (a_Position < 0) {
        console.log("Failed to get the storage location of a_Position");
        return;
    }

    //将顶点位置传输给attribute变量
    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 1);
}
```

关键词`attribute`被称为存储限定符，它表示接下来的变量是一个attribute变量。

attribute变量必须声明为全局变量。

变量的声明格式：

> < 存储限定符 > < 类型 > < 变量名 >

我们在使用`initShaders()`在WebGL系统中建立顶点着色器后，WebGL会对着色器进行解析，辨识出着色器具有的attribute变量，每个变量都有一个存储地址，以便外部通过存储地址向变量传输数据。

向WebGL系统请求这个存储地址，需使用`gl.getAttributeLocation()`来获取attribute变量的地址。

```javascript
gl.getAttributeLocation(program, name)
//获取由name参数指定的attribute变量的存储地址

//program指定包含顶点着色器和片元着色器的着色器程序对象

//name指定想要获取其存储地址的attribute变量的名称

//返回attribute变量的存储地址(值大于等于0)
//返回-1则表示指定的attribute变量不存在，或者命名具有gl_或webgl_前缀
```



#### uniform变量

