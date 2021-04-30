import { Instruccion } from "../Abstract/Instruccion";
import Excepcion from "../Excepciones/Excepcion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo, { tipos } from "../tablaSimbolos/Tipo";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";


export default class Exec extends Instruccion{
    private instruccion:any;

    public getNodoInstruccion():nodoInstruccion{
        let nodo:nodoInstruccion = new nodoInstruccion('LLAMADA');
        let nodo2:nodoInstruccion = new nodoInstruccion('LLAMADA_EXEC');
        nodo2.agregarHijoCadena("EXEC");
        nodo2.agregarHijoNodo(this.instruccion.getNodoInstruccion());
        nodo2.agregarHijoCadena(";");
        nodo.agregarHijoNodo(nodo2);       
        return nodo;
    }

    constructor(tipo:Tipo, linea:number, columna:number,instruccion:any){
        super(tipo,linea, columna);
        this.instruccion = instruccion;
    }

    public interpretar(tree:Arbol, table:tablaSimbolos){
        if (this.pasada <2){
            return true;
        }
        if (this.instruccion instanceof Excepcion){
            return this.instruccion;
        }
        this.instruccion.setPasada(2);
        let result = this.instruccion.interpretar(tree,table);
        /*
        if (result instanceof Excepcion){
            tree.addError(result);
            tree.updateConsola((<Excepcion>result).toString());
        }
        */
        return result;
    }
}