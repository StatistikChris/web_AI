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
    print("# --- Building Inference ---")
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
