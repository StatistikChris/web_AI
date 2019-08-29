$("#image-selector").change(function () {
    let reader = new FileReader();
    reader.onload = function () {
        let dataURL = reader.result;
        $("#selected-image").attr("src", dataURL);
        $("#prediction-list").empty();
    }
    let file = $("#image-selector").prop("files")[0];
    reader.readAsDataURL(file);
}); 

let model;
(async function () {
    model = await tf.loadLayersModel("http://localhost:8080/tfjs-models/mnist/model.json");
    $(".progress-bar").hide();
})();


$("#predict-button").click(async function () {
  let image = $("#selected-image").get(0);
  let tensor = tf.browser.fromPixels(image, numChannels=1)
      .resizeNearestNeighbor([28, 28])
      .toFloat()
      .expandDims();

  // More pre-processing to be added here later
  
  
  let predictions = await model.predict(tensor).data();
  //let top5 = Array.from(predictions)
  //    .map(function (p, i) {
  //        return {
  //            probability: p,
  //            className: IMAGENET_CLASSES[i]
  //        };
  //    }).sort(function (a, b) {
  //        return b.probability - a.probability;
  //    }).slice(0, 5);
  //    
      
  


  $("#prediction-list").empty();
  predictions.forEach(function (p) {
      $("#prediction-list").append(`<li>${p}</li>`);
  //$("#prediction-list").append(`<li> ${predictions} </li>`);
  
  });

});

