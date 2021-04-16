import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo,{ tipos } from "../tablaSimbolos/Tipo";
import Excepcion from "../Excepciones/Excepcion";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
import Aritmetica from "./Aritmetica";
import Relacional from "./Relacional";
import Logica from "./Logica";
import Primitivo from "./Primitivo";
import Vector from "./Vector";
import Lista from "./Lista";
import Simbolo from "../tablaSimbolos/Simbolo";
import Identificador from "./Identificador";
import Asignacion from "./Asignacion";
import ToCharArray from "../Instrucciones/toCharArray";
const tipo = require('../tablaSimbolos/Tipo');
const vector = require('../Expresiones/Vector');
const lista = require('../Expresiones/Lista');
export default class Declaracion extends Instruccion{

    private id:Identificador;
    private valor:any;
    private asignacion:any;
    private asignacionTipo:any;

    constructor(id:Identificador,tipo:Tipo, linea : Number, columna:Number, valor?:any){
        super(tipo,linea,columna);
        this.id = id;
        if(valor){
            if (valor instanceof Asignacion){
                this.asignacion = valor;
                this.valor = valor.getInstruccion();
            }else if(valor instanceof ToCharArray){
                this.asignacion = valor;
                this.valor = new lista.default();
            }else{
                this.valor = valor;
            }
            
        }else{
            this.valor = null;
        }
    }


    public getNodoInstruccion():nodoInstruccion{
        let nodo:nodoInstruccion = new nodoInstruccion('DECLARACIÓN');
        if (this.valor){

            if (this.valor instanceof Vector){
                nodo.agregarHijoNodo(this.valor.getNodoInstruccion());
            }else if (this.valor instanceof Lista){
                nodo.agregarHijoNodo(this.valor.getNodoInstruccion());
            }       
            else{

                let nodo2:nodoInstruccion = new nodoInstruccion('VARIABLE');
                nodo2.agregarHijoNodo(this.tipo.getNodoInstruccion());
                nodo2.agregarHijoNodo(this.id.getNodoInstruccion());
                nodo2.agregarHijoCadena("=");
                nodo2.agregarHijoNodo(this.valor.getNodoInstruccion());
                nodo2.agregarHijoCadena(";");
                nodo.agregarHijoNodo(nodo2);
            }
        }else{

            if (this.valor instanceof Vector){
                nodo.agregarHijoNodo(this.valor.getNodoInstruccion());
            }else if (this.valor instanceof Lista){
                nodo.agregarHijoNodo(this.valor.getNodoInstruccion());
            }  
            else
            {
            let nodo2:nodoInstruccion = new nodoInstruccion('VARIABLE');
            nodo2.agregarHijoNodo(this.tipo.getNodoInstruccion());
            nodo2.agregarHijoNodo(this.id.getNodoInstruccion());
            nodo2.agregarHijoCadena(";");
            nodo.agregarHijoNodo(nodo2);
            }
        }
        return nodo;
    }


