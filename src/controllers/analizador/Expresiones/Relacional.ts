import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo from "../tablaSimbolos/Tipo";
import Excepcion from "../Excepciones/Excepcion";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";

const tipo = require('../tablaSimbolos/Tipo');

export default class Relacional extends Instruccion{

    private operandoIzq:any;
    private operandoDer:any;
    private operandoRelacional:Tipo;
    private preAscii:any;


    constructor(operandoIzq:any, operandoDer:any, operandoRelacional:Tipo, linea:Number, columna:Number ) {
        super(operandoRelacional, linea, columna);
        this.operandoIzq = operandoIzq;
        this.operandoDer = operandoDer;
        this.operandoRelacional = operandoRelacional;
    }

    public getNodoInstruccion():nodoInstruccion{
        let nodo:nodoInstruccion = new nodoInstruccion("Relacional");
        nodo.agregarHijoNodo(this.operandoIzq.getNodoInstruccion());
        nodo.agregarHijoCadena(tipo.tipos[this.operandoRelacional.getTipos()]+"");
        nodo.agregarHijoNodo(this.operandoDer.getNodoInstruccion());
        return nodo;
    }


    public interpretar(tree:Arbol, table:tablaSimbolos){
        let izquierdo:any = null, derecho:any = null;
        izquierdo = this.operandoIzq.interpretar(tree, table);
        if (izquierdo instanceof Excepcion) return izquierdo;

        derecho = this.operandoDer.interpretar(tree, table);
        if (derecho instanceof Excepcion) return derecho;

        this.tipo = new tipo.default(tipo.tipos.BOOLEANO);

        if (null != this.operandoRelacional){

            switch(this.operandoRelacional.getTipos()){
                case 18: //Mayor
                    if (this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO) {

                        return parseInt(izquierdo,10)  > parseInt(derecho,10);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL){
                        
                        return parseInt(izquierdo,10) > parseFloat(derecho);
                    }
                    else if (this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER) {
                        this.preAscii = <string>derecho+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return parseInt(izquierdo,10) > ASCII;
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO){
                        return parseFloat(izquierdo)> parseInt(derecho,10);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL){
                        return parseFloat(izquierdo) > parseFloat(derecho);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER){
                        this.preAscii = <string>derecho+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return parseFloat(izquierdo) > ASCII;
                    }
                    else if (this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO) {
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return ASCII > parseInt(derecho,10);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL){
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return ASCII > parseFloat(derecho);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER){
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii izquierdo
                        this.preAscii = <string>derecho+"";
                        let ASCII2:number = this.preAscii.charCodeAt(0); //Get ascii derecho
                        return ASCII > ASCII2;
                    }
                    else {
                        var ex:Excepcion = new Excepcion("Semantico", "Error de tipos con el operador >", this.linea, this.columna);
                        tree.getExcepciones().push(ex);
                        return ex;
                    }
                    break;
                ///////////////////////////////////////////////////////////////////////////////////////////////////
                case 19: //Menor

                    if (this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO
                    && this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO) {

                        return parseInt(izquierdo,10)  < parseInt(derecho,10);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL){
                        
                        return parseInt(izquierdo,10) < parseFloat(derecho);
                    }
                    else if (this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER) {
                        this.preAscii = <string>derecho+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return parseInt(izquierdo,10) < ASCII;
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO){
                        return parseFloat(izquierdo) < parseInt(derecho,10);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL){
                        return parseFloat(izquierdo) < parseFloat(derecho);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER){
                        this.preAscii = <string>derecho+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return parseFloat(izquierdo) < ASCII;
                    }
                    else if (this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO) {
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return ASCII < parseInt(derecho,10);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL){
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return ASCII < parseFloat(derecho);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER){
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii izquierdo
                        this.preAscii = <string>derecho+"";
                        let ASCII2:number = this.preAscii.charCodeAt(0); //Get ascii derecho
                        return ASCII < ASCII2;
                    }
                    else {
                        var ex:Excepcion = new Excepcion("Semantico", "Error de tipos con el operador <", this.linea, this.columna);
                        tree.getExcepciones().push(ex);
                        return ex;
                    }
                    break;
                ///////////////////////////////////////////////////////////////////////////////////////////////////
                case 20: //Igual

                    if (this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO
                    && this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO) {

                        return parseInt(izquierdo,10)  == parseInt(derecho,10);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL){
                        
                        return parseInt(izquierdo,10) == parseFloat(derecho);
                    }
                    else if (this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER) {
                        this.preAscii = <string>derecho+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return parseInt(izquierdo,10) == ASCII;
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO){
                        return parseFloat(izquierdo) == parseInt(derecho,10);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL){
                        return parseFloat(izquierdo) == parseFloat(derecho);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER){
                        this.preAscii = <string>derecho+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return parseFloat(izquierdo) == ASCII;
                    }
                    else if (this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO) {
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return ASCII == parseInt(derecho,10);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL){
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return ASCII == parseFloat(derecho);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER){
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii izquierdo
                        this.preAscii = <string>derecho+"";
                        let ASCII2:number = this.preAscii.charCodeAt(0); //Get ascii derecho
                        return ASCII == ASCII2;
                    }
                    else {
                        var ex:Excepcion = new Excepcion("Semantico", "Error de tipos con el operador ==", this.linea, this.columna);
                        tree.getExcepciones().push(ex);
                        return ex;
                    }

                    break;
                ///////////////////////////////////////////////////////////////////////////////////////////////////
                case 21: //Mayor igual

                    if (this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO
                    && this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO) {

                        return parseInt(izquierdo,10)  >= parseInt(derecho,10);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL){
                        
                        return parseInt(izquierdo,10) >= parseFloat(derecho);
                    }
                    else if (this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER) {
                        this.preAscii = <string>derecho+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return parseInt(izquierdo,10) >= ASCII;
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO){
                        return parseFloat(izquierdo) >= parseInt(derecho,10);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL){
                        return parseFloat(izquierdo) >= parseFloat(derecho);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER){
                        this.preAscii = <string>derecho+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return parseFloat(izquierdo) >= ASCII;
                    }
                    else if (this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO) {
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return ASCII >= parseInt(derecho,10);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL){
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return ASCII >= parseFloat(derecho);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER){
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii izquierdo
                        this.preAscii = <string>derecho+"";
                        let ASCII2:number = this.preAscii.charCodeAt(0); //Get ascii derecho
                        return ASCII >= ASCII2;
                    }
                    else {
                        var ex:Excepcion = new Excepcion("Semantico", "Error de tipos con el operador >=", this.linea, this.columna);
                        tree.getExcepciones().push(ex);
                        return ex;
                    }
                    break;
                ///////////////////////////////////////////////////////////////////////////////////////////////////
                case 22: //Menor igual

                    if (this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO
                    && this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO) {

                        return parseInt(izquierdo,10)  <= parseInt(derecho,10);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL){
                        
                        return parseInt(izquierdo,10) <= parseFloat(derecho);
                    }
                    else if (this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER) {
                        this.preAscii = <string>derecho+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return parseInt(izquierdo,10) <= ASCII;
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO){
                        return parseFloat(izquierdo) <= parseInt(derecho,10);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL){
                        return parseFloat(izquierdo) <= parseFloat(derecho);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER){
                        this.preAscii = <string>derecho+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return parseFloat(izquierdo) <= ASCII;
                    }
                    else if (this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO) {
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return ASCII <= parseInt(derecho,10);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL){
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return ASCII <= parseFloat(derecho);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER){
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii izquierdo
                        this.preAscii = <string>derecho+"";
                        let ASCII2:number = this.preAscii.charCodeAt(0); //Get ascii derecho
                        return ASCII <= ASCII2;
                    }
                    else {
                        var ex:Excepcion = new Excepcion("Semantico", "Error de tipos con el operador <=", this.linea, this.columna);
                        tree.getExcepciones().push(ex);
                        return ex;
                    }
                    break;
                ///////////////////////////////////////////////////////////////////////////////////////////////////
                case 23: //Diferente

                    if (this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO
                    && this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO) {

                        return parseInt(izquierdo,10)  != parseInt(derecho,10);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL){
                        
                        return parseInt(izquierdo,10) != parseFloat(derecho);
                    }
                    else if (this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER) {
                        this.preAscii = <string>derecho+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return parseInt(izquierdo,10) != ASCII;
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO){
                        return parseFloat(izquierdo) != parseInt(derecho,10);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL){
                        return parseFloat(izquierdo) != parseFloat(derecho);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER){
                        this.preAscii = <string>derecho+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return parseFloat(izquierdo) != ASCII;
                    }
                    else if (this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO) {
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return ASCII != parseInt(derecho,10);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL){
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return ASCII != parseFloat(derecho);
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER){
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii izquierdo
                        this.preAscii = <string>derecho+"";
                        let ASCII2:number = this.preAscii.charCodeAt(0); //Get ascii derecho
                        return ASCII != ASCII2;
                    }
                    else {
                        var ex:Excepcion = new Excepcion("Semantico", "Error de tipos con el operador !=", this.linea, this.columna);
                        tree.getExcepciones().push(ex);
                        return ex;
                    }

                    break;
                ///////////////////////////////////////////////////////////////////////////////////////////////////
                default: //Nada retornar null
                    break;
                ///////////////////////////////////////////////////////////////////////////////////////////////////
            }
        }
        return null;
    }
}
