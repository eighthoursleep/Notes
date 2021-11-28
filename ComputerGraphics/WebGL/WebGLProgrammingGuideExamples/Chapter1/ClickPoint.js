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