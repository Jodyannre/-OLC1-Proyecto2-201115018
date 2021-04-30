import Simbolo from "./Simbolo";
import Tipo, {tipos} from "./Tipo";

export default class tablaSimbolos
{
    public tabla: Map<string, Simbolo>;
    private anterior: tablaSimbolos | any;
    private siguientes: Array<tablaSimbolos> | any;
    private tipo: Tipo;
    private ambito:number;
    //private funciones: Array<Func>;

    constructor(ambito:number,anterior?:tablaSimbolos)
    {
        this.anterior = anterior;
        this.tabla = new Map<string, Simbolo>();
        this.tipo = new Tipo(tipos.ENTERO);
        this.ambito = ambito;
        this.siguientes = new Array();
    }

    public setVariable(simbolo:Simbolo)
    {
        for(var e: tablaSimbolos = this; e != null; e = e.getAnterior())
        {
            var encontro:Simbolo = <Simbolo> (e.getTable().get(simbolo.getIdentificador()));
            if(encontro != null)
            {
                //return `La variable con el identificador ${simbolo.getIdentificador()} ya existe.`;
                return false;
            }
            break;
        }
        this.tabla.set(simbolo.getIdentificador(), simbolo);// SE AGREGA LA VARIABLE

        //return `LA VARIABLE ${simbolo.getIdentificador()} SE CREO EXITOSAMENTE.`;
        return true;
    }

    public setVariableNueva(simbolo:Simbolo){
        this.tabla.set(simbolo.getIdentificador(), simbolo)
    }

    public getVariable(indentificador: string)
    {
        for(var e: tablaSimbolos = this; e != null; e = e.getAnterior())
        {
            var encontro:Simbolo = <Simbolo> (e.getTable().get(indentificador));
            if(encontro != null)
            {
                return encontro;
            }
        }
        return null;
    }

    public getTable() {
        return this.tabla;
    }

    public existe(id:string){
        for(var e: tablaSimbolos = this; e != null; e = e.getAnterior())
        {
            let encontro:Simbolo = <Simbolo> (e.getTable().get(id));
            if(encontro != null)
            {
                //return `La variable con el identificador ${simbolo.getIdentificador()} ya existe.`;
                return encontro;
            }
            
        }  
        return null;      
    }

    public setTable(Table: Map<string, Simbolo>) {
        this.tabla = Table;
    }

    public getAnterior() {
        return this.anterior;
    }

    public setAnterior(Anterior: tablaSimbolos) {
        this.anterior = Anterior;
    }

    public setAmbito(ambito:number){
        this.ambito = ambito;
    }

    public getAmbito():number{
        return this.ambito;
    }

    public addSiguiente(siguiente: tablaSimbolos){
        this.siguientes.push(siguiente);
    }

    public getSiguientes(){
        return this.siguientes;
    }

}
