import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo from "../tablaSimbolos/Tipo";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";


export default class Identificador extends Instruccion{
    private valor: any;

    constructor(tipo:Tipo, valor:any, linea:Number, columna:Number){
        super(tipo, linea, columna);
        this.valor = valor;
    }

    public interpretar(tree:Arbol, table:tablaSimbolos){
        return this.valor;
    }

    public getNodoInstruccion():nodoInstruccion{
        let nodo:nodoInstruccion = new nodoInstruccion("IDENTIFICADOR");
        nodo.agregarHijoCadena(this.valor+"");
        return nodo;
    }

    public getValor():string{
        return this.valor;
    }

}