import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";


export class Consola {

    public static consola:string="";
    public static arbol:Arbol;
    public static tabla:tablaSimbolos;

    public static updateConsola(cadena:string){
        this.consola = `${this.consola}${cadena}\n`;
    }

    public static getConsola(){
        return this.consola;
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
            this.updateConsola(siguiente.getConsola());
        }
    }

    public static generarConsolaSiguientes(arbol:Arbol){
        if (arbol.getSiguientes()===null){
            return;
        }
        for (let siguiente of arbol.getSiguientes()){
            this.generarConsolaSiguientes(siguiente);
            this.updateConsola(siguiente.getConsola());
        }
    }

}