import { registerAs } from '@nestjs/config';
import * as pkg from '../../package.json';

const AppConfig = registerAs('app', () => ({
  /**
   * app meta data from package.json
   */
  name: pkg.name,
  title: pkg.title,
  description: pkg.description,
  version: pkg.version,

  /**
   * api port
   */
  port: parseInt(process.env.PORT, 10) || 5001,
}));

export default AppConfig;
