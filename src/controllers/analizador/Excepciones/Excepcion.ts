import { nodoInstruccion } from "../Abstract/nodoInstruccion";

export default class Excepcion {
    private tipo: string;
    private descripcion: string;
    private fila: number;
    private columna: number;


    public getNodoInstruccion():nodoInstruccion{
        let nodo:nodoInstruccion = new nodoInstruccion('ERROR');
        nodo.agregarHijoCadena(this.tipo);      
        return nodo;
    }

    constructor(tipo: string, descripcion:string, fila:number, columna:number)
    {
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.fila = fila;
        this.columna = columna;
    }

    public toString():string{
        return this.tipo + " - " + this.descripcion + " [" + this.fila + ", " + this.columna + "]";
    }
    public imprimir(){
        return this.toString() + "\n";
    }

    public getTipo():string
    {
        return this.tipo;
    }
    public getDesc():string
    {
        return this.descripcion;
    }

    public getFila():number
    {
        return this.fila;
    }
    public getColumna():number
    {
        return this.columna;
    }

}