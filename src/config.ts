export const typeOrmLocalPostgres = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.POSTGRES_LOCAL_USERNAME,
  password: process.env.POSTGRES_LOCAL_PASSWORD,
  database: 'bloggersApi',
  autoLoadEntities: true,
  synchronize: false,
};

export const common = {
  UseDatabase: process.env.USE_DATABASE || 'SQL',
};

export const typeOrmHerokuPostgres = {
  type: 'postgres',
  host: 'ec2-52-48-159-67.eu-west-1.compute.amazonaws.com',
  port: 5432,
  username: process.env.POSTGRES_HEROKU_USERNAME,
  password: process.env.POSTGRES_HEROKU_PASSWORD,
  database: 'dd99jeg9lg1amo',
  autoLoadEntities: true,
  synchronize: false,
  ssl: { rejectUnauthorized: false },
};
