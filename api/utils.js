var fs = require('fs'),
    path = require('path');

module.exports.readdirRecursiveSync = function(directory) {
    var result = [];
    readdir(directory);
    return result;

    function readdir(current) {
        var files = fs.readdirSync(current);

        files.forEach(function(file) {
            var absViam = path.resolve(current, file),
                stat = fs.statSync(absViam);

            if (stat.isFile()) {
                result.push(path.relative(directory, absViam));
            }

            if (stat.isDirectory()) {
                readdir(absViam);
            }
        })
    }
};

module.exports.moveArray = function(arr, old_index, new_index){
    if(new_index > arr.length-1) return arr;
    while (old_index < 0) {
        old_index += arr.length;
    }
    while (new_index < 0) {
        new_index += arr.length;
    }
    if (new_index >= arr.length) {
        var k = new_index - arr.length;
        while ((k--) + 1) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; 
}