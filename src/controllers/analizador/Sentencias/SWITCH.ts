import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo from "../tablaSimbolos/Tipo";
import Excepcion from "../Excepciones/Excepcion";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
import Relacional from "../Expresiones/Relacional";
import Logica from "../Expresiones/Logica";
import Identificador from "../Expresiones/Identificador";
import CASE from "./CASE";
var Errors:Array<Excepcion> = new Array<Excepcion>();

const tipo = require('../tablaSimbolos/Tipo');

export default class SWITCH extends Instruccion{
    private condicion:any;
    private casos:any;



    public getNodoInstruccion(){
        let nodo:nodoInstruccion = new nodoInstruccion("INSTRUCCION");
        let nodo2:nodoInstruccion = new nodoInstruccion("SENTENCIA_SWITCH");
        let nodo3:nodoInstruccion = new nodoInstruccion("CONDICION");
        let nodo4:nodoInstruccion = new nodoInstruccion("INSTRUCCION");
        let temp:any;
        if (this.tipo.getTipos()==55){
            nodo2.agregarHijoCadena("SWITCH");
            nodo2.agregarHijoCadena("(");
            nodo3.agregarHijoNodo(this.condicion.getNodoInstruccion());
            nodo2.agregarHijoNodo(nodo3);
            nodo2.agregarHijoCadena(")");
            nodo2.agregarHijoCadena("{");
            if (this.casos!=null){
                for (let instruccion of this.casos){
                    temp = instruccion;
                    nodo4.agregarHijoNodo(temp.getNodoInstruccion());
                }
                nodo2.agregarHijoNodo(nodo4);
            }
            nodo2.agregarHijoCadena("}");
            nodo.agregarHijoNodo(nodo2);
        }         
        return nodo;
    }


    constructor(tipo:Tipo, linea:Number, columna:Number, condicion:any,casos:any) {
        super(tipo, linea, columna);
        this.condicion = condicion;
        if (casos !=null){
            this.casos = new Array();
            while (casos.length>0){
                this.casos.push(casos.shift());
            }
            casos = [];
        }else{
            this.casos = null;
        }
    }


    public interpretar(tree:Arbol, table:tablaSimbolos){
        if (this.pasada<2){
            return true;
        }
        //Verificar el tipo de condición y que los cases tengan ese mismo tipo

    }
}
