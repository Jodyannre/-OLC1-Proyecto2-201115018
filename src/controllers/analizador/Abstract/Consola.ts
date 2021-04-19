

export class Consola {

    public static consola:string="";

    public static updateConsola(cadena:string){
        this.consola = `${this.consola}${cadena}\n`;
    }

    public static getConsola(){
        return this.consola;
    }

    public static clearConsola(){
        this.consola = "";
    }

}