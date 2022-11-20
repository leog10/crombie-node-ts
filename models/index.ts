import { Sequelize } from 'sequelize-typescript';
import { local } from '../config/config.json';

const sequelize = new Sequelize(
  local.database,
  local.username,
  local.password,
  {
    host: local.host,
    dialect: 'mysql',
  }
);

export default sequelize;
