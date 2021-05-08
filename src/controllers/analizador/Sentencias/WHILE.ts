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

export default class WHILE extends Instruccion{
    private condicion:any;
    private instrucciones:any;



    public getNodoInstruccion(){
        let nodo:nodoInstruccion = new nodoInstruccion("INSTRUCCION");
        let nodo2:nodoInstruccion = new nodoInstruccion("SENTENCIA_WHILE");
        let nodo3:nodoInstruccion = new nodoInstruccion("CONDICION");
        let nodo4:nodoInstruccion = new nodoInstruccion("INSTRUCCION");
        let temp:any;
        if (this.tipo.getTipos()==55){
            nodo2.agregarHijoCadena("WHILE");
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
            nodo.agregarHijoNodo(nodo2);
        }         
        return nodo;
    }


    constructor(tipo:Tipo, linea:number, columna:number, condicion:any,instrucciones:any) {
        super(tipo, linea, columna);
        this.condicion = condicion;
        if (instrucciones!=null){
            this.instrucciones = instrucciones;
        }else{
            this.instrucciones = null;
        }
    }


    public interpretar(tree:Arbol, table:tablaSimbolos){
        if (this.pasada<2){
            return true;
        }
        var estadoCondicion = this.verificarCondicion(tree,table); //Devuelve un primitivo booleano
        if (estadoCondicion instanceof Excepcion){
            return estadoCondicion;
        }
            if (estadoCondicion.getValor()===true){
                //Con instrucciones y condición true
                //Crear nuevo enterno
                let nArbol:Arbol = new Arbol(this.instrucciones);
                
                tree.addSiguiente(nArbol);
                while (estadoCondicion.getValor() ===true){
                    let nTabla:tablaSimbolos = new tablaSimbolos(3,table);
                    table.addSiguiente(nTabla);
                    nTabla.setNombre(table.getNombre()+"\n"+"While");
                    try{
                        for (let m of nArbol.getInstrucciones()){
                            if(m instanceof Excepcion){ // ERRORES SINTACTICOS
                                //Errors.push(m);
                                nArbol.addError(m);
                                nArbol.updateConsola((<Excepcion>m).toString());
                                continue;
                            }
                            m.setPasada(2);
                            var result = m.interpretar(nArbol, nTabla);
                            if(result instanceof Excepcion){ // ERRORES SEMÁNTICOS
                                //Errors.push(result);
                                //nArbol.addError(result);
                                //nArbol.updateConsola((<Excepcion>result).toString());
                                return result;
    
                            }   
                            if (result instanceof BREAK){
                                return true;
                            }       
                            if (result instanceof CONTINUE){
                                break;;
                            }
                            if (result instanceof RETURN){
                                return result;
                            }    
                        }                                       
                    }catch(err){
                        console.log(err);
                        return false;
                    }                    
                    //Revisar como sigue la condición
                    estadoCondicion = this.verificarCondicion(nArbol,nTabla); //Devuelve un primitivo booleano
                    /*
                    if (estadoCondicion.getValor() ===true){
                        //Crear nueva tabla
                        let nTabla:tablaSimbolos = new tablaSimbolos(3,table);
                        table.addSiguiente(nTabla);
                    }
                    */
                }


            }else{
                //Condición fue falsa y terminó el ciclo while
                return true;
            }
            return true;
    }


    public verificarCondicion(tree:Arbol, table:tablaSimbolos){
        if (this.condicion instanceof Relacional || this.condicion instanceof Logica 
            || this.condicion.getTipo().getTipos() === tipo.tipos.BOOLEANO){
            var r = this.condicion.interpretar(tree, table); 
            //Devuelve un primitivo
            return r; //Si es relacion o lógica solo la retorna
        }else if (this.condicion instanceof Identificador){
            var resultado = table.existe(this.condicion.getValor()); //Verificar si existe y retorna un simbolo
            if (resultado !=null){
                if (resultado.getTipo().getTipos()===tipo.tipos.BOOLEANO){
                    return resultado.getValor(); //Devuelve un primitivo
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

    public buscarReturn(){
        let resultado:any = false;
        let temp = false;
        for (let m of this.instrucciones){
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
