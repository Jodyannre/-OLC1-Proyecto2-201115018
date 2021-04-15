
export class nodoInstruccion{
    private hijos: Array<nodoInstruccion>;
    private valor:string;

    constructor(valor:string){
        this.valor = valor;
        this.hijos = new Array<nodoInstruccion>();
    }

    public setHijos (hijos: Array<nodoInstruccion>){
        this.hijos = hijos;
    }
    
    public agregarHijoCadena(cadena:string){
        this.hijos.push(new nodoInstruccion(cadena));
    }

    public agregarHijoNodo(hijo:nodoInstruccion)
    {
        this.hijos.push(hijo);
    }
    
    public agregarHijos(hijos: Array<nodoInstruccion>){
        for(let hijo of hijos)
        {
            this.hijos.push(hijo);
        }
    } 
    
    public agregarPrimerHijoCadena(cadena:string)
    {
        this.hijos.unshift(new nodoInstruccion(cadena));
    }
    
    public agregarPrimerHijoNodo(hijo:nodoInstruccion)
    {
        this.hijos.unshift(hijo);
    }
    
    public getValor():string
    {
        return this.valor;
    }
    
    public setValor(cadena:string)
    {
        this.valor = cadena;
    }
    
    public getHijos(): Array<nodoInstruccion>
    {
        return this.hijos;
    }

}
