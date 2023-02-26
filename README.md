# DIMS-server

## Setup steps

### 1. Installation

```bash
$ yarn
```

### 2. Create Database

1. Create postgres database (by default it's DIMSCore-test)
2. To run migrations, seeds and db update by running ```db:setup``` script
3. It's possible to start database with Docker by running ```docker:up``` script
4. Or you can start server and database in parallel by ruinning ```start:dev:docker``` script

### 3. Start server

```bash
# development
$ yarn start:dev

# watch mode
$ yarn start:dev:watch

# production mode
$ yarn start:prod
```

### 4. How to reach out API
- REST API accessible by following the path - `docs`

- By default, server starts on host 4000, the full url - `http://localhost:4000/docs/`

## Test

### Unit tests

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

### e2e tests

- Create database `DIMSCore-e2e`
- change `.env.development` file to point to the database
- run `migration:run:dev` to init database
