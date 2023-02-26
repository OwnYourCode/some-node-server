//TODO: use literal types in base interface or type methods naming ???

import { GetById } from './getById';
import { GetAll } from './getAll';

export interface ICUDController<CDTO, UDTO, DDTO = unknown> {
  create(data: CDTO): Promise<CDTO>;

  path?(id: number | string, data: UDTO): Promise<UDTO>;

  update(id: number | string, data: UDTO): Promise<UDTO>;

  delete(id: number | string): Promise<DDTO>;
}

export interface IBaseController<DTO, CDTO, UDTO, QueryDTO = unknown, DDTO = unknown>
  extends ICUDController<CDTO, UDTO, DDTO>,
    GetById<DTO>,
    GetAll<DTO, QueryDTO> {}
