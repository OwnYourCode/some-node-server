/**
 * Common service interface
 * DTO - data transfer type
 * R - result type
 */
export interface Service<DTO, QueryDTO extends Record<string, any>, DDTO = unknown> {
  getAll(data?: number | QueryDTO): Promise<DTO[] | unknown>;

  getById(id: number | string): Promise<DTO | null>;

  create(o: DTO): Promise<DTO>;

  update(id: number | string, o: DTO): Promise<DTO | null>;

  delete(id: number | string): Promise<DDTO>;
}

export interface ReadOnlyService<DTO> {
  getAll(id?: number | string): Promise<DTO[]>;
}
