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

function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object
  var f;
  var output = [];

  if (files.length == 1) {
    f = files[0];
    output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
      f.size, ' bytes, last modified: ',
      f.lastModifiedDate.toLocaleDateString(), '</li>');
    console.log('successfully loaded file:');
    console.log(f);
  }else{
    console.err('Error: could not load file');
    return;
  }

  document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}


// load_model();
document.getElementById('files').addEventListener('change', handleFileSelect, false);
