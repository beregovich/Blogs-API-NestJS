export default () => ({
  port: parseInt(process.env.PORT, 10) || 5000,
  PostgresHeroku: {
    type: 'postgres',
    host: process.env['POSTGRES_HEROKU_HOST '],
    port: 5432,
    username: process.env['POSTGRES_HEROKU_USER '],
    password: process.env['POSTGRES_HEROKU_PASSWORD '],
    database: process.env['POSTGRES_HEROKU_DATABASE '],
    autoLoadEntities: true,
    synchronize: false,
  },
  PostgresLocal: {
    type: 'postgres',
    host: 'localhost',
    port: parseInt(process.env['POSTGRES_LOCAL_PORT ']),
    username: process.env['POSTGRES_LOCAL_USERNAME '],
    password: process.env['POSTGRES_LOCAL_PASSWORD '],
    database: process.env['POSTGRES_LOCAL_DATABASE '],
    autoLoadEntities: true,
    synchronize: false,
    ssl: { rejectUnauthorized: false },
  },
});
