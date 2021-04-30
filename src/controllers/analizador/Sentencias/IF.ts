import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo from "../tablaSimbolos/Tipo";
import Excepcion from "../Excepciones/Excepcion";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
import Relacional from "../Expresiones/Relacional";
import Logica from "../Expresiones/Logica";
import Identificador from "../Expresiones/Identificador";
import BREAK from "./BREAK";
import CONTINUE from "./CONTINUE";
import RETURN from "./RETURN";
var Errors:Array<Excepcion> = new Array<Excepcion>();

const tipo = require('../tablaSimbolos/Tipo');

export default class IF extends Instruccion{
    private condicion:any;
    private instrucciones:any;
    private sino: Array<any>|any;



    public getNodoInstruccion(){
        let nodo:nodoInstruccion = new nodoInstruccion("INSTRUCCION");
        let nodo2:nodoInstruccion = new nodoInstruccion("SENTENCIA_IF");
        let nodo3:nodoInstruccion = new nodoInstruccion("CONDICION");
        let nodo4:nodoInstruccion = new nodoInstruccion("INSTRUCCION");
        let nodo5:nodoInstruccion = new nodoInstruccion("SENTENCIA_ELSE_IF");
        let temp:any;
        if (this.tipo.getTipos()==52){
            nodo2.agregarHijoCadena("IF");
            nodo2.agregarHijoCadena("(");
            nodo3.agregarHijoNodo(this.condicion.getNodoInstruccion());
            nodo2.agregarHijoNodo(nodo3);
            nodo2.agregarHijoCadena(")");
            nodo2.agregarHijoCadena("{");
            if (this.instrucciones!=null){
                for (let instruccion of this.instrucciones){
                    temp = instruccion;
                    nodo4.agregarHijoNodo(temp.getNodoInstruccion());
                }
                nodo2.agregarHijoNodo(nodo4);
            }
            nodo2.agregarHijoCadena("}");
            if (this.sino != null){
                for(let elemento of this.sino){
                    //nodo2 = new nodoInstruccion("INSTRUCCION");
                    nodo2.agregarHijoNodo(elemento.getNodoInstruccion());
                    //nodo.agregarHijoNodo(nodo2);
                }
            }
            nodo.agregarHijoNodo(nodo2);
        }else{
            nodo5.agregarHijoCadena("ELSE_IF");
            nodo5.agregarHijoCadena("(");
            nodo3.agregarHijoNodo(this.condicion.getNodoInstruccion());
            nodo5.agregarHijoNodo(nodo3);
            nodo5.agregarHijoCadena(")");
            nodo5.agregarHijoCadena("{");
            if (this.instrucciones!=null){
                for (let instruccion of this.instrucciones){
                    temp = instruccion;
                    nodo4.agregarHijoNodo(temp.getNodoInstruccion());
                }
                nodo5.agregarHijoNodo(nodo4);
            }
            nodo5.agregarHijoCadena("}");
            //nodo.agregarHijoNodo(nodo5)
            return nodo5;
        }          
        return nodo;
    }


    constructor(tipo:Tipo, linea:number, columna:number, condicion:any,instrucciones:any,sino?:any) {
        super(tipo, linea, columna);
        this.condicion = condicion;
        if (instrucciones!=null){
            this.instrucciones = instrucciones;
        }else{
            this.instrucciones = null;
        }
        if (sino !=null){
            this.sino = new Array();
            while (sino.length>0){
                this.sino.push(sino.shift());
            }
            sino = [];
        }else{
            this.sino = null;
        }
    }


    public interpretar(tree:Arbol, table:tablaSimbolos){
        if (this.pasada<2){
            return true;
        }
        var estadoCondicion = this.verificarCondicion(tree,table);
        if (estadoCondicion instanceof Excepcion){
            return estadoCondicion;
        }
            if (estadoCondicion.getValor()===true){
                //Con instrucciones, pero sin if else o else
                let nArbol:Arbol = new Arbol(this.instrucciones);
                let nTabla:tablaSimbolos = new tablaSimbolos(3,table);
                table.addSiguiente(nTabla);
                tree.addSiguiente(nArbol);
                var instruccionesEliminar:number[] = [];
                if (this.instrucciones===null){
                    return true;
                }
                try{
                    for (let m of nArbol.getInstrucciones()){
                        m.setPasada(2);
                        if(m instanceof Excepcion){ // ERRORES SINTACTICOS
                            Errors.push(m);
                            nArbol.addError(m);
                            nArbol.updateConsola((<Excepcion>m).toString());
                            //let lista:Array<Instruccion>= nArbol.getInstrucciones(); //Buscar index de instrucciones con errores
                            //let index: number = lista.findIndex(lista => lista === m);
                            //if (index != -1) {
                            //    instruccionesEliminar.push(index);
                                //ast.getInstrucciones().splice(index, 1);
                            //}
                            continue;
                        }
                        var result = m.interpretar(nArbol, nTabla);
                        if(result instanceof Excepcion){ // ERRORES SEMÁNTICOS
                            //Errors.push(result);
                            //nArbol.addError(result);
                            //nArbol.updateConsola((<Excepcion>result).toString());
                            return result;
                        } 
                        if (result instanceof BREAK){
                            return result;
                        }      
                        if (result instanceof CONTINUE){
                            return result;
                        }
                        if (result instanceof RETURN){
                            return result;
                        }    
                    }                         
                    let corrimiento:number = 0;
                    /*
                    for (let index of instruccionesEliminar){
                        index -= corrimiento;
                        nArbol.getInstrucciones().splice(index, 1); //Eliminar instrucciones con errores
                        corrimiento++;
                    }     
                    */              
                }catch(err){
                    console.log(err);
                }
                return true;
            }else{
                //Con instrucciones y también con if else o else
                if (this.sino!=null){
                    for (let m of this.sino){
                        m.setPasada(2);
                        var r = m.interpretar(tree,table);                      
                        if (r instanceof Excepcion){
                            return r;
                        }
                        if (r===true){
                            return true;
                        }
                    }

                }
            }
        return false;
        //Verificar la condicion
    }


    public verificarCondicion(tree:Arbol, table:tablaSimbolos){
        if (this.condicion instanceof Relacional || this.condicion instanceof Logica ){
            var r = this.condicion.interpretar(tree, table); //Devuelve un primitivo booleano
            return r; //Si es relacion o lógica solo la retorna
        }else if (this.condicion.getTipo().getTipos() === tipo.tipos.BOOLEANO){
            return this.condicion; //Devuelve el primitivo booleano
        }else if (this.condicion instanceof Identificador){
            var resultado = table.existe(this.condicion.getValor()); //Verificar si existe y retorna un simbolo
            if (resultado !=null){
                if (resultado.getTipo().getTipos()===tipo.tipos.BOOLEANO){
                    return resultado.getValor(); //Devuelve el primitivo booleano
                }else{ //No es booleana
                    var ex:Excepcion = new Excepcion("Semantico", "El tipo de la variable es incorrecto.", this.linea, this.columna);
                    //tree.getExcepciones().push(ex);
                    return ex; 
                }
            }else{ //No existe
                var ex:Excepcion = new Excepcion("Semantico", "La variable no existe", this.linea, this.columna);
                //tree.getExcepciones().push(ex);
                return ex; 
            }

        }else{ //No es relacional ni logica ni identificador
            var ex:Excepcion = new Excepcion("Semantico", "Condición con resultado no booleano.", this.linea, this.columna);
            //tree.getExcepciones().push(ex);
            return ex;             
        }
    }
}
