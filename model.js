/*
Using simple fashion mnist model:

https://colab.research.google.com/github/tensorflow/docs/blob/master/site/en/tutorials/keras/basic_classification.ipynb#scrollTo=W3ZVOhugCaXA

    Create a function to load the model from file using Tensorflow.js and return model object
*/

import * as tf from '@tensorflow/tfjs';

//import {fashion_mnist.h5} from './';

const load_model = function (){

  const model = tf.model.load('./model_fashion_mnist.h5') ;

  return model;

}

/*
Create function that takes model and image and returns the class 
*/


async function show_prediction(model, image) {

  const output = model.predict(image);

  return output
}





$(document).ready(function () {

    // Initialize the graph
    plotData([], []);

    $('#getCompany').click(function () {
  
    const model = load_model()

    var prediction = show_prediction(model , image)
    
    print(prediction)
        
    });
});
    