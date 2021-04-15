import {Router} from 'express';

var path = require("path");

const router:Router = Router();

import {controller} from '../controllers/typesty.controller'; //Traer otras clases
import {prove} from '../controllers/middleware'; //Traer la clase que va a analizar la entrada

let rutaRaw = path.join(__dirname); //Ruta total cruda
let ruta = ""; //Variable para guardar la ruta correta


//Método get para traer la página principal
ruta = rutaRaw.substring(0,(rutaRaw.length-7))+ '/pagina/html/index.html';
router.get('/',(req,res)=>{
    res.sendFile(path.join(ruta));
});

//Instrucción put para el botón parse
router.put('/parse',controller.interpretar);

//Intrucción para traer el resultado hacia la consola de la página
router.get('/getConsola', (req,res)=>{
    res.send("hola");
});

export default router;
