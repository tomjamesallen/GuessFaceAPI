var express = require('express');
var devServer = express();
var path = require('path')

devServer.use(express.static('./dist'));

devServer.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

var server = devServer.listen(8765);
console.log('Server running at http://localhost:8765');