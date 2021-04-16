import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo from "../tablaSimbolos/Tipo";
import Excepcion from "../Excepciones/Excepcion";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
import Relacional from "../Expresiones/Relacional";
import Logica from "../Expresiones/Logica";
import Identificador from "../Expresiones/Identificador";
var Errors:Array<Excepcion> = new Array<Excepcion>();

const tipo = require('../tablaSimbolos/Tipo');

export default class IF extends Instruccion{
    private condicion:any;
    private instrucciones:any;
    private sino: Array<any>|any;



    public getNodoInstruccion():nodoInstruccion{
        let nodo:nodoInstruccion = new nodoInstruccion('IF');
        return nodo;
    }


    constructor(tipo:Tipo, linea:Number, columna:Number, condicion:any,instrucciones?:any,sino?:any) {
        super(tipo, linea, columna);
        this.condicion = condicion;
        if (instrucciones!=null){
            this.instrucciones = instrucciones;
        }else{
            this.instrucciones = null;
        }
        if (sino !=null){
            this.sino = sino;
        }else{
            this.sino = null;
        }
    }


    public interpretar(tree:Arbol, table:tablaSimbolos){
        var estadoCondicion = this.verificarCondicion(tree,table);
        if (estadoCondicion instanceof Excepcion){
            return estadoCondicion;
        }

        if (this.instrucciones!=null){ //Verificar si viene vacia
            //Sí trae instrucciones
            if (estadoCondicion===true){
                //Con instrucciones, pero sin if else o else
                let nArbol:Arbol = new Arbol(this.instrucciones);
                let nTabla:tablaSimbolos = new tablaSimbolos(3,table);
                table.addSiguiente(nTabla);
                tree.addSiguiente(nArbol);
                var instruccionesEliminar:number[] = [];

                try{
                    for (let m of nArbol.getInstrucciones()){
                        m.setPasada(2);
                        if(m instanceof Excepcion){ // ERRORES SINTACTICOS
                            Errors.push(m);
                            nArbol.addError(m);
                            nArbol.updateConsola((<Excepcion>m).toString());
                            let lista:Array<Instruccion>= nArbol.getInstrucciones(); //Buscar index de instrucciones con errores
                            let index: number = lista.findIndex(lista => lista === m);
                            if (index != -1) {
                                instruccionesEliminar.push(index);
                                //ast.getInstrucciones().splice(index, 1);
                            }
                        }
                        var result = m.interpretar(nArbol, nTabla);
                        if(result instanceof Excepcion){ // ERRORES SINTACTICOS
                            Errors.push(result);
                            nArbol.addError(result);
                            nArbol.updateConsola((<Excepcion>result).toString());
                            let lista:Array<Instruccion>= nArbol.getInstrucciones(); //Buscar index de instrucciones con errores
                            let index: number = lista.findIndex(lista => lista === m);
                            if (index != -1) {
                                instruccionesEliminar.push(index);
                                //ast.getInstrucciones().splice(index, 1);
                            }
                        }                    
                    }                         
                    let corrimiento:number = 0;
                    for (let index of instruccionesEliminar){
                        index -= corrimiento;
                        nArbol.getInstrucciones().splice(index, 1); //Eliminar instrucciones con errores
                        corrimiento++;
                    }                   
                }catch(err){
                    console.log(err);
                }
                return true;
            }else{
                //Con instrucciones y también con if else o else
                if (this.sino!=null){
                    for (let m of this.sino){
                        var r = m.interpretar(tree,table);
                        if (r instanceof Excepcion){
                            var eliminar = m;
                            while(true){
                                eliminar = this.sino.pop();
                            }
                            return r;
                        }
                    }

                }
            }
        }else{
            if (this.sino!=null){
                for (let m of this.sino){
                    var r = m.interpretar(tree,table);
                }
            }
        }
        return true;
        //Verificar la condicion


    }


    public verificarCondicion(tree:Arbol, table:tablaSimbolos){
        if (this.condicion instanceof Relacional || this.condicion instanceof Logica){
            var r = this.condicion.interpretar(tree, table);
            return this.condicion; //Si es relacion o lógica solo la retorna
        }else if (this.condicion instanceof Identificador){
            var resultado = table.existe(this.condicion.getValor()); //Verificar si existe y retorna un simbolo
            if (resultado !=null){
                if (resultado.getTipo().getTipos()===tipo.tipos.BOOLEANO){
                    return resultado.getValor();
                }else{ //No es booleana
                    var ex:Excepcion = new Excepcion("Semantico", "El tipo de la variable es incorrecto.", this.linea, this.columna);
                    tree.getExcepciones().push(ex);
                    return ex; 
                }
            }else{ //No existe
                var ex:Excepcion = new Excepcion("Semantico", "La variable no existe", this.linea, this.columna);
                tree.getExcepciones().push(ex);
                return ex; 
            }

        }else{ //No es relacional ni logica ni identificador
            var ex:Excepcion = new Excepcion("Semantico", "Condición con resultado no booleano.", this.linea, this.columna);
            tree.getExcepciones().push(ex);
            return ex;             
        }
    }
}
