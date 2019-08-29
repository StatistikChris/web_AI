/*
    canvas.js
*/
var mousePressed = false;
var lastX, lastY;
var ctx;

// load model on starup
let model;
(async function () {
    model = await tf.loadLayersModel("http://localhost:8080/tfjs-models/mnist/model.json");
    logPrint("# [INFO]: Loading Tensoflow Model ...");
    logPrint("\n# [INFO]: done");
    //$(".progress-bar").hide();
})();


function startup() {
    ctx = document.getElementById('myCanvas').getContext("2d");

    $('#myCanvas').mousedown(function (e) {
        mousePressed = true;
        Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
    });

    $('#myCanvas').mousemove(function (e) {
        if (mousePressed) {
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
        }
    });

    $('#myCanvas').mouseup(function (e) {
        mousePressed = false;
    });
	    $('#myCanvas').mouseleave(function (e) {
        mousePressed = false;
    });

    // add event listener to button:
    document.getElementById('prepareInput').addEventListener('cick', prepareInput, false);
    document.getElementById('buildInference').addEventListener('cick', buildInference, false);
}

function Draw(x, y, isDown) {
    //console.log(x,y)
    if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = $('#selColor').val();
        ctx.lineWidth = $('#selWidth').val();
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }
    lastX = x; lastY = y;
    //console.log("x,y " + x + ", " + y)
}
	
function clearArea() {
    logPrint("\n# [INFO]: clearing draw area");
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

const showPreview = function(canvasId) {
    logPrint("\n# [INFO]: showing preview");
    var canvas = document.getElementById(canvasId);
    var data = canvas.toDataURL("image/png");

    var image = new Image();
    image.id = "preview-pic";
    image.width = 70;
    image.src = canvas.toDataURL();
    document.getElementById('preview').appendChild(image);
}

function prepareInput() {
    logPrint("\n# [INFO]: reseizing image...");
    var newImg = format("myCanvas");
}   

const logPrint = function(text) {
    $('#logging-area').append(text);
}

const rescaleImage = function(canvasId,dimension=28) {
    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext("2d");
    var scaleFactor =  dimension / canvas.width;
    console.log("scale factor: " + scaleFactor);
    context.scale(scaleFactor, scaleFactor);
    return context.getImageData(0, 0, canvas.width*scaleFactor, canvas.height*scaleFactor);
}

function resizeTo(canvas,pct){

}

function buildInference() {
    // just log here and call async function
    logPrint("\n# [INFO]: building inference...");
    infer();
}

async function infer() {
    var canvas = document.getElementById("preview-pic");
    var imgData = new Image()
    imgData.src = canvas.src;
    let image = imgData;
    let tensor = tf.browser.fromPixels(image,numChannels=1)
                  .resizeNearestNeighbor([28, 28])
                  .toFloat()
                  .expandDims();

    let predictions = await model.predict(tensor).data();

    $("#prediction-list").empty();
    predictions.forEach(function (p) {
        $("#prediction-list").append(`<li>${p}</li>`);
    });
    logPrint("\n# [INFO]: done");
}

const format = function(canvasId) {
    var dimension = 28;
    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext("2d");

    console.log("old image context: \n" + context.getImageData(0, 0, canvas.width, canvas.height));

    var tempCanvas = document.createElement("canvas");
    var tmptContext = tempCanvas.getContext("2d");
    
    var pct = dimension / canvas.width; // e.g. 28 / 280 = 0.1 scale factor
    var cw=canvas.width;
    var ch=canvas.height;
    tempCanvas.width=cw;
    tempCanvas.height=ch;

    //tmptContext.drawImage(canvas,0,0);
    
    tempCanvas.width*=pct;
    tempCanvas.height*=pct;


    logPrint("\n# [INFO]: formatting image...");
    context.drawImage(tempCanvas,0,0,cw,ch,0,0,cw*pct,ch*pct);
    var newCanvas = document.createElement("canvas");
    var newContext = newCanvas.getContext("2d");
    newContext.drawImage(tempCanvas,0,0,cw,ch,0,0,cw*pct,ch*pct);

    showPreview(canvasId);
}

