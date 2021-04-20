import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo from "../tablaSimbolos/Tipo";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";


export default class Primitivo extends Instruccion{
    private valor: any;

    constructor(tipo:Tipo, valor:any, linea:number, columna:number){
        super(tipo, linea, columna);
        this.valor = valor;
    }

    public interpretar(tree:Arbol, table:tablaSimbolos){
        return this.valor;
    }

    public getNodoInstruccion():nodoInstruccion{
        let nodo:nodoInstruccion = new nodoInstruccion("PRIMITIVO");
        nodo.agregarHijoCadena(this.valor+"");
        return nodo;
    }

    public setValor(valor:any){
        this.valor = valor;
    }

    public getValor(){
        return this.valor;
    }

    public setTipo(tipo:number){
        this.tipo.setTipo(tipo);
    }

}