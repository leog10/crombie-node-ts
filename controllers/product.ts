import { Request, Response } from 'express';
import * as productServices from '../services/product';

export const getProducts = async (req: Request, res: Response) => {
  const name = req.query.name as string;
  const brand = req.query.brand as string;
  const limit = Number(req.query.limit) || 5;
  const page = Number(req.query.page) || 1;
  const offset = page ? (page - 1) * limit : 0;

  try {
    // Find product where name and brand starts with the respective queries case insensitive.
    const products = await productServices.getProducts(
      limit,
      page,
      offset,
      name,
      brand
    );

    if (products) {
      return res.status(200).json(products);
    }
    return res.status(200).json('No product match with your search query');
  } catch (error) {
    console.log(error);
    res.status(200).json('Something wrong happened...');
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await productServices.getProductById(+id);

    if (product) {
      return res.status(200).json(product);
    }

    res.status(404).json(`Product not found`);
  } catch (error) {
    console.log(error);
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, brand, price } = req.body;

  try {
    if (name && brand && price) {
      const newProduct = await productServices.createProduct(
        name,
        brand,
        price
      );
      if (newProduct) {
        return res.status(201).json(newProduct);
      }
    } else {
      return res
        .status(400)
        .json({ error: 'name, brand and price are required' });
    }
    return res.status(400).json({ error: 'Something went wrong...' });
  } catch (error) {
    console.log(error);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await productServices.deleteProduct(+id);

    if (product) {
      return res.status(200).json({ msg: 'Product deleted' });
    }

    res.status(404).json({ msg: `Product with id ${id} not found` });
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, brand, price } = req.body;

  if (!name && !brand && !price) {
    return res.status(400).json({ error: 'Invalid fields' });
  }

  try {
    const product = await productServices.updateProduct(
      +id,
      name,
      brand,
      price
    );

    if (product) {
      return res.status(200).json({ msg: 'Product updated' });
    }

    return res.status(404).json({ msg: 'Product not found' });
  } catch (error) {
    console.log(error);
  }
};
