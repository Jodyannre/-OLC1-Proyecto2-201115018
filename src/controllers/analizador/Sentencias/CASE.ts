import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo from "../tablaSimbolos/Tipo";
import Excepcion from "../Excepciones/Excepcion";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
import Relacional from "../Expresiones/Relacional";
import Logica from "../Expresiones/Logica";
import Aritmetica from "../Expresiones/Aritmetica";
import Primitivo from "../Expresiones/Primitivo";
import BREAK from "./BREAK";

var Errors:Array<Excepcion> = new Array<Excepcion>();

const tipo = require('../tablaSimbolos/Tipo');

export default class CASE extends Instruccion{
    private valorEvaluado:any;
    private instrucciones:any;
    private valorAevaluar:any;


    public getNodoInstruccion(){
        let nodo:nodoInstruccion = new nodoInstruccion("SENTENCIA_CASE");
        let nodo2:nodoInstruccion = new nodoInstruccion("INSTRUCCIONES");
        if (this.tipo.getTipos()===57){
            nodo.agregarHijoCadena("CASE");
            nodo.agregarHijoNodo(this.valorEvaluado.getNodoInstruccion());
            nodo.agregarHijoCadena(":");
            if (this.instrucciones != null){
                nodo.agregarHijoNodo(nodo2);
                for (let instruccion of this.instrucciones){
                    nodo2.agregarHijoNodo(instruccion.getNodoInstruccion());
                }
            }
        }else if(this.tipo.getTipos()===58){
            nodo.agregarHijoCadena("DEFAULT");
            nodo.agregarHijoCadena(":");
            if (this.instrucciones != null){
                nodo.agregarHijoNodo(nodo2);
                for (let instruccion of this.instrucciones){
                    nodo2.agregarHijoNodo(instruccion.getNodoInstruccion());
                }
            }            
        }
        return nodo;
    }


    constructor(tipo:Tipo, linea:number, columna:number, valorEvaluado:any,instrucciones:any) {
        super(tipo, linea, columna);
        this.valorEvaluado = valorEvaluado;
        this.instrucciones = instrucciones;
    }


    public interpretar(tree:Arbol, table:tablaSimbolos){
        if (this.pasada<2){
            return true;
        }
        //Verificar si el case hace match con la condición
        let comparacion = this.compararValores(tree,table);

        if (comparacion instanceof Excepcion){
            return comparacion;
        }else if (comparacion ===false){
            return false;
        }

        //Crear ámbito nuevo
        let nArbol:Arbol = new Arbol(this.instrucciones);
        let nTabla:tablaSimbolos = new tablaSimbolos(3,table);
        table.addSiguiente(nTabla);
        tree.addSiguiente(nArbol);
        
        if (this.instrucciones != null){
            //Operar
            try{
                for (let m of nArbol.getInstrucciones()){               
                    if(m instanceof Excepcion){ // ERRORES SINTACTICOS
                        Errors.push(m);
                        nArbol.addError(m);
                        nArbol.updateConsola((<Excepcion>m).toString());
                        continue;
                    }
                    m.setPasada(2);
                    var result = m.interpretar(nArbol, nTabla);
                    if(result instanceof Excepcion){ // ERRORES SEMÁNTICOS
                        Errors.push(result);
                        nArbol.addError(result);
                        nArbol.updateConsola((<Excepcion>result).toString());
                        return result;
                    }
                    if (result instanceof BREAK){
                        return true;
                    }
                                        
                }                                      
            }catch(err){
                console.log(err);
            }
            return false; //Terminó de operar exitosamente

        }else{
            //Si entro, pero no hay instrucciones
            return false;
        }
    }


    public compararValores(tree:Arbol,table:tablaSimbolos){
        
        if (this.tipo.getTipos()=== tipo.tipos.DEFAULT){
            return true;
        }

        let valor:any;
        let simbolo:any=null; //Símbolo que contiene el valor a evaluar
        let tipoValorAevaluar:any;
        let tipoValorEvaluar:any= this.getTipoValorEvaluado(tree,table); //Get el tipo de primitivo

        if (tipoValorEvaluar instanceof Excepcion){
            return tipoValorEvaluar;
        }

        if (this.valorAevaluar instanceof Primitivo){
            //tipoValorAevaluar = this.valorAevaluar.interpretar(tree,table);
            tipoValorAevaluar = this.valorAevaluar;
            //El mismo primitivo
        }else
        if (this.valorAevaluar instanceof Relacional || this.valorAevaluar instanceof Logica){
            tipoValorAevaluar = this.valorAevaluar.interpretar(tree,table);
            //Primitivo
        }else 
        if(this.valorAevaluar instanceof Aritmetica){
            tipoValorAevaluar =  this.valorAevaluar.interpretar(tree,table);
            //Primitivo
        }else
        if (this.valorAevaluar.getTipo().getTipos()===tipo.tipos.IDENTIFICADOR){
            simbolo = this.valorAevaluar.interpretar(tree,table);
            if (simbolo instanceof Excepcion){
                return simbolo;
            }else{
                tipoValorAevaluar = simbolo.getValor();
                //Primitivo
            }
        }else{
            var ex:Excepcion = new Excepcion("Semantico", "Valor incorrecto en sentencia Switch.", this.linea, this.columna);
            tree.getExcepciones().push(ex);
            return ex;             
        }

        //Ya tengo el valor en símbolo, solo hay que calcular el valor local
        //valor = this.valorEvaluado.interpretar(tree,table); 
        valor = this.valorEvaluado; //Primitivo
        if (simbolo != null){
            if (valor.getValor() === simbolo.getValor().getValor()){
                return true;
            }else{
                return false;
            }
        }else{
            if (valor.getValor() === tipoValorAevaluar.getValor()){
                return true;
            }else{
                return false;
            }
        }

    }

    public getTipoValorEvaluado(tree:Arbol,table:tablaSimbolos){
        if (this.valorEvaluado instanceof Primitivo){
            return this.valorEvaluado.getTipo().getTipos();
        }else if (this.tipo.getTipos()===tipo.tipos.DEFAULT){
            return tipo.tipos.DEFAULT;
        }else{
            var ex:Excepcion = new Excepcion("Semantico", "Valor incorrecto en sentencia Case.", this.linea, this.columna);
            tree.getExcepciones().push(ex);
            return ex; 
        }
      
    }

    public setValorAevaluar(valorAevaluar:any){
        this.valorAevaluar = valorAevaluar;
    }

    public setPasada(pasada:number){
        this.pasada = pasada;
    }



}
