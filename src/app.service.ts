import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getPing() {
    return 'ping!';
  }
}
