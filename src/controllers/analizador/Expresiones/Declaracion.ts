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
import Casteo from "../Instrucciones/Casteo";
import Funcion from "../Expresiones/Funcion";
import Metodo from "../Expresiones/Metodo";
const tipo = require('../tablaSimbolos/Tipo');
const vector = require('../Expresiones/Vector');
const lista = require('../Expresiones/Lista');
const primitivo = require('../Expresiones/Primitivo');
export default class Declaracion extends Instruccion{

    private id:Identificador;
    private valor:any;
    private asignacion:any;
    private valor2:any;

    constructor(id:Identificador,tipo:Tipo, linea : number, columna:number, valor?:any,valor2?:any){
        //Para el tochararray valor2 trae la lista
        super(tipo,linea,columna);
        this.id = id;
        if(valor){
            if (valor instanceof Asignacion){
                this.asignacion = valor;
                this.valor = valor.getInstruccion();
                if (this.valor instanceof ToCharArray){
                    this.valor2 = valor2;
                }
            }
            else{
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
            }else if (this.valor instanceof ToCharArray){
                let nodo2:nodoInstruccion = new nodoInstruccion('VARIABLE');
                let lista = <Lista>this.valor2;
                nodo2.agregarHijoCadena("list");
                nodo2.agregarHijoCadena("<");
                nodo2.agregarHijoNodo(lista.getTipo().getNodoInstruccion());
                nodo2.agregarHijoCadena(">");                
                nodo2.agregarHijoNodo(this.id.getNodoInstruccion());   
                nodo2.agregarHijoCadena("=");
                nodo2.agregarHijoNodo(this.valor.getNodoInstruccion());
                nodo2.agregarHijoCadena(";");
                nodo.agregarHijoNodo(nodo2);                       
            }else if (this.valor instanceof Funcion){
                nodo.agregarHijoNodo(this.valor.getNodoInstruccion());         
            }else if (this.valor instanceof Metodo){
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
        if (this.pasada > 1 && this.ambito ===0){
            return true;
        }
        //Verificar que la variable ya existe en el ámbito local
        if (table.tabla.has(this.id.getValor()) && this.pasada != 1){
            var ex:Excepcion = new Excepcion("Semántico", "Error, la variable ya existe", this.linea, this.columna);
            tree.getExcepciones().push(ex);
            return ex;
        }
        if (this.pasada ===0){ //Solo crear el símbolo en la tabla
            this.setAmbito(0);
            let nuevoSimbolo:any;
            if (this.valor instanceof Funcion || this.valor instanceof Metodo){
                let id = this.valor.getId(); //Get id en string de la función
                let nTipo = new tipo.default(this.valor.getTipo());
                if (this.valor instanceof Metodo){
                    nTipo = new tipo.default(67);
                }
                nuevoSimbolo = new Simbolo(nTipo,id,this.valor);
            }
            else if (this.tipo.getTipos()===tipo.tipos.ENTERO){
                nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.ENTERO),this.id.getValor(),null);
            }else if (this.tipo.getTipos()===tipo.tipos.CADENA){
                nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.CADENA),this.id.getValor(),null);
            }else if (this.tipo.getTipos()===tipo.tipos.DECIMAL){
                nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.DECIMAL),this.id.getValor(),null);
            }else if (this.tipo.getTipos()===tipo.tipos.BOOLEANO){
                nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.BOOLEANO),this.id.getValor(),null);
            }else if (this.tipo.getTipos()===tipo.tipos.CARACTER){
                nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.CARACTER),this.id.getValor(),null);
            }else if (this.tipo.getTipos()===tipo.tipos.VECTOR){
                let v:Vector = this.valor;
                let tipoA = v.getTipo();
                let tipoCreacion = v.getTipoCreacion();
                if (tipoA.getTipos()!= tipoCreacion.getTipos()){
                    var ex:Excepcion = new Excepcion("Semántico", "Los tipos no coinciden.", this.linea, this.columna);
                    tree.getExcepciones().push(ex);
                    return ex;                        
                }            
                nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.VECTOR),this.id.getValor(),null);
            }else if (this.tipo.getTipos()===tipo.tipos.LISTA){
                if (this.valor2 != null){ //Si viene tocharArray
                    let list:Lista = this.valor2; 
                    let id = list.getId();
                    let tipoA = list.getTipo();
                    let tipoCreacion = list.getTipoCreacion();
                    if (tipoA.getTipos()!= tipoCreacion.getTipos()){
                        var ex:Excepcion = new Excepcion("Semántico", "Los tipos no coinciden.", this.linea, this.columna);
                        tree.getExcepciones().push(ex);
                        return ex;                        
                    }
                    //let listaNull:Lista = new lista.default(tipoA,0,0,id,tipoCreacion);
                    //listaNull.setValor(null);            
                    nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.LISTA),id.getValor(),null);
                }else{ //Solo viene asignación normal de lista
                    let list:Lista = this.valor; 
                    let id = list.getId();
                    let tipoA = list.getTipo();
                    let tipoCreacion = list.getTipoCreacion();
                    if (tipoA.getTipos()!= tipoCreacion.getTipos()){
                        var ex:Excepcion = new Excepcion("Semántico", "Los tipos no coinciden.", this.linea, this.columna);
                        tree.getExcepciones().push(ex);
                        return ex;                        
                    }
                    //let listaNull:Lista = new lista.default(tipoA,0,0,id,tipoCreacion);
                    //listaNull.setValor(null);            
                    nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.LISTA),id.getValor(),null);                    
                }

            }
            table.setVariableNueva(nuevoSimbolo);
            return true;

        }else if (this.pasada ===1){ //Asignar valores
            if (this.valor){
                if (this.valor instanceof Funcion || this.valor instanceof Metodo){
                    return true;
                }else
                if (this.valor.getTipo().getTipos()    != tipo.tipos.LENGTH
                    && this.valor.getTipo().getTipos() != tipo.tipos.TRUNCATE
                    && this.valor.getTipo().getTipos() != tipo.tipos.ROUND
                    &&this.valor.getTipo().getTipos()  != tipo.tipos.TO_STRING
                    &&this.valor.getTipo().getTipos()  != tipo.tipos.TO_CHAR_ARRAY
                    &&this.valor.getTipo().getTipos()  != tipo.tipos.TYPEOF){
                    //valorFinal = this.valor.interpretar(tree,table);                         
                    var verificarTipo = this.verificacionTipos(this.valor,tree, table);
                    if (verificarTipo instanceof Excepcion){
                        table.tabla.delete(this.id.getValor()); //La elimino de la tabla de símbolos
                        return verificarTipo; //Retorno el error
                    }else{
                        //Si la verificación de tipos esta bien entonces asigna el valor
                        let simbolo:any = table.tabla.get(this.id.getValor()); //Get el símbolo de la tabla
                        simbolo.setValor(verificarTipo); //Actualizar valor del símbolo en la tabla
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
                //Valores por defecto
                let simbolo:any = <Simbolo>table.tabla.get(this.id.getValor());
                if (this.tipo.getTipos()===tipo.tipos.ENTERO){
                    let nTipo = new Tipo(tipo.tipos.ENTERO);
                    let nValor = 0;
                    let resultado:Primitivo = new primitivo.default(nTipo,nValor,this.linea,this.columna);
                    simbolo.setValor(resultado);
                }else if (this.tipo.getTipos()===tipo.tipos.CADENA){
                    let nTipo = new Tipo(tipo.tipos.CADENA);
                    let nValor = "";
                    let resultado:Primitivo = new primitivo.default(nTipo,nValor,this.linea,this.columna);
                    simbolo.setValor(resultado);
                }else if (this.tipo.getTipos()===tipo.tipos.DECIMAL){
                    let nTipo = new Tipo(tipo.tipos.DECIMAL);
                    let nValor = 0;
                    let resultado:Primitivo = new primitivo.default(nTipo,nValor,this.linea,this.columna);
                    simbolo.setValor(resultado);
                }else if (this.tipo.getTipos()===tipo.tipos.BOOLEANO){
                    let nTipo = new Tipo(tipo.tipos.BOOLEANO);
                    let nValor = true;
                    let resultado:Primitivo = new primitivo.default(nTipo,nValor,this.linea,this.columna);
                    simbolo.setValor(resultado);
                }else if (this.tipo.getTipos()===tipo.tipos.CARACTER){
                    let nTipo = new Tipo(tipo.tipos.CARACTER);
                    let nValor = '\u0000';
                    let resultado:Primitivo = new primitivo.default(nTipo,nValor,this.linea,this.columna);
                    simbolo.setValor(resultado);
                }               
                return true;
            }

            /////////////////////////////////////////////////////////////////////////////////////////////
        }else if (this.pasada > 1 && this.ambito != 0){ //Ámbitos locales todavía no esta bien construida
            if (this.valor){
                if (this.valor instanceof Funcion || this.valor instanceof Metodo){
                    var ex:Excepcion = new Excepcion("Semántico", "Métodos o funciones solo pueden ser declarados en el ámbito global.", this.linea, this.columna);
                    tree.getExcepciones().push(ex);
                    return ex;   
                }else
                if (this.valor.getTipo().getTipos()    != tipo.tipos.LENGTH
                    && this.valor.getTipo().getTipos() != tipo.tipos.TRUNCATE
                    && this.valor.getTipo().getTipos() != tipo.tipos.ROUND
                    &&this.valor.getTipo().getTipos()  != tipo.tipos.TO_STRING
                    &&this.valor.getTipo().getTipos()  != tipo.tipos.TO_CHAR_ARRAY
                    &&this.valor.getTipo().getTipos()  != tipo.tipos.TYPEOF){
                    //valorFinal = this.valor.interpretar(tree,table);                         
                    var verificarTipo = this.verificacionTipos(this.valor,tree, table);
                    if (verificarTipo instanceof Excepcion){
                        table.tabla.delete(this.id.getValor()); //La elimino de la tabla de símbolos
                        return verificarTipo; //Retorno el error
                    }else{
                        let nTipo = this.getNuevoTipo(verificarTipo);
                        let nuevoSimbolo = new Simbolo(new tipo.default(nTipo),this.id.getValor(),verificarTipo);
                        table.setVariableNueva(nuevoSimbolo);
                        //Si la verificación de tipos esta bien entonces asigna el valor
                        //let simbolo:any = table.tabla.get(this.id.getValor()); //Get el símbolo de la tabla
                        //simbolo.setValor(verificarTipo); //Actualizar valor del símbolo en la tabla
                        return true;
                    }   
                }else if (this.valor.getTipo().getTipos() === tipo.tipos.LENGTH
                        ||this.valor.getTipo().getTipos() === tipo.tipos.TRUNCATE 
                        ||this.valor.getTipo().getTipos() === tipo.tipos.ROUND
                        ||this.valor.getTipo().getTipos() === tipo.tipos.TO_STRING
                        ||this.valor.getTipo().getTipos() === tipo.tipos.TO_CHAR_ARRAY
                        ||this.valor.getTipo().getTipos() === tipo.tipos.TYPEOF){
                    //Crear símbolo
                 
                    let nuevoSimbolo:any;
                    if (this.tipo.getTipos()===tipo.tipos.ENTERO){
                        let nTipo = new Tipo(tipo.tipos.ENTERO);
                        let nValor = 0;
                        let resultado:Primitivo = new primitivo.default(nTipo,nValor,this.linea,this.columna);
                        nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.ENTERO),this.id.getValor(),resultado);
                    }else if (this.tipo.getTipos()===tipo.tipos.CADENA){
                        let nTipo = new Tipo(tipo.tipos.CADENA);
                        let nValor = "";
                        let resultado:Primitivo = new primitivo.default(nTipo,nValor,this.linea,this.columna);
                        nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.CADENA),this.id.getValor(),resultado);
                    }else if (this.tipo.getTipos()===tipo.tipos.DECIMAL){
                        let nTipo = new Tipo(tipo.tipos.DECIMAL);
                        let nValor = 0;
                        let resultado:Primitivo = new primitivo.default(nTipo,nValor,this.linea,this.columna);
                        nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.DECIMAL),this.id.getValor(),resultado);
                    }else if (this.tipo.getTipos()===tipo.tipos.BOOLEANO){
                        let nTipo = new Tipo(tipo.tipos.BOOLEANO);
                        let nValor = true;
                        let resultado:Primitivo = new primitivo.default(nTipo,nValor,this.linea,this.columna);
                        nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.BOOLEANO),this.id.getValor(),resultado);
                    }else if (this.tipo.getTipos()===tipo.tipos.CARACTER){
                        let nTipo = new Tipo(tipo.tipos.CARACTER);
                        let nValor = '\u0000';
                        let resultado:Primitivo = new primitivo.default(nTipo,nValor,this.linea,this.columna);
                        nuevoSimbolo = new Simbolo(new tipo.default(tipo.tipos.CARACTER),this.id.getValor(),resultado);
                    }else if (this.tipo.getTipos()===tipo.tipos.VECTOR){
                        let v:Vector = this.valor;
                        let tipoA = v.getTipo();
                        let tipoCreacion = v.getTipoCreacion();
                        if (tipoA.getTipos()!= tipoCreacion.getTipos()){
                            var ex:Excepcion = new Excepcion("Semántico", "Los tipos no coinciden.", this.linea, this.columna);
                            tree.getExcepciones().push(ex);
                            return ex;                        
                        }            
                        nuevoSimbolo = new Simbolo(new tipo.default(tipoCreacion.getTipos()),this.id.getValor(),v);
                    }else if (this.tipo.getTipos()===tipo.tipos.LISTA){
                        if (this.valor2 != null){ //Si viene tocharArray
                            let list:Lista = this.valor2; 
                            let id = list.getId();
                            let tipoA = list.getTipo();
                            let tipoCreacion = list.getTipoCreacion();
                            if (tipoA.getTipos()!= tipoCreacion.getTipos()){
                                var ex:Excepcion = new Excepcion("Semántico", "Los tipos no coinciden.", this.linea, this.columna);
                                tree.getExcepciones().push(ex);
                                return ex;                        
                            }
                            //let listaNull:Lista = new lista.default(tipoA,0,0,id,tipoCreacion);
                            //listaNull.setValor(null);            
                            nuevoSimbolo = new Simbolo(new tipo.default(tipoCreacion.getTipos()),id.getValor(),list);
                        }else{ //Solo viene asignación normal de lista
                            let list:Lista = this.valor; 
                            let id = list.getId();
                            let tipoA = list.getTipo();
                            let tipoCreacion = list.getTipoCreacion();
                            if (tipoA.getTipos()!= tipoCreacion.getTipos()){
                                var ex:Excepcion = new Excepcion("Semántico", "Los tipos no coinciden.", this.linea, this.columna);
                                tree.getExcepciones().push(ex);
                                return ex;                        
                            }
                            //let listaNull:Lista = new lista.default(tipoA,0,0,id,tipoCreacion);
                            //listaNull.setValor(null);            
                            nuevoSimbolo = new Simbolo(new tipo.default(tipoCreacion.getTipos()),id.getValor(),list);                    
                        }
        
                    }

                    var verificarTipo = this.verificacionTipos(this.valor,tree, table);
                    if (verificarTipo instanceof Excepcion){
                        table.tabla.delete(this.id.getValor()); //La elimino de la tabla de símbolos
                        return verificarTipo; //Retorno el error
                    }else{
                        let nTipo = this.getNuevoTipo(verificarTipo);
                        let nuevoSimbolo = new Simbolo(new tipo.default(nTipo),this.id.getValor(),verificarTipo);
                        table.setVariableNueva(nuevoSimbolo);
                        //Si la verificación de tipos esta bien entonces asigna el valor
                        //let simbolo:any = table.tabla.get(this.id.getValor()); //Get el símbolo de la tabla
                        //simbolo.setValor(verificarTipo); //Actualizar valor del símbolo en la tabla
                        return true;
                    }   


                    //Traer contenido
                    //this.asignacion.setPasada(1);
                    //return this.asignacion.interpretar(tree,table);
                    return true;
                }
       
            }else{
                //Valores por defecto
                let nTipo = this.tipo.getTipos();
                let nuevoSimbolo = new Simbolo(new tipo.default(nTipo),this.id.getValor(),"");
                table.setVariableNueva(nuevoSimbolo);
                if (this.tipo.getTipos()===tipo.tipos.ENTERO){
                    nuevoSimbolo.setValor(0);
                }else if (this.tipo.getTipos()===tipo.tipos.CADENA){
                    nuevoSimbolo.setValor("");
                }else if (this.tipo.getTipos()===tipo.tipos.DECIMAL){
                    nuevoSimbolo.setValor(parseFloat("0.0"));
                }else if (this.tipo.getTipos()===tipo.tipos.BOOLEANO){
                    nuevoSimbolo.setValor(true);
                }else if (this.tipo.getTipos()===tipo.tipos.CARACTER){
                    nuevoSimbolo.setValor('\u0000');
                }               
                return true;
            }

        }
        return true;
    }


    public verificacionTipos(valorFinal:any,tree:Arbol, table:tablaSimbolos){
        //Valor tipo puede ser primitivo, excepcion, vector, lista o id
        if (valorFinal instanceof Excepcion){
            var ex:Excepcion = new Excepcion("Semántico", "Error en la creación de la variable", this.linea, this.columna);
            tree.getExcepciones().push(ex);
            return ex;
        }
        else if(this.valor instanceof Primitivo){
                let especial:any = this.verificarEspeciales(valorFinal,tree,table);

                if (typeof especial != 'boolean'){
                    return especial;
                }else
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
        }else if (this.valor instanceof Identificador){
            let simbolo = table.tabla.get(this.valor.getValor()); //Símbolo que trae el valor a asignar
            if (simbolo){
                let especial:any = this.verificarEspeciales(valorFinal,tree,table);
                if (especial != false){
                    return especial;
                }else               
                if (this.tipo.getTipos()!= simbolo.getTipo().getTipos()){
                    var ex:Excepcion = new Excepcion("Semantico", "Error en la asignación del tipo.", this.linea, this.columna);
                    tree.getExcepciones().push(ex);
                    return ex;                 
                }
                if (simbolo.getValor()===null){
                    var ex:Excepcion = new Excepcion("Semantico", "Variable no declarada.", this.linea, this.columna);
                    tree.getExcepciones().push(ex);
                    return ex;                      
                }              
                return simbolo.getValor();
            }
        }else{
            var result = valorFinal.interpretar(tree,table);
            if (this.tipo.getTipos()=== tipo.tipos.ENTERO && (
                result.getTipo().getTipos()=== tipo.tipos.ENTERO
            ||  result.getTipo().getTipos()=== tipo.tipos.BOOLEANO)){
                if (result.getValor() < -2147483647 || result.getValor() > 2147483647){
                    var ex:Excepcion = new Excepcion("Semantico", "Número fuera de rango.", this.linea, this.columna);
                    tree.getExcepciones().push(ex);
                    return ex;                          
                }
                result.setTipo(tipo.tipos.ENTERO);
                return result;
            }else if(this.tipo.getTipos()=== tipo.tipos.DECIMAL && (
                result.getTipo().getTipos()=== tipo.tipos.DECIMAL
            ||  result.getTipo().getTipos()=== tipo.tipos.ENTERO      
            )){
                if (result.getValor() < -2147483647 || result.getValor() > 2147483647){
                    var ex:Excepcion = new Excepcion("Semantico", "Número fuera de rango.", this.linea, this.columna);
                    tree.getExcepciones().push(ex);
                    return ex;                          
                }
                result.setTipo(tipo.tipos.DECIMAL);
                return result;    
            }
            else if (this.tipo.getTipos()===result.getTipo().getTipos()){
                return result;
            }
            else{
                var ex:Excepcion = new Excepcion("Semántico", "Tipo incorrecto.", this.linea, this.columna);
                tree.getExcepciones().push(ex);
                return ex;
            }
        }
    }


    public verificarEspeciales(valorFinal:any,tree:Arbol, table:tablaSimbolos){

        if (this.tipo.getTipos()=== tipo.tipos.DECIMAL && this.valor.getTipo().getTipos()===tipo.tipos.ENTERO){
            let numero = valorFinal.interpretar(tree,table);
            if (numero > 2147483647 || numero < -2147483647){
                var ex:Excepcion = new Excepcion("Semántico", "Número fuera de límite", this.linea, this.columna);
                tree.getExcepciones().push(ex);
                return ex;                        
            }
            let nTipo = new Tipo(tipo.tipos.DECIMAL);
            let nValor = parseFloat(numero+".0");
            let resultado:Primitivo = new primitivo.default(nTipo,nValor,this.linea,this.columna);
            return resultado;
        }
        else
        if (this.tipo.getTipos()=== tipo.tipos.ENTERO && this.valor.getTipo().getTipos()===tipo.tipos.BOOLEANO){
            let booleano = this.valor.interpretar(tree,table);
            let nTipo = new Tipo(tipo.tipos.ENTERO);
            let resultado:Primitivo;
            if (booleano === true){             
                let nValor = 1
                resultado = new primitivo.default(nTipo,nValor,this.linea,this.columna);
                return resultado;
            }else{
                let nValor = 0
                resultado = new primitivo.default(nTipo,nValor,this.linea,this.columna);
                return resultado;
            }
        }
        else
        if (this.tipo.getTipos()=== tipo.tipos.ENTERO && this.valor.getTipo().getTipos()===tipo.tipos.ENTERO){
            let numero = valorFinal.interpretar(tree,table);
            if (numero> 2147483647 || numero < -2147483647){
                var ex:Excepcion = new Excepcion("Semántico", "Número fuera de límite", this.linea, this.columna);
                tree.getExcepciones().push(ex);
                return ex;                        
            }else{
                let nTipo = new Tipo(tipo.tipos.ENTERO);
                let nValor = numero;
                let resultado:Primitivo = new primitivo.default(nTipo,nValor,this.linea,this.columna);
                return resultado;
            }
        }else{
            return true;
        }
    }


    public getNuevoTipo(result:any){
        if (typeof result === 'string'){
            if (result.length>1){
                if (this.tipo.getTipos()===tipo.tipos.CARACTER){
                    return tipo.tipos.CARACTER;
                }
            }
            if (this.tipo.getTipos()===tipo.tipos.CADENA){
                return tipo.tipos.CADENA;
            }
        }else
        if (typeof result === 'number'){
            if (result%1 === 0){
                if (this.tipo.getTipos()===tipo.tipos.ENTERO ){
                    return tipo.tipos.ENTERO;
                }else if (this.tipo.getTipos()===tipo.tipos.DECIMAL){
                    return tipo.tipos.DECIMAL;
                }
            }else{
                if (this.tipo.getTipos()===tipo.tipos.DECIMAL){
                    return tipo.tipos.DECIMAL;
                }

            }
        }else if (typeof result ==='boolean'){
            if (this.tipo.getTipos()===tipo.tipos.BOOLEANO ){
                return tipo.tipos.BOOLEANO;
            }else if (this.tipo.getTipos()===tipo.tipos.ENTERO){
                return tipo.tipos.ENTERO;
            }
        }        
    }
}
