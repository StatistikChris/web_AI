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
    //$(".progress-bar").hide();
    logPrint("# --- Loading Tensoflow Model ...");
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
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

const showPreview = function(canvasId) {
    logPrint("\n# --- showing preview:");
    var canvas = document.getElementById(canvasId);
    var data = canvas.toDataURL("image/png");

    var image = new Image();
    image.id = "preview-pic";
    image.width = 70;
    image.src = canvas.toDataURL();
    document.getElementById('preview').appendChild(image);
}

function prepareInput() {
    clearPrint();
    //logPrint("# --- Building Inference ---");
    logPrint("# --- reseizing image...");
    //var newImg = rescaleImage("myCanvas")
    //var newImg = resizeImage2("myCanvas")
    logPrint("\n# --- formatting image...");
    var newImg = format2("myCanvas");
    //print(newImg);
    
    //print("# --- formating image...");
    //var arrayImg = formatImage(newImg);
    //print(arrayImg)
}   

const logPrint = function(text) {
    $('#logging-area').append(text);
}

/*
    Add text in the html view
*/
const print = function (text) {
    let el = document.getElementsByClassName('output')[0];
    let elem = document.createElement('p');
    elem.innerHTML = text;
    el.append(elem);
    //el.append(document.createElement('br'))
    console.log(text)
};
/*
    Clear the html view
*/
const clearPrint = function () {
    let el = document.getElementsByClassName('output')[0];
    el.innerHTML = "";
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

const buildInference =  function() {
    //
    logPrint("\n# --- Building Inference ---")
    // sendRequest();
    infer();
}

async function infer() {
    //let image = $("#selected-image").get(0);
    const canvas = document.getElementById("preview-pic");
    //const ctx = canvas.getContext('2d');

    //var imgData = canvas.src;
    //console.log(canvas.toDataURL("image/png"));

    var imgData = new Image()
    //ctx.drawImage(img, 0, 0);
    imgData.src = canvas.src;
    //image = tf.fromPixels(canvas);





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
}

const format2 = function(canvasId) {
    var dimension = 28;
    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext("2d");

    console.log("old image context: \n" + context.getImageData(0, 0, canvas.width, canvas.height));
    //var myCanvas=document.getElementById("canvas");
    //var ctx=myCanvas.getContext("2d");
    //var cw=canvas.width;
    //var ch=canvas.height;
    var tempCanvas = document.createElement("canvas");
    var tmptContext = tempCanvas.getContext("2d");
    
    var pct = dimension / canvas.width; // e.g. 28 / 280 = 0.1 scale factor
    var cw=canvas.width;
    var ch=canvas.height;
    tempCanvas.width=cw;
    tempCanvas.height=ch;
    tmptContext.drawImage(canvas,0,0);
    canvas.width*=pct;
    canvas.height*=pct;



    context.drawImage(tempCanvas,0,0,cw,ch,0,0,cw*pct,ch*pct);
    var newCanvas = document.createElement("canvas");
    var newContext = newCanvas.getContext("2d");
    newContext.drawImage(tempCanvas,0,0,cw,ch,0,0,cw*pct,ch*pct);

    showPreview(canvasId);

/*    
    // format
    var imgData = newContext.getImageData(0, 0, newCanvas.width, newCanvas.height);
    console.log("new image context: \n" + imgData.length);
    var imgArray = new Array();
    var imgSubArray = new Array();
    for(var i=0;i<imgData.length;i+=4) {
            if ((i%(dimension*4))  == 0) {
            // end of row: push pixel row and create new array object
            //console.log("imgData.data.length % dimension == " + i)
            imgArray.push(imgSubArray);
            imgSubArray = new Array();
            // jump rows in y axe
            //i += canvas.width*4*(stepLength);
        }
        
        // detect pixels
        if (imgData.data[stepLength*i+3] > 0) {
            imgSubArray.push(1);
        }else{
            imgSubArray.push(0);
        }
    }
    return imgArray;
    */
}

