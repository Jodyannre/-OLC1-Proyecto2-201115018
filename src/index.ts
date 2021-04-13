import express from 'express';
import routeTypesty from './routes/typesty.route';
import cors from 'cors';

/*
const Excepcion = require('./controllers/analizador/Excepciones/Excepcion');
const Tipo = require('./controllers/analizador/tablaSimbolos/Tipo');
const Arbol = require('./controllers/analizador/tablaSimbolos/Arbol');
const Primitivo = require('./controllers/analizador/Expresiones/Primitivo');
const Imprimir = require('./controllers/analizador/Instrucciones/Imprimir');
const Aritmetico = require('./controllers/analizador/Expresiones/Aritmetica');


let numero1 = new Primitivo.default(new Tipo.default(Tipo.tipos.ENTERO),1,4,5);
let numero2 = new Primitivo.default(new Tipo.default(Tipo.tipos.ENTERO),4,4,5);
let operacion = new Aritmetico.default( numero1,numero2,new Tipo.default(Tipo.tipos.SUMA),1, 4);

console.log(operacion.getOperando());
*/

const app = express();
const path = require('path');
//const middleware = require('./src/controllers/middleware');

app.set('port', process.env.PORT || 3000);

app.use(cors());
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit:'50mb', extended: false}));

app.use(express.static(path.join(__dirname, 'public')));



/*
no = express.static(__dirname + '/public/images');
app.use("/images",no);
*/


var no = express.static(__dirname + '/public/css');
app.use("/css",no);

no = express.static(__dirname + '/public/javaScript');
app.use("/javascript",no);


app.use('/', routeTypesty);

app.get('**',(req,res)=>{
    res.send("Ruta inexistente");
})



app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});