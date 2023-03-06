export interface Response<Data> {
    dataset: Data,
    returnset: {
        Mensaje: string,
        Codigo: number
    }    
}