

var fs = require('fs'); 
var parser = require('./gramatica');

fs.readFile('./src/controllers/analizador/gramatica/entrada.txt', (err, data) => {
    if (err) throw err;
    parser.parse(data.toString());
});