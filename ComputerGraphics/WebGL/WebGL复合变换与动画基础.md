# WebGL复合变换与动画基础



## 复合变换

**例子**：先平移再旋转

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>Rotated Translated Triangle</title>
    </head>
    <body onload="main()">
        <canvas id="example" width="500" height="500">
            Please use a browser that supports canvas
        </canvas>
        <script src="../lib/webgl-utils.js"></script>
        <script src="../lib/webgl-debug.js"></script>
        <script src="../lib/cuon-utils.js"></script>
        <script src="../lib/cuon-matrix.js"></script>
        <script src="RotatedTranslatedTriangle.js"></script>
    </body>
</html>
```

```js
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    void main(){
        gl_Position = u_ModelMatrix * a_Position;
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
        console.log("Fail to retrieve the < canvas > element");
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
    //设置顶点位置
    var vertexCount = initVertexBuffers(glContext);
    if (vertexCount < 0){
        console.log("Failed to set the positions of the vertices.");
        return;
    }
    var angle = 60;//旋转角度
    var modelMatrix = (new Matrix4()).setTranslate(0.25,0.4,0.0);//初始化一个平移矩阵
    modelMatrix.rotate(angle,0.0,0.0,1.0);//平移之后进行旋转操作

    var u_ModelMatrix = glContext.getUniformLocation(glContext.program ,"u_ModelMatrix");
    glContext.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);//将先平移再旋转的结果传入u_ModelMatrix

    glContext.clearColor(0.0, 0.0, 0.0, 1.0);
    glContext.clear(glContext.COLOR_BUFFER_BIT);

    glContext.drawArrays(glContext.TRIANGLES, 0, vertexCount);
}

function initVertexBuffers(glContext){
    var vertices = new Float32Array([
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5,
    ]);
    var vertexCount = vertices.length / 2;
    //创建缓冲区对象
    var vertexBuffer = glContext.createBuffer();
    if (!vertexBuffer){
        console.log("Failed to create the vertex buffer object.");
        return -1;
    }
    //绑定缓冲区对象
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBuffer);
    //向缓冲区写入节点数据
    glContext.bufferData(glContext.ARRAY_BUFFER, vertices, glContext.STATIC_DRAW);
    //获取attribute变量的存储位置
    var a_Position = glContext.getAttribLocation(glContext.program, "a_Position");
    if (a_Position < 0) {
        console.log("Failed to get the storage location of a_Position");
        return;
    }
    //将缓冲区分配给a_Position
    glContext.vertexAttribPointer(a_Position, 2,glContext.FLOAT,false,0,0);
    //激活缓冲区
    glContext.enableVertexAttribArray(a_Position);
    return vertexCount;
}
```



## 动画基础

为了让三角形转动起来，我们需要**不断擦除和重绘**三角形，并再每次重绘时轻微地改变其角度。

在绘制之前，我们需要调用`gl.clear()`，这对2D图形和3D对象都适用。

**例子**：持续转动的三角形

```js
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    void main(){
        gl_Position = u_ModelMatrix * a_Position;
    }
