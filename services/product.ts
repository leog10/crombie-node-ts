import Product, { ProductInput } from '../models/product';
import { Op } from 'sequelize';

export const getProducts = async (
  limit: number,
  page: number,
  offset: number,
  name: string,
  brand: string
) => {
  try {
    const nextLimit = offset + limit;

    const pageInfoFormatter = (productsCount: number, pages: number) => {
      return productsCount === 0
        ? '0'
        : offset + 1 === nextLimit || offset + 1 === productsCount
        ? `${offset + 1} of ${productsCount}`
        : nextLimit > productsCount
        ? `${offset + 1}-${productsCount} of ${productsCount}`
        : pages === 1
        ? `1-${productsCount} of ${productsCount}`
        : `${offset + 1}-${nextLimit} of ${productsCount}`;
    };

    // Find product where name and brand starts with the respective queries case insensitive.
    if (name || brand) {
      const products = await Product.findAndCountAll({
        where: {
          [Op.or]: [
            {
              name: {
                [Op.startsWith]: `${name}%`,
              },
            },
            {
              brand: {
                [Op.startsWith]: `${brand}%`,
              },
            },
          ],
        },
        offset: offset,
        limit: limit,
      });

      if (products) {
        const totalPages = Math.ceil(products.count / limit);
        const info = pageInfoFormatter(products.count, totalPages);
        return { products, page, totalPages, info };
      }
      return undefined;
    }

    // find all products if there are not search queries
    const products = await Product.findAndCountAll({
      limit: limit,
      offset: offset,
    });

    if (products) {
      const totalPages = Math.ceil(products.count / limit);
      const info = pageInfoFormatter(products.count, totalPages);
      return { products, page, totalPages, info };
    }
    return undefined;
  } catch (error) {
    console.log(error);
  }
};

export const getProductById = async (
  id: number
): Promise<Product | undefined> => {
  try {
    const product = await Product.findByPk(id);

    if (product) {
      return product;
    }

    return undefined;
  } catch (error) {
    console.log(error);
  }
};

export const createProduct = async (
  name: string,
  brand: string,
  price: number
) => {
  const product: ProductInput = { name, brand, price };

  try {
    const newProduct = await Product.create(product);
    if (newProduct) {
      return newProduct;
    }
    return undefined;
  } catch (error) {
    console.log(error);
  }
};

export const deleteProduct = async (id: number) => {
  try {
    const product = await Product.findByPk(id);

    if (product) {
      product.destroy();
      return 1;
    }

    return undefined;
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async (
  id: number,
  name: string,
  brand: string,
  price: number
) => {
  try {
    const product = await Product.update(
      { name, brand, price },
      {
        where: { id },
      }
    );

    if (!product[0]) {
      return undefined;
    }

    return product;
  } catch (error) {
    console.log(error);
  }
};
