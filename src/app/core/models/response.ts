export interface Response<Data> {
    dataset: Data,
    estado: {
        Mensaje: string,
        Codigo: number
    }    
}