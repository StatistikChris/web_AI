// import * as tf from '@tensorflow/tfjs';

async function load_model() {
  // const model = tf.model.load('./model_fashion_mnist.h5');
  console.log("Loading tf model...")
  const model = await tf.loadLayersModel('https://github.com/StatistikChris/portfolio/blob/master/model_fashion_mnist.h5?raw=true');
  console.log("Model successfully loaded.")
  return model;
}

/*
Create function that takes model and image and returns the class
*/
async function show_prediction(model, image) {
  const output = model.predict(image);
  return output
}

function resizeImage(image) {
  // var filesToUpload = document.getElementById('imageFile').files;
  // var file = filesToUpload[0];
  var file = image;

  // Create an image
  var img = document.createElement("img");
  // Create a file reader
  var reader = new FileReader();
  // Set the image once loaded into file reader
  reader.onload = function(e) {
    img.src = e.target.result;

    var canvas = document.createElement("canvas");
    //var canvas = $("<canvas>", {"id":"testing"})[0];
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var MAX_WIDTH = 400;
    var MAX_HEIGHT = 400;
    var width = img.width;
    var height = img.height;

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    var dataurl = canvas.toDataURL("image/png");
    document.getElementById('output').src = dataurl;
  }
  // Load files into file reader
  reader.readAsDataURL(file);


}

function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object

  // check read files + debug output
  var file;
  if (files.length == 1) {
    file = files[0];
    console.log('successfully loaded file:');
    console.log(file);
  } else {
    console.log('Error: could not load file');
    return;
  }

  // resize f
  // resizeImage(file);

  // Create an image
  var img = document.createElement("img");
  // Create a file reader
  var reader = new FileReader();
  // Set the image once loaded into file reader

  var canvas = document.createElement("canvas");
  //var canvas = $("<canvas>", {"id":"testing"})[0];
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, 100, 100);

  var dataurl = canvas.toDataURL("image/png");
  // document.getElementById('output').src = dataurl;

  // Load files into file reader
  reader.readAsDataURL(file);



  var output = [];
  output.push('<li><strong>', escape(file.name), '</strong> (', file.type || 'n/a', ') - ',
    file.size, ' bytes, last modified: ',
    file.lastModifiedDate.toLocaleDateString(), '</li>');

  document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}


// load_model();
document.getElementById('files').addEventListener('change', handleFileSelect, false);
