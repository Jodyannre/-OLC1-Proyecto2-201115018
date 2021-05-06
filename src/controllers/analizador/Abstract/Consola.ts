import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Simbolo from "../tablaSimbolos/Simbolo";
import Vector from "../Expresiones/Vector";
import Lista from "../Expresiones/Lista";
import Funcion from "../Expresiones/Funcion";
import Metodo from "../Expresiones/Metodo";
import Excepcion from "../Excepciones/Excepcion";
const tipo = require('../tablaSimbolos/Tipo');

export class Consola {

    public static consola:string="";
    public static arbol:Arbol;
    public static tabla:tablaSimbolos;
    public static contadorErrores:number=1;

    public static updateConsola(cadena:string){
        this.consola = `${this.consola}${cadena}\n`;
    }

    public static getConsola(){
        this.generarConsola();
        return this.arbol.getConsola();
    }
    public static getArbol(){
        return this.arbol;
    }
    public static clearConsola(){
        this.consola = "";
    }

    public static setArbol(arbol:Arbol){
        this.arbol = arbol;
    }
    public static setTabla(tabla:tablaSimbolos){
        this.tabla = tabla;
    }

    public static generarConsola(){
        //this.updateConsola(this.arbol.getConsola()); 
        for (let siguiente of this.arbol.getSiguientes()){
            this.generarConsolaSiguientes(siguiente);
            /*
            if (siguiente.getConsola()!=""){
                this.arbol.updateConsola(siguiente.getConsola());
            }
            */
        }
    }

    public static generarConsolaSiguientes(arbol:Arbol){
        if (arbol.getSiguientes().length === 0){
            if (arbol.getConsola()!=""){
                this.arbol.updateConsola(arbol.getConsola());
            }
            return;
        }
        for (let siguiente of arbol.getSiguientes()){
            this.generarConsolaSiguientes(siguiente);
            if (siguiente.getConsola()!=""){
                this.arbol.updateConsola(siguiente.getConsola());
            }
        }
    }

    public static generarTablaSimbolos():Array<any>{
        let array:Array<any> = new Array<any>(); //Array que contendrá todos los datos de los símbolos de cada ámbito
        //primero generar las globales
        this.rellenarArray(this.arbol.getGlobal(),array);
        for (let siguiente of this.arbol.getGlobal().getSiguientes()){
            this.generarTablaSimbolosSiguientes(siguiente,array);
        }

        return array;
    }

    public static generarTablaSimbolosSiguientes(actual:tablaSimbolos,array:Array<any>){
        let size = actual.Length();
        this.rellenarArray(actual,array);
        if (size===0){
            return;
        }
        for (let siguiente of actual.getSiguientes()){
            this.generarTablaSimbolosSiguientes(siguiente,array);
        }
    }

    public static rellenarArray(tabla:tablaSimbolos,array:Array<any>){
        let simbolos;
        let temp;
        let tempTxt;
        let linea,columna;
        for (var [clave, valor] of tabla.getTable()){
            simbolos = new Array<any>();
            if (this.claveRepetida(clave,array)){
                continue;
            }
            simbolos.push(clave);
            temp = <Simbolo>valor;
            if (temp.getValor()instanceof Funcion){
                simbolos.push("Función");
            }else if (temp.getValor()instanceof Metodo){
                simbolos.push("Método");
            }else if (temp.getValor()instanceof Vector){
                simbolos.push("Vector");
            }else if (temp.getValor()instanceof Lista){
                simbolos.push("Lista");
            }else{
                simbolos.push("Variable");
            }
            tempTxt = tipo.tipos[temp.getTipo().getTipos()]+"";
            tempTxt = tempTxt.toLowerCase();
            tempTxt = tempTxt.charAt(0).toUpperCase() + tempTxt.slice(1);
            simbolos.push(tempTxt+"");
            simbolos.push(tabla.getNombre()+"");
            linea = temp.getValor().getFila();
            columna = temp.getValor().getColumna();
            simbolos.push(linea+"");
            simbolos.push(columna+"");
            array.push(simbolos);
        }
    }

    private static claveRepetida(clave:any,array:any):boolean{
        for (let elemento of array){
            if (elemento.includes(clave)){
                return true;
            }
        }
        return false;
    }



    public static generarTablaErrores():Array<any>{
        let array:Array<any> = new Array<any>(); //Array que contendrá todos los datos de los símbolos de cada ámbito
        //primero generar las globales
        this.rellenarArrayErrores(this.arbol,array);
        for (let siguiente of this.arbol.getSiguientes()){
            this.generarTablaErroresSiguientes(siguiente,array);
        }

        return array;
    }

    public static generarTablaErroresSiguientes(actual:Arbol,array:Array<any>){
        let size = actual.getExcepciones().length;
        this.rellenarArrayErrores(actual,array);
        if (size===0){
            return;
        }
        for (let siguiente of actual.getSiguientes()){
            this.generarTablaErroresSiguientes(siguiente,array);
        }
    }

    public static rellenarArrayErrores(arbol:Arbol,array:Array<any>){
        let simbolos;
        let temp;
        for (var error of arbol.getExcepciones()){
            simbolos = new Array<any>();
            simbolos.push(this.contadorErrores+"");
            temp = <Excepcion>error;
            simbolos.push(temp.getTipo());
            simbolos.push(temp.getDesc());
            simbolos.push(temp.getFila()+"");
            simbolos.push(temp.getColumna()+"");
            array.push(simbolos);
            this.contadorErrores++;
        }
    }
}


