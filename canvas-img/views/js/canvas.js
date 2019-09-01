/*
    canvas.js
*/

var mousePressed = false;
var lastX, lastY;
var ctx;

const logPrint = function(text) {
    if ($('#logging-area').val() == "") {
        $('#logging-area').append(text);
    }else{
        $('#logging-area').append("\n" + text);
    }
    $('#logging-area').scrollTop($('#logging-area')[0].scrollHeight);
}

// load model on starup
let model;
async function loadModel() {
    try {
        // ### handling environment here vvvvvvvvvvvvvvv
        logPrint("# [INFO]: Loading Tensoflow Model ...");
        if ($('#env').text() == "appengine") {
            // load model from here on app engine
            model = await tf.loadLayersModel("https://lsd-canvas-img.appspot.com/tfjs-models/mnist/model.json");
            logPrint("# [INFO]: successfully loaded model data");
        } else if($('#env').text() == "localhost") {
            // load model from here on localhost
            model = await tf.loadLayersModel("http://localhost:8080/tfjs-models/mnist/model.json");
            logPrint("# [INFO]: successfully loaded model data");
        } else {
            logPrint("# [ERROR]: failed to load Tensoflow model");
        }
        // ### ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    }catch{
        logPrint("# [ERROR]: failed to load Tensoflow model");
    }
}


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
    loadModel();
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
    logPrint("# [INFO]: clearing draw area");
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

const showPreview = function(canvasId) {
    logPrint("# [INFO]: showing preview");
    var canvas = document.getElementById(canvasId);
    var data;
    if (canvas.toDataURL("image/png") == null) {
        logPrint("# [ERROR]: failed to load canvas image")
    }else{
        data = canvas.toDataURL("image/png");
    }

    var image = new Image();
    image.id = "preview-pic";
    image.width = 70;
    image.src = canvas.toDataURL();
    document.getElementById('preview').appendChild(image);
}

function prepareInput() {
    logPrint("# [INFO]: reseizing image...");
    var newImg = format("myCanvas");
}   

/*
const rescaleImage = function(canvasId,dimension=28) {
    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext("2d");
    var scaleFactor =  dimension / canvas.width;
    console.log("scale factor: " + scaleFactor);
    context.scale(scaleFactor, scaleFactor);
    return context.getImageData(0, 0, canvas.width*scaleFactor, canvas.height*scaleFactor);
}
*/

function buildInference() {
    // just log here and call async function
    logPrint("# [INFO]: building inference...");
    infer();
}

async function infer() {
    var canvas = document.getElementById("preview-pic");
    if (canvas == null) {
        logPrint("# [ERROR]: failed to load model");
        logPrint("# [ERROR]: please check if image was prepared");
        return;
    }
    var imgData = new Image()
    imgData.src = canvas.src;
    let image = imgData;
    let tensor = tf.browser.fromPixels(image,numChannels=1)
                  .resizeNearestNeighbor([28, 28])
                  .toFloat()
                  .expandDims();

    let predictions = await model.predict(tensor).data();

    // collect top results
    var encoding = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //const predictions_copy = predictions.flatten();
    const values = tensor.dataSync();
    var predictions_copy = Array.from(predictions);
    
    // sort numbers numerically
    predictions_copy.sort(function(a, b){return a-b});

    for(var i = 0; i < 3; i++) {
        // get top 3 results
        var top_acc = predictions_copy.pop();
        var top_pos = predictions.indexOf(top_acc);
        var top_sgn = encoding.charAt(top_pos);
        console.log(top_acc);
        console.log(top_pos);
        console.log(top_sgn);
        $("#prediction-tops").append(`<h4>Found <b>'${top_sgn}'</b> with an accuracy of ${top_acc}</h4>`);
    }

    $("#prediction-title").append("<p>Complete Result:</p>");
    $("#prediction-list").empty();
    var i = 0;
    predictions.forEach(function (p) {
        $("#prediction-list").append(`<li><b>${encoding.charAt(i)}</b>: ${p}</li>`);
        i++;
    });
    logPrint("# [INFO]: done");
}

const format = function(canvasId) {
    var dimension = 28;
    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext("2d");

    var tempCanvas = document.createElement("canvas");
    var tmptContext = tempCanvas.getContext("2d");
    
    var pct = dimension / canvas.width; // e.g. 28 / 280 = 0.1 scale factor
    var cw=canvas.width;
    var ch=canvas.height;
    tempCanvas.width=cw;
    tempCanvas.height=ch;

    tempCanvas.width*=pct;
    tempCanvas.height*=pct;

    logPrint("# [INFO]: formatting image...");
    context.drawImage(tempCanvas,0,0,cw,ch,0,0,cw*pct,ch*pct);
    var newCanvas = document.createElement("canvas");
    var newContext = newCanvas.getContext("2d");
    newContext.drawImage(tempCanvas,0,0,cw,ch,0,0,cw*pct,ch*pct);

    showPreview(canvasId);
}

