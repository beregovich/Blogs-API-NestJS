//базовые настройки env переменных
//по умолчанию переменные беруться сначала из ENV илм смотрят всегда на staging
//для подстановки локальных значений переменных использовать исключительно локальные env файлы env.development.local
//при необзодимости добавляем сюда нужные приложению переменные
import * as dotenv from 'dotenv';
dotenv.config();

export type EnvironmentVariable = { [key: string]: string | undefined };
export type EnvironmentsTypes =
  | 'DEVELOPMENT'
  | 'STAGING'
  | 'PRODUCTION'
  | 'TEST';
export class EnvironmentSettings {
  constructor(private env: EnvironmentsTypes) {}
  getEnv() {
    return this.env;
  }
  isProduction() {
    return this.env === 'PRODUCTION';
  }
  isStaging() {
    return this.env === 'STAGING';
  }
  isDevelopment() {
    return this.env === 'DEVELOPMENT';
  }
  isTesting() {
    return this.env === 'TEST';
  }
}

class APISettings {
  public readonly GET_SESSION_CODE_URL: string;
  constructor(private envVariables: EnvironmentVariable) {
    this.GET_SESSION_CODE_URL = envVariables.GET_SESSION_CODE_URL || 'http';
  }
}

class AuthSettings {
  public readonly BASE_AUTH_HEADER: string;
  public readonly ACCESS_JWT_SECRET_KEY: string;
  public readonly REFRESH_JWT_SECRET_KEY: string;
  constructor(private envVariables: EnvironmentVariable) {
    this.BASE_AUTH_HEADER =
      envVariables.BASE_AUTH_HEADER || 'Basic YWRtaW46cXdlcnR5';
    this.ACCESS_JWT_SECRET_KEY =
      envVariables.ACCESS_JWT_SECRET_KEY || 'accessJwtSecret';
    this.REFRESH_JWT_SECRET_KEY =
      envVariables.REFRESH_JWT_SECRET_KEY || 'refreshJwtSecret';
  }
}

export class DatabaseSettings {
  public readonly MONGO_URI: string;
  public readonly POSTGRES_HOST: string;
  public readonly POSTGRES_DATABASE: string;
  public readonly POSTGRES_PORT: number;
  public readonly POSTGRES_USER: string;
  public readonly POSTGRES_PASSWORD: string;
  constructor(private envVariables: EnvironmentVariable) {
    this.MONGO_URI = envVariables.MONGO_URI || 'mongodb://';
    this.POSTGRES_HOST = envVariables.POSTGRES_HOST || '';
    this.POSTGRES_DATABASE = envVariables.POSTGRES_DATABASE || '';
    this.POSTGRES_PORT = +envVariables.POSTGRES_PORT || 5432;
    this.POSTGRES_USER = envVariables.POSTGRES_USER || '';
    this.POSTGRES_PASSWORD = envVariables.POSTGRES_PASSWORD || '';
  }
}

export class AppSettings {
  constructor(
    public env: EnvironmentSettings,
    public api: APISettings,
    public auth: AuthSettings,
    public database: DatabaseSettings,
  ) {}
}
const env = new EnvironmentSettings(
  (process.env.NODE_ENV || 'DEVELOPMENT') as EnvironmentsTypes,
);
const api = new APISettings(process.env);
const database = new DatabaseSettings(process.env);
const auth = new AuthSettings(process.env);
export const appSettings = new AppSettings(env, api, auth, database);
