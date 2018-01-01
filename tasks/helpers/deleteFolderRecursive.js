var fs = require('fs');
var path = require('path');

var deleteFolderRecursive = function(path) {
  if (path.indexOf("./") !== 0) {
    throw new Error("unsafe path passed to `deleteFolderRecursive`. Exiting");
    return
  }
  return;
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

module.exports = deleteFolderRecursive;