# WebGL入门

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
    </body>
    </body>
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
//参数buffer指定待清空的缓冲区，位运算操作符“或”（|）可用来指定多个缓冲区
//它的值如下：
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

### 从绘制一个点认识着色器

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
    </body>
    </body>
    </body>
</html>
```

HelloPoint.js

```javascript
var VSHADER_SOURCE = `
    void main(){
        gl_Position = vec4(0.0, 0.0, 0.0, 1.0);//顶点位置指定为(0.0, 0.0, 0.0)
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
    //获取WebGL绘图区域
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
    //指定清空canvas的填充色
    glContext.clearColor(0.0, 0.0, 0.0, 1.0);
    //清空canvas
    glContext.clear(glContext.COLOR_BUFFER_BIT);
    //绘制一个点
    glContext.drawArrays(glContext.POINT, 0, 1);//从第0个点开始绘制，绘制一个点
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

initShader

