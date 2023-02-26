export interface GetAll<DTO, QueryDTO> {
  getAll(limit?: number, offset?: number): Promise<DTO[] | unknown>;
  getAll(data?: number | QueryDTO): Promise<DTO[] | unknown>;
}
