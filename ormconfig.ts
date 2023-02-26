/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const envConfig = require('dotenv').config({
  path: path.resolve(__dirname, `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`),
});

function env(key) {
  console.log(`ormconfig env ${envConfig.parsed[key] || process.env[key]}`);

  return envConfig.parsed[key] || process.env[key];
}

const commonConfig = {
  type: env('DB_TYPE'),
  logger: 'advanced-console',
  logging: ['warn', 'error'],
  migrationsRun: env('DB_MIGRATIONS_RUN'),
  entities: ['dist/src/**/*.entity.js'],
  migrations: ['dist/src/database/migrations/*.js'],
  seeds: ['dist/src/database/seeds/**/*.js'],
  factories: ['dist/src/database/factories/**/*.js'],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};

console.log('**********************************************');
console.log('process.env.NODE_ENV', process.env.NODE_ENV);
console.log('**********************************************');

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

const url = `${env('DB_TYPE')}://${env('DB_USERNAME')}:${env('DB_PASSWORD')}@${env('DB_HOST')}:${env('DB_PORT')}/${env(
  'DB_DATABASE',
)}`;

console.log('Database url', url);

if (isTest) {
  console.log('*********Test********');
  const testConfig = {
    synchronize: env('DB_SYNCHRONIZE'),
    url,
    ...commonConfig,
  };
  console.log(testConfig);
  module.exports = testConfig;
} else if (isProduction) {
  console.log('*********Production********');
  const productionConfig = {
    synchronize: env('DB_SYNCHRONIZE'),
    url: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    ...commonConfig,
  };
  console.log(productionConfig);
  module.exports = productionConfig;
} else {
  console.log('*********Development********');
  const developmentConfig = {
    synchronize: env('DB_SYNCHRONIZE'),
    url,
    ...commonConfig,
  };
  console.log(developmentConfig);
  module.exports = developmentConfig;
}
