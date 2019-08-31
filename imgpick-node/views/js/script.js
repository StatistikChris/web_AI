function post(path, params, method='post') {

  // The rest of this code assumes you are not using a library.
  // It can be made less wordy if you use one.
  const form = document.createElement('form');
  form.method = method;
  form.action = path;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = key;
      hiddenField.value = params[key];

      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
}

function handleUpload(evt) {
  console.log("Trying to post image to cloud functions API");
  //post('https://europe-west1-chris-weather-app-1.cloudfunctions.net/mnist-prediction', {name: 'Johnny Bravo'});
  var img = document.getElementById("preview-canvas");
  post('https://localhost:8080/', {
        type: 'image/png',
        data: img.dataToUrl()});
  console.log("ok");
}

const showPreview = function () {
    logPrint("# [INFO]: file picked\n");
    logPrint("# [INFO]: showing preview\n");
    var canvas = document.getElementById("preview-canvas");
    //var data = canvas.toDataURL("image/png");

    var image = new Image();
    image.id = "preview-pic";
    image.width = 70;
    image.src = canvas.toDataURL();
    document.getElementById('preview').appendChild(image);
}

const logPrint = function(text) {
    $('#logging-area').append(text);
}

function startup() {
  //document.getElementById('imgpick').addEventListener('change', showPreview, false);
  document.getElementById('imgupload').addEventListener('click', handleUpload, false);
}
