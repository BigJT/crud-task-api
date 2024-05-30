const express = require('express');
const app = express();

const mongoose = require('./database/mongoose');

/*app.listen(3000, function(){
	console.log('server is running on port 3000');
});*/

app.listen(3000, () => {
	console.log('server is running on port 3000');
});