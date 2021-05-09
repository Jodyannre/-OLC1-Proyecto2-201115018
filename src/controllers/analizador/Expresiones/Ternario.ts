import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo from "../tablaSimbolos/Tipo";
import Excepcion from "../Excepciones/Excepcion";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
import Identificador from "./Identificador";
import Primitivo from "./Primitivo";

const tipo = require('../tablaSimbolos/Tipo');

export default class Ternario extends Instruccion{

    private condicion:any;
    private expCorrecta:any;
    private expIncorrecta:any;



    public getNodoInstruccion():nodoInstruccion{
        let nodo:nodoInstruccion = new nodoInstruccion('TERNARIO');
        let nodo2:nodoInstruccion = new nodoInstruccion('CONDICION');
        nodo2.agregarHijoNodo(this.condicion.getNodoInstruccion());
        nodo.agregarHijoNodo(nodo2);
        nodo.agregarHijoCadena("?");
        nodo.agregarHijoNodo(this.expCorrecta.getNodoInstruccion());
        nodo.agregarHijoCadena(":");
        nodo.agregarHijoNodo(this.expIncorrecta.getNodoInstruccion());
        return nodo;
    }



    constructor(tipo:Tipo,condicion:any,expCorrecta:any,expIncorrecta:any, linea:number, columna:number) {
        super(tipo, linea, columna);
        this.condicion = condicion;
        this.expCorrecta = expCorrecta;
        this.expIncorrecta = expIncorrecta;
    }


    public interpretar(tree:Arbol, table:tablaSimbolos):any{
        if (this.pasada < 1){
            return true;
        }
        let result:any;
        let resultCond:any;
        let cond:any;
        let exp_correcta:any;
        let exp_incorrecta:any;
        if (this.condicion instanceof Identificador){
            cond = this.condicion.interpretar(tree,table); //Traer el símbolo
            if (cond instanceof Excepcion){
                return cond;
            }
            cond = cond.getValor(); //Traer el primitivo valor
        }else{
            if (!(this.condicion instanceof Primitivo)){
                this.condicion.setPasada(2);
                cond = this.condicion.interpretar(tree,table);
            }else{
                cond = this.condicion;
            }
            
        }

        if (this.expCorrecta instanceof Identificador){
            exp_correcta = this.expCorrecta.interpretar(tree,table); //Traer el símbolo
            if (exp_correcta instanceof Excepcion){
                return exp_correcta;
            }
            exp_correcta = exp_correcta.getValor(); //Traer el primitivo valor
        }else if (this.expCorrecta instanceof Primitivo){
            exp_correcta = this.expCorrecta;
        }
        else{
            //Puede ser primitivo o cualquier cosa
            this.expCorrecta.setPasada(2);
            exp_correcta = this.expCorrecta.interpretar(tree,table);
        }

        if (this.expIncorrecta instanceof Identificador){
            exp_incorrecta = this.expIncorrecta.interpretar(tree,table); //Traer el símbolo
            if (exp_incorrecta instanceof Excepcion){
                return exp_incorrecta;
            }
            exp_incorrecta = exp_incorrecta.getValor(); //Traer el primitivo valor
        }else if (this.expIncorrecta instanceof Primitivo){
            exp_incorrecta = this.expIncorrecta;
        }
        else{
            //Puede ser primitivo o cualquier cosa
            this.expIncorrecta.setPasada(2);
            exp_incorrecta = this.expIncorrecta.interpretar(tree,table);
        }

        if (cond.getTipo().getTipos()!=tipo.tipos.BOOLEANO){
            var ex:Excepcion = new Excepcion("Semantico", "La condición no es booleana.", result.linea, result.columna);
            return ex;
        }

        resultCond = cond.interpretar(tree,table);

        if (resultCond){ //Retornar primitivos 
            return exp_correcta;
        }else{
            return exp_incorrecta;
        }

    }
}
