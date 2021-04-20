import Tipo from "./Tipo";

export default class Simbolo
{
    private tipo: Tipo;
    private identificador: string;
    private valor: any;

    constructor(tipo: Tipo, identificador: string, valor?:any)
    {
        this.tipo = tipo;
        this.identificador = identificador;
        if(valor!=null)
        {
            this.valor = valor;
        }
        else
        {
            this.valor = null;
        }

    }

    public getIdentificador() {
        return this.identificador;
    }

    public setIdentificador(identificador: string) {
        this.identificador = identificador;
    }
    public getTipo(){
        return this.tipo;
    }
    public setTipo(tipo: Tipo)
    {
        this.tipo = tipo;
    }

    public getValor(){
        return this.valor;
    }
    public setValor(valor: any)
    {
        this.valor = valor;
    }
}