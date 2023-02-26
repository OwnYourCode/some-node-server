export interface GetById<DTO> {
  getById(id: number | string): Promise<DTO>;
}
