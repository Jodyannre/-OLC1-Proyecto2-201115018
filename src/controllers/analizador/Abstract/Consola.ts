import Arbol from "../tablaSimbolos/Arbol";


export class Consola {

    public static consola:string="";
    public static arbol:Arbol;

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

    public static generarConsola(){
        this.updateConsola(this.arbol.getConsola());
        for (let siguiente of this.arbol.getSiguientes()){
            this.updateConsola(siguiente.getConsola());
        }
    }

}