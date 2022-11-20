import { Sequelize } from 'sequelize-typescript';
import {
  DB_DIALECT,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_USER,
} from '../config/config';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
});

export default sequelize;
