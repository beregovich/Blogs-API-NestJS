export default () => ({
  PostgresHerokuConfig: {
    type: 'postgres' as const,
    host: process.env.POSTGRES_HEROKU_HOST,
    port: 5432,
    username: process.env.POSTGRES_HEROKU_USER,
    password: process.env.POSTGRES_HEROKU_PASSWORD,
    database: process.env.POSTGRES_HEROKU_DATABASE,
    autoLoadEntities: false,
    synchronize: false,
    ssl: { rejectUnauthorized: false },
  },
});
