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

    var vertexCount = initVertexBuffers(glContext);
    if (vertexCount < 0){
        console.log("Failed to set the positions of the vertices.");
        return;
    }

    glContext.clearColor(0.0, 0.0, 0.0, 1.0);
    glContext.clear(glContext.COLOR_BUFFER_BIT);

    glContext.drawArrays(glContext.POINTS, 0, vertexCount);
}

function initVertexBuffers(glContext){
    var vertices = new Float32Array([
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ]);
    var sizes = new Float32Array([
        10.0, 20.0, 30.0
    ]);

    var vertexCount = vertices.length / 2;
    //创建缓冲区对象
    var vertexBuffer = glContext.createBuffer();
    var sizeBuffer = glContext.createBuffer();

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

    //将顶点尺寸写入缓冲区对象并开始
    glContext.bindBuffer(glContext.ARRAY_BUFFER, sizeBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, sizes, glContext.STATIC_DRAW);
    var a_PointSize = glContext.getAttribLocation(glContext.program, "a_PointSize");
    if (a_PointSize < 0) {
        console.log("Failed to get the storage location of a_PointSize");
        return;
    }
    //将缓冲区分配给a_PointSize
    glContext.vertexAttribPointer(a_PointSize, 1, glContext.FLOAT, false, 0, 0);
    //激活缓冲区
    glContext.enableVertexAttribArray(a_PointSize);

    return vertexCount;
}