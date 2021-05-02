import Tipo from "../tablaSimbolos/Tipo";
import Arbol from "../tablaSimbolos/Arbol";
import TablaSimbolos from "../tablaSimbolos/tablaSimbolos";

export abstract class Instruccion {

    public tipo: Tipo;
    public linea: number;
    public columna: number;
    public pasada:any;
    public ambito:any;

    constructor(tipo:Tipo, linea : number, columna:number, pasada?:any) {
        this.tipo = tipo;
        this.linea = linea;
        this.columna = columna;
        if(pasada){
            this.pasada = pasada;
        }else{
            this.pasada = null;
        }
    }

    abstract interpretar(arbol: Arbol, tabla: TablaSimbolos):any;
    // TODO graficar AST

    public getFila(){
        return this.linea;
    }
    
    public getColumna(){
        return this.columna;
    }

    public getTipo():Tipo{
        return this.tipo;
    }

    public setPasada(pasada:any){
        this.pasada = pasada;
    }

    public setAmbito(ambito:any){
        this.ambito = ambito;
    }
}