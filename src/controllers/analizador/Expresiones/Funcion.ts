import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo from "../tablaSimbolos/Tipo";
import Excepcion from "../Excepciones/Excepcion";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
import Relacional from "../Expresiones/Relacional";
import Logica from "../Expresiones/Logica";
import Identificador from "../Expresiones/Identificador";
import Primitivo from "../Expresiones/Primitivo";
var Errors:Array<Excepcion> = new Array<Excepcion>();

const tipo = require('../tablaSimbolos/Tipo');

export default class Metodo extends Instruccion{



    public getNodoInstruccion(){
        let nodo:nodoInstruccion = new nodoInstruccion("INSTRUCCION");
        let nodo2:nodoInstruccion = new nodoInstruccion("Metodo");
        if (this.tipo.getTipos()===60){
            nodo2.agregarHijoCadena("BREAK");
            nodo2.agregarHijoCadena(";");
        }     
        nodo.agregarHijoNodo(nodo2);    
        return nodo;
    }


    constructor(tipo:Tipo, linea:Number, columna:Number) {
        super(tipo, linea, columna);
    }


    public interpretar(tree:Arbol, table:tablaSimbolos){
        return this;
    }   

}
