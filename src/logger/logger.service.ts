import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class DIMSLoggerService extends ConsoleLogger {
  logMessage(name: string, ctx: unknown, ...args: string[]) {
    let rest: string;
    if (args) {
      rest = args.join(',');
    }
    if (typeof ctx !== 'string') {
      ctx = JSON.stringify(ctx);
    }
    this.log(`- ${ctx} ${rest}`, name);
  }
}
