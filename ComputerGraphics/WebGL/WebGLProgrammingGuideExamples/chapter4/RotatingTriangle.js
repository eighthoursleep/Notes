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
        requestAnimationFrame(tick);//像浏览器请求每帧调用tick函数
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
    modelMatrix.setRotate(angle, 0.0, 0.0, 1.0);
    modelMatrix.translate(0.35, 0.0, 0.0);
    glContext.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    glContext.clear(glContext.COLOR_BUFFER_BIT);
    glContext.drawArrays(glContext.TRIANGLES, 0, vertexCount);
}