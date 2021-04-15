import Tipo from "../tablaSimbolos/Tipo";
import Arbol from "../tablaSimbolos/Arbol";
import TablaSimbolos from "../tablaSimbolos/tablaSimbolos";

export abstract class Instruccion {

    public tipo: Tipo;
    public linea: Number;
    public columna: Number;
    public pasada:any;

    constructor(tipo:Tipo, linea : Number, columna:Number, pasada?:any) {
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

    public getTipo():Tipo{
        return this.tipo;
    }

    public setPasada(pasada:any){
        this.pasada = pasada;
    }
}