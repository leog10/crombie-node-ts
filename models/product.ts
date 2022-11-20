'use strict';
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from './index';

interface ProductAttributes {
  id: number;
  name: string;
  brand: string;
  price: number;
}

export interface ProductInput extends Optional<ProductAttributes, 'id'> {}
export interface ProductOutput extends Required<ProductAttributes> {}

class Product
  extends Model<ProductAttributes, ProductInput>
  implements ProductAttributes
{
  declare id: number;
  declare name: string;
  declare brand: string;
  declare price: number;
}

Product.init(
  {
    id: {
      type: DataTypes.NUMBER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'product',
  }
);

export default Product;
