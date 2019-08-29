console.log('PUG include works');

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
  post('https://europe-west1-chris-weather-app-1.cloudfunctions.net/mnist-prediction', {name: 'Johnny Bravo'});
  console.log("ok");
}

document.getElementById('imgupload').addEventListener('click', handleUpload, false);
