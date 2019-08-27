var mousePressed = false;
var lastX, lastY;
var ctx;

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
    document.getElementById('inferInput').addEventListener('cick', inferInput, false);
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
}
	
function clearArea() {
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function inferInput() {
    clearPrint();
    print("# --- Building Inference ---");
    print("# --- reseizing image...");
    var newImg = resizeImage("myCanvas")
    print(newImg)
    print("# --- formating image...");
    var arrayImg = formatImage(newImg);
    print(arrayImg)
}   

/*
    Add text in the html view
*/
const print = function (text) {
    let el = document.getElementsByClassName('output')[0];
    let elem = document.createElement('p');
    elem.innerHTML = text;
    el.append(elem);
    el.append(document.createElement('br'))
    console.log(text)
};
/*
    Clear the html view
*/
const clearPrint = function () {
    let el = document.getElementsByClassName('output')[0];
    el.innerHTML = "";
}

const resizeImage = function(canvasId,dimension=28) {
    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext("2d");
    var imgData = context.getImageData(0, 0, canvas.width, canvas.height);

    var i;
    //var step = canvas.width % dimension
    var newImageData = ctx.createImageData(dimension, dimension);
    console.log("imgData.data[i] > " + imgData.data.length)
    for (i = 0; i < imgData.data.length%dimension; i += 4) {
        // copy RGBA channels of the pixel
        //if (imgData.data[i+2] > 0) {
        console.log("imgData.data[i] > " + imgData.data[i])
        //}
        newImageData.data[i] = imgData.data[i];
        newImageData.data[i+1] = imgData.data[i+1];
        newImageData.data[i+2] = imgData.data[i+2];
        newImageData.data[i+3] = imgData.data[i+3];
    }
    //ctx.putImageData(imgData, 0, 0)
    return newImageData;
}
/*

*/
const formatImage = function(imgData,dimension=28) {
    var i;
    var imgArray = new Array();
    var imgSubArray = new Array();
    for (i = 0; i < imgData.data.length; i += 4) {
        if (i % (dimension*4) == 0) {
            // push pixel row and create new array object
            //console.log("imgData.data.length % dimension == " + i)
            imgArray.push(imgSubArray);
            imgSubArray = new Array();
        }
        
        // detect pixels
        if (imgData.data[i] > 0) {
            imgSubArray.push(1);
        }else{
            imgSubArray.push(0);
        }
    
    }
    return imgArray
}

