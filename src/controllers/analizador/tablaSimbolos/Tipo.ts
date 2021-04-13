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

    public setTipo(tipo:tipos)
    {
        this.tipos = tipo;
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
    DECREMENTO = 17
}