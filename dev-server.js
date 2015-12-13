var express = require('express');
var devServer = express();

devServer.use(express.static('./dist'));

var server = devServer.listen(8765);
console.log('Server running at http://localhost:8765');