var VSHADER_SOURCE = `
    void main(){
        gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
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
    glContext.drawArrays(glContext.POINTS, 0, 1);
}