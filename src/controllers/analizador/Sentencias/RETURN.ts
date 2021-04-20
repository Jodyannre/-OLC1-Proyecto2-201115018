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
import Primitivo from "../Expresiones/Primitivo";
var Errors:Array<Excepcion> = new Array<Excepcion>();

const tipo = require('../tablaSimbolos/Tipo');

export default class RETURN extends Instruccion{
    private retorno:any;
    private valor:any;
    private tipoRetorno:any;




    public getNodoInstruccion(){
        let nodo:nodoInstruccion = new nodoInstruccion("INSTRUCCION");
        let nodo2:nodoInstruccion = new nodoInstruccion("SENTENCIA_RETURN");
        let nodo4:nodoInstruccion = new nodoInstruccion("INSTRUCCION");
        if (this.tipo.getTipos()===61){
            nodo2.agregarHijoCadena("RETURN");
            if (this.retorno != null){
                nodo4.agregarHijoNodo(this.retorno.getNodoInstruccion());
            }
            nodo2.agregarHijoNodo(nodo4);
            nodo2.agregarHijoCadena(";");
        }     
        nodo.agregarHijoNodo(nodo2);    
        return nodo;
    }


    constructor(tipo:Tipo, linea:number, columna:number, retorno:any) {
        super(tipo, linea, columna);
        this.retorno = retorno;

    }


    public interpretar(tree:Arbol, table:tablaSimbolos){
        if (this.pasada<2){
            return true;
        }
        if (this.retorno === null){
            //No trae retorno
            this.valor = null;
            this.tipoRetorno = null;
            return this;
        }

        if (this.retorno instanceof Excepcion){
            return this.retorno;
        }

        this.retorno.setPasada(2);
        var resultado = this.retorno.interpretar(tree,table);
        if (resultado instanceof Excepcion){
            return resultado;
        }
        this.tipoRetorno = this.getTipoRetorno(resultado);
        this.valor = resultado;
        return this;
    }


    public getTipoRetorno(result:any){
        if (typeof result === 'string'){
            if (result.length>1){
                return tipo.tipos.CARACTER;
            }
            return tipo.tipos.CADENA;
        }else
        if (typeof result === 'number'){
            if (result%1 === 0){
                    return tipo.tipos.ENTERO;
            }
            return tipo.tipos.DECIMAL;
        }else if (typeof result ==='boolean'){
                return tipo.tipos.BOOLEANO;
        }            
    }
}
