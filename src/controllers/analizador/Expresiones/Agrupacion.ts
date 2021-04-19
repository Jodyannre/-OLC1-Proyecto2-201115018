import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo from "../tablaSimbolos/Tipo";
import Excepcion from "../Excepciones/Excepcion";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
import Simbolo from "../tablaSimbolos/Simbolo";
import Primitivo from "./Primitivo";

const primitivo = require('../Expresiones/Primitivo');
const tipo = require('../tablaSimbolos/Tipo');

export default class Agrupacion extends Instruccion{



    private operacion:any;



    public getNodoInstruccion():nodoInstruccion{
        let nodo:nodoInstruccion = new nodoInstruccion('ARITMÉTICA');

        return nodo;
    }



    constructor(tipo:Tipo, linea:Number, columna:Number,operacion:any) {
        super(tipo, linea, columna);
        if (operacion != null){
            this.operacion = operacion;
        }

    }


    public interpretar(tree:Arbol, table:tablaSimbolos):any{

    }


    public getTipoResultado(tree:Arbol, table:tablaSimbolos){
        var resultado = this.interpretar(tree,table);
        if (resultado instanceof Excepcion){
            return Excepcion;
        }else
        if (typeof resultado === 'number'){
            if (resultado % 1 === 0){
                return tipo.tipos.ENTERO;
            }else{
                return tipo.tipos.DECIMAL;
            }
        }else
        if (typeof resultado === 'string'){
            if (resultado.length === 1){
                return tipo.tipos.CARACTER;
            }else{
                return tipo.tipos.CADENA;
            }
        }
        else
        if (typeof resultado === 'boolean'){
            return tipo.tipos.BOOLEANO;
        }
    }
}
