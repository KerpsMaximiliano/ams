export interface IResponse<Data> {
  dataset: Data;
  estado: {
    Mensaje: string;
    Codigo: number;
  };
}
