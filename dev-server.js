var express = require('express');
var devServer = express();

devServer.use(express.static('./dist'));

var server = devServer.listen(8008);
console.log('Server running at http://localhost:8008');