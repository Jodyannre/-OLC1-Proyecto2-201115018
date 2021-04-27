import { nodoInstruccion } from "../Abstract/nodoInstruccion";
const tipo = require('../tablaSimbolos/Tipo');
export default class Tipo
{
    private tipos: tipos;
    
    
    constructor(tipos: tipos){
        this.tipos = tipos;
    }

    public equals(obj: Tipo){
        return this.tipos == obj.tipos;
    }

    public getTipos():tipos
    {
        return this.tipos
    }

    public setTipo(tipo:any)
    {
        this.tipos = tipo;
    }

    public getNodoInstruccion(){
        let nodo:nodoInstruccion = new nodoInstruccion("TIPO");
        nodo.agregarHijoCadena(tipo.tipos[this.getTipos()]+"");
        return nodo;
    }
}

export enum tipos
{
    ENTERO = 1, 
    DECIMAL = 2,
    CARACTER = 3,
    BOOLEANO = 4,
    CADENA = 5,
    VECTOR = 6,
    LISTA = 7,
    VARIABLE = 8,
    SUMA = 9,
    RESTA = 10,
    MULTIPLICACION = 11,
    DIVISION = 12,
    MODULO = 13,
    POTENCIA = 14,
    NEGACION = 15,
    INCREMENTO = 16,
    DECREMENTO = 17,
    MAYOR = 18,
    MENOR = 19,
    IGUAL = 20,
    MAYOR_I = 21,
    MENOR_I = 22,
    DIFERENTE = 23,
    AND = 24,
    OR = 25,
    NOT = 26,
    FUNCION = 27,
    METODO = 28,
    IDENTIFICADOR = 29,
    DECLARACION = 30,
    TO_UPPER = 31,
    TO_LOWER = 32,
    LENGTH = 33,
    TRUNCATE = 34,
    TYPEOF = 35,
    TO_CHAR_ARRAY = 36,
    ROUND = 37,
    TO_STRING = 38,
    ACCESO_VECTOR = 50,
    ACCESO_LISTA = 51,
    IF = 52,
    ELSE = 53,
    ELSE_IF = 54,
    WHILE = 55,
    DO_WHILE = 56,
    CASE = 57,
    DEFAULT = 58,
    SWITCH = 59,
    BREAK = 60,
    RETURN = 61,
    FOR = 62,
    CASTEO = 63,
    AGRUPACION = 64,
    PARAMETRO = 65,
    LLAMADA_FUNCION = 66,
    VOID = 67,
    EXEC = 68
}