    public interpretar(tree:Arbol, table:tablaSimbolos){
        let valorFinal:any = null;

        //Verificar que la variable ya existe en el ámbito local
        if (table.tabla.has(this.id.getValor()) && this.pasada != 1){
            var ex:Excepcion = new Excepcion("Semántico", "Error, la variable ya existe", this.linea, this.columna);
            tree.getExcepciones().push(ex);
            return ex;
        }
        if (this.pasada ===0){ //Solo crear el símbolo en la tabla
            let nuevoSimbolo:any;
            if (this.tipo.getTipos()===tipo.tipos.ENTERO){
                nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.ENTERO),this.id.getValor(),0);
            }else if (this.tipo.getTipos()===tipo.tipos.CADENA){
                nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.CADENA),this.id.getValor(),"");
            }else if (this.tipo.getTipos()===tipo.tipos.DECIMAL){
                nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.DECIMAL),this.id.getValor(),parseFloat("0.0"));
            }else if (this.tipo.getTipos()===tipo.tipos.BOOLEANO){
                nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.BOOLEANO),this.id.getValor(),true);
            }else if (this.tipo.getTipos()===tipo.tipos.CARACTER){
                nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.CARACTER),this.id.getValor(),'\u0000');
            }else if (this.tipo.getTipos()===tipo.tipos.VECTOR){
                nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.VECTOR),this.id.getValor(),null);
            }else if (this.tipo.getTipos()===tipo.tipos.LISTA){

                nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.LISTA),this.id.getValor(),null);
            }
            table.setVariableNueva(nuevoSimbolo);
            return true;

        }else if (this.pasada ===1){ //Asignar valores
            if (this.valor){
                if (this.valor.getTipo().getTipos()    != tipo.tipos.LENGTH
                    && this.valor.getTipo().getTipos() != tipo.tipos.TRUNCATE
                    && this.valor.getTipo().getTipos() != tipo.tipos.ROUND
                    &&this.valor.getTipo().getTipos()  != tipo.tipos.TO_STRING
                    &&this.valor.getTipo().getTipos()  != tipo.tipos.TO_CHAR_ARRAY
                    &&this.valor.getTipo().getTipos()  != tipo.tipos.TYPEOF){
                    valorFinal = this.valor.interpretar(tree,table);                         
                    var verificarTipo = this.verificacionTipos(valorFinal,tree, table);
                    if (verificarTipo instanceof Excepcion){
                        table.tabla.delete(this.id.getValor()); //La elimino de la tabla de símbolos
                        return verificarTipo; //Retorno el error
                    }else{
                        //Si la verificación de tipos esta bien entonces asigna el valor
                        let simbolo:any = table.tabla.get(this.id.getValor()); //Get el símbolo de la tabla
                        simbolo.setValor(valorFinal); //Actualizar valor del símbolo en la tabla
                        return true;
                    }   
                }else if (this.valor.getTipo().getTipos() === tipo.tipos.LENGTH
                        ||this.valor.getTipo().getTipos() === tipo.tipos.TRUNCATE 
                        ||this.valor.getTipo().getTipos() === tipo.tipos.ROUND
                        ||this.valor.getTipo().getTipos() === tipo.tipos.TO_STRING
                        ||this.valor.getTipo().getTipos() === tipo.tipos.TO_CHAR_ARRAY
                        ||this.valor.getTipo().getTipos() === tipo.tipos.TYPEOF){
                    this.asignacion.setPasada(1);
                    return this.asignacion.interpretar(tree,table);
                }
       
            }else{
                //Se queda igual sin cambios en la tabla
                return true;
            }
        }else{ //Ámbitos locales todavía no esta bien construida
            if (this.valor){
                let nuevoSimbolo:any;
                valorFinal = this.valor.interpretar(tree,table); //Get valor
                nuevoSimbolo = new Simbolo(new tipo.default(this.tipo.getTipos()),this.id.getValor(),valorFinal);
                table.setVariableNueva(nuevoSimbolo); 
                return true;
            }else{
                let nuevoSimbolo:any;
                if (this.tipo.getTipos()===tipo.tipos.ENTERO){
                    nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.ENTERO),this.id.getValor(),0);
                }else if (this.tipo.getTipos()===tipo.tipos.CADENA){
                    nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.CADENA),this.id.getValor(),"");
                }else if (this.tipo.getTipos()===tipo.tipos.DECIMAL){
                    nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.DECIMAL),this.id.getValor(),parseFloat("0.0"));
                }else if (this.tipo.getTipos()===tipo.tipos.BOOLEANO){
                    nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.BOOLEANO),this.id.getValor(),true);
                }else if (this.tipo.getTipos()===tipo.tipos.CARACTER){
                    nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.CARACTER),this.id.getValor(),'\u0000');
                }else if (this.tipo.getTipos()===tipo.tipos.VECTOR){
                    nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.VECTOR),this.id.getValor(),null);
                }else if (this.tipo.getTipos()===tipo.tipos.LISTA){
                    nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.LISTA),this.id.getValor(),null);
                }
                table.setVariableNueva(nuevoSimbolo);  
                return true;              
            }

        }
    }


    public verificacionTipos(valorFinal:any,tree:Arbol, table:tablaSimbolos){

        if (valorFinal instanceof Excepcion){
            var ex:Excepcion = new Excepcion("Semántico", "Error en la creación de la variable", this.linea, this.columna);
            tree.getExcepciones().push(ex);
            return ex;
        }
        else if(this.valor instanceof Primitivo){

                if (this.tipo.getTipos()!= this.valor.getTipo().getTipos()){
                    var ex:Excepcion = new Excepcion("Semantico", "Error en la asignación del tipo.", this.linea, this.columna);
                    tree.getExcepciones().push(ex);
                    return ex;                            
                }else{
                    //this.valor = valorFinal;
                    return valorFinal;
                }
            }
        else if (this.valor instanceof Vector){
            if (this.valor.getTipo().getTipos()!= this.valor.getTipoCreacion().getTipos()){
                //El valor esta mal
                var ex:Excepcion = new Excepcion("Semantico", "Error en la asignación del tipo.", this.linea, this.columna);
                tree.getExcepciones().push(ex);
                return ex;                 
            }else{
                let copiarLista:Array<any> = new Array();
                var valor;
                var size = this.valor.getSize();
                let copiaVector;
                var id = new Identificador(new tipo.default(tipo.tipos.IDENTIFICADOR),this.valor.getId().getValor(),0,0);
                var Tipo = new tipo.default(this.getTipo().getTipos());
                if (this.valor.getValor()[0]){
                    for (let elemento of this.valor.getValor()){
                        valor = elemento.interpretar(tree,table);
                        copiarLista.push(valor);
                    }
                    copiaVector = new vector.default(Tipo,0,0,id,size,Tipo,copiarLista);
                }else{
                    copiaVector = new vector.default(Tipo,0,0,id,size,Tipo,null);
                }        
                
                //this.valor 
                return copiaVector;
            }
        }else if (this.valor instanceof Lista){
            if (this.valor.getTipo().getTipos()!= this.valor.getTipoCreacion().getTipos()){
                //El valor esta mal
                var ex:Excepcion = new Excepcion("Semantico", "Error en la asignación del tipo.", this.linea, this.columna);
                tree.getExcepciones().push(ex);
                return ex; 
            }else{
                return this.valor;
            }             
        }
        return false;
    }
}
