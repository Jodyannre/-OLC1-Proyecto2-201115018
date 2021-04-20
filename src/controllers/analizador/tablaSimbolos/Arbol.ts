import Simbolo from "./Simbolo";
import tablaSimbolos from "./tablaSimbolos";
import Excepcion from "../Excepciones/Excepcion";
import {Instruccion} from "../Abstract/Instruccion";

export default class Arbol {
    private instrucciones: Array<Instruccion>;
    private errores: Array<Excepcion>;
    private consola: string;
    private global: tablaSimbolos;
    private siguientes: Array<Arbol>|any;

    constructor(instrucciones: Array<Instruccion>){
        this.instrucciones = instrucciones;
        this.consola = "";
        this.global = new tablaSimbolos(0);
        this.errores = new Array<Excepcion>();
        this.siguientes = new Array<Arbol>();
    }

    public getSiguientes(){
        return this.siguientes;
    }

    public addSiguiente(siguiente:Arbol){
        this.siguientes.push(siguiente);
    }

    public addError(err:Excepcion){
        this.errores.push(err);
    }

    public getInstrucciones():Array<Instruccion>{
        return this.instrucciones;
    }

    public setInstrucciones(instrucciones: Array<Instruccion>){
        this.instrucciones = instrucciones;
    }

    public getExcepciones():Array<Excepcion>{
        return this.errores;
    }

    public setExcepciones (errores: Array<Excepcion>){
        this.errores = errores;
    }

    public getConsola():string{
        return this.consola;
    }

    public setConsola(consola:string){
        this.consola = consola;
    }

    public updateConsola(update:string){
        this.consola = `${this.consola}${update}\n`;
    }

    public getGlobal():tablaSimbolos{
        return this.global;
    }

    public setGlobal(tabla:tablaSimbolos){
        this.global = tabla;
    }

    public setAmbito(ambito:number){
        this.global.setAmbito(ambito);
    }
}