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