`
var FSHADER_SOURCE = `
    void main(){
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`

var ANGLE_STEP = 60;

function main(){
    var canvas = document.getElementById("example");
    if(!canvas){
        console.log("Fail to retrieve the < canvas > element");
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
    //设置顶点位置
    var vertexCount = initVertexBuffers(glContext);
    if (vertexCount < 0){
        console.log("Failed to set the positions of the vertices.");
        return;
    }
    var modelMatrix = new Matrix4();
    var u_ModelMatrix = glContext.getUniformLocation(glContext.program ,"u_ModelMatrix");

    glContext.clearColor(0.0, 0.0, 0.0, 1.0);
    glContext.clear(glContext.COLOR_BUFFER_BIT);

    var currentAngle = 0.0;//初始角度
    var tick = function (){
        currentAngle = animate(currentAngle);//更新角度
        draw(glContext, vertexCount, u_ModelMatrix, modelMatrix, currentAngle);//重新绘制图形
        requestAnimationFrame(tick);//向浏览器请求调用tick函数
    };
    tick();//首次调用tick
}

function initVertexBuffers(glContext){
    var vertices = new Float32Array([
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5,
    ]);
    var vertexCount = vertices.length / 2;
    //创建缓冲区对象
    var vertexBuffer = glContext.createBuffer();
    if (!vertexBuffer){
        console.log("Failed to create the vertex buffer object.");
        return -1;
    }
    //绑定缓冲区对象
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBuffer);
    //向缓冲区写入节点数据
    glContext.bufferData(glContext.ARRAY_BUFFER, vertices, glContext.STATIC_DRAW);
    //获取attribute变量的存储位置
    var a_Position = glContext.getAttribLocation(glContext.program, "a_Position");
    if (a_Position < 0) {
        console.log("Failed to get the storage location of a_Position");
        return;
    }
    //将缓冲区分配给a_Position
    glContext.vertexAttribPointer(a_Position, 2,glContext.FLOAT,false,0,0);
    //激活缓冲区
    glContext.enableVertexAttribArray(a_Position);
    return vertexCount;
}

var g_lastTime = Date.now();
function animate(angle){
    var now =  Date.now();
    var deltaTime = now - g_lastTime;//帧间隔时间，单位毫秒
    g_lastTime = now;

    var newAngle = angle + ANGLE_STEP / 1000.0 * deltaTime;//每毫秒的新角度

    return newAngle %= 360;
}

function draw(glContext, vertexCount, u_ModelMatrix, modelMatrix, angle){
    modelMatrix.setRotate(angle,0.0,0.0,1.0);
    glContext.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    glContext.clear(glContext.COLOR_BUFFER_BIT);
    glContext.drawArrays(glContext.TRIANGLES, 0, vertexCount);
}
```

`requestAnimationFrame()`函数的作用：对浏览器发出一次请求，请求在未来某个适当的时机调用作为第一个参数的函数。

### 请求再次被调用函数

传统习惯上，你如果向要JS重复执行某个特定的任务（函数），你可以适用`setInterval()`函数。

```js
setInterval(func, delay)
//每隔delay时间间隔，调用func函数
/*
参数func: 指定需要多次调用的函数
参数delay: 指定时间间隔（单位：毫秒）

返回值Time id
*/
```

现代浏览器都支持多个标签页，每个标签页具有单独的JS运行环境，但`setInterval()`不论标签也是否被激活，都会反复调用`func`，如果标签页过多，就会增加浏览器的负荷。

后来。浏览器引入了`requestAnimation()`方法，给方法只有当标签页处于激活状态时才会生效。

```js
requestAnimationFrame(func)
//请求浏览器在将来某个时刻回调函数func以完成重绘。我们应当在回调函数最后再次发起该请求。
/*
参数func: 指定竟来某时刻调用的函数。函数将会接收到一个time参数，用来表明此次调用的时间戳。

返回值Request id
*/
```

使用整个函数的好处时**可以避免在未激活的标签页上运行动画**。

注意，你无法指定重复调用的间隔；函数func（第1个参数）会在浏览器需要网页的某个元素（第2个参数）重绘时被调用。

**在浏览器成功找到适当的时机调用了一次func后，想要再次调用它，就必须再次发起请求**，因为前一次请求已经结束（即`requestAnimationFrame`更像`setTimeOut`而不是`setTimeInterval`，不会因为发起一次请求，就会不停地循环调用func）。此外，在调用函数后，你需要发出下次调用的请求，因为**上一次关于调用的请求在调用完成之后就及结束了使命**。

如果想取消请求，需要使用`cancelAnimationFrame()`

```js
cancelAnimationFrame(requestID)
//取消由requestAnimationFrame()发起的请求。
/*
参数requestID: 指定requestAnimationFrame()的返回值

无返回值
*/
```

