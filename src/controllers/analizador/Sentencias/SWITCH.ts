import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo from "../tablaSimbolos/Tipo";
import Excepcion from "../Excepciones/Excepcion";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
import Relacional from "../Expresiones/Relacional";
import Logica from "../Expresiones/Logica";
import Identificador from "../Expresiones/Identificador";
import CASE from "./CASE";
import Primitivo from "../Expresiones/Primitivo";
import CONTINUE from "./CONTINUE";
import RETURN from "./RETURN";
import BREAK from "./BREAK";
var Errors:Array<Excepcion> = new Array<Excepcion>();

const tipo = require('../tablaSimbolos/Tipo');

export default class SWITCH extends Instruccion{
    private condicion:any;
    private casos:any;



    public getNodoInstruccion(){
        let nodo:nodoInstruccion = new nodoInstruccion("INSTRUCCION");
        let nodo2:nodoInstruccion = new nodoInstruccion("SENTENCIA_SWITCH");
        let nodo3:nodoInstruccion = new nodoInstruccion("CONDICION");
        let nodo4:nodoInstruccion = new nodoInstruccion("INSTRUCCION");
        let temp:any;
        if (this.tipo.getTipos()===59){
            nodo2.agregarHijoCadena("SWITCH");
            nodo2.agregarHijoCadena("(");
            nodo3.agregarHijoNodo(this.condicion.getNodoInstruccion());
            nodo2.agregarHijoNodo(nodo3);
            nodo2.agregarHijoCadena(")");
            nodo2.agregarHijoCadena("{");
            if (this.casos!=null){
                for (let instruccion of this.casos){
                    temp = instruccion;
                    nodo4.agregarHijoNodo(temp.getNodoInstruccion());
                }
                nodo2.agregarHijoNodo(nodo4);
            }
            nodo2.agregarHijoCadena("}");
            nodo.agregarHijoNodo(nodo2);
        }         
        return nodo;
    }


    constructor(tipo:Tipo, linea:number, columna:number, condicion:any,casos:any) {
        super(tipo, linea, columna);
        this.condicion = condicion;
        if (casos !=null){
            this.casos = new Array();
            while (casos.length>0){
                this.casos.push(casos.shift());
            }
            //casos = [];
        }else{
            this.casos = null;
        }
    }


    public interpretar(tree:Arbol, table:tablaSimbolos){
        if (this.pasada<2){
            return true;
        }

        //Verificar si la condición es válida
        let tipoCondicion = this.verificarCondicion(tree,table); //Devuelve el número del enum
        if (tipoCondicion instanceof Excepcion){
            return tipoCondicion;
        }
        let tipoCaso:any;
        //Verificar si hay casos
        if (this.casos != null){
            //Verificar el tipo de condición y que los cases tengan ese mismo tipo
            for (let caso of this.casos){
                if (caso instanceof Excepcion){
                    return caso;
                }
                tipoCaso = caso.getTipoValorEvaluado(tree,table); //Devuelve  el número del enum
                if (tipoCondicion != tipoCaso && tipoCaso!= tipo.tipos.DEFAULT){
                    var ex:Excepcion = new Excepcion("Semantico", "Valor incorrecto en case.", this.linea, this.columna);
                    //tree.getExcepciones().push(ex);
                    return ex;                      
                }
            }
            //Si pasa por acá quiere decir que todos los casos son correctos.
            //Operar casos
            let resultado:any;
            for (let caso of this.casos){
                caso.setValorAevaluar(this.condicion);
                caso.setPasada(2);
                resultado = caso.interpretar(tree,table);
                if (resultado instanceof Excepcion){
                    return resultado;
                }
                
                if (resultado instanceof CONTINUE){
                    continue;
                }
                if (resultado instanceof RETURN){
                    return resultado;
                }    
                if (resultado instanceof BREAK){
                    return true;
                }  

                if (resultado != false){
                    return resultado;
                }
            }


        }else{
            //No hay nada que evaluar
            return true;
        }

    }

    //Devuelve el número del enum
    public verificarCondicion(tree:Arbol, table:tablaSimbolos){
        if (this.condicion.getTipo().getTipos()=== tipo.tipos.IDENTIFICADOR){
            var simbolo = this.condicion.interpretar(tree,table);
            return simbolo.getTipo().getTipos();
        }else if (this.condicion instanceof Primitivo){
            return this.condicion.getTipo().getTipos();
        }else if (this.condicion instanceof Relacional
        || this.condicion instanceof Logica){
            return tipo.tipos.BOOLEANO;
        }else{
            var ex:Excepcion = new Excepcion("Semantico", "No se puede evaluar ese valor.", this.linea, this.columna);
            //tree.getExcepciones().push(ex);
            return ex;                
        }
    }

    public buscarReturn(){
        let resultado:any = false;
        let temp = false;
        for (let m of this.casos){
            if (m instanceof RETURN){
                return m;
            }
            try{
                temp = m.buscarReturn();
                resultado = temp;
                if (resultado instanceof RETURN){
                    return resultado;
                }
            }catch(err){
                console.log("No tiene el método.");
            }
        }
        return false;
    }
}
