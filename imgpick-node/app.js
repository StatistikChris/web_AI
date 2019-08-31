'use strict';
//import * from 'server/server.js'
const server = require('./server/server.js');

const express = require('express');
const app = express();

app.set('view engine', 'pug');


app.get('/', (req, res) => {
  res
    .status(200)
    //.send('<h2>Upload an Image</h2>')
    .render('index', { 
    	title: 'Upload an Image' 
   	});
    //.sendFile('/home/lenny/Documents/imgpick-node/index.html')
    //.end();
});

app.post('/', (req, res) => {
  handlePostRequest(req);
  res
    .status(200)
    //.send('<h2>Upload an Image</h2>')
    .render('index', { 
      title: 'Upload an Image' 
    });
    //.sendFile('/home/lenny/Documents/imgpick-node/index.html')
    //.end();
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;
