'use strict';

const express = require('express');
const app = express();

app.set('view engine', 'pug');

app.use(express.static("./static"));

app.get('/', (req, res) => {
	// passing environment for automated deployment selector
    if(process.env.ENV_APP_ENGINE == "appengine") {
    	res.status(200)
	    res.render('index', { 
	    	env: 'appengine' 
	   	});
    }else{
    	res.status(200)
    	res.render('index', { 
	    	env: 'localhost' 
	   	});
    }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;

