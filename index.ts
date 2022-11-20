import express, { json } from 'express';
import { Op } from 'sequelize';
import Product from './models/product';

const app = express();
app.use(json());

// Exact search query case insensitive
// http://localhost:3000/product?name=fernet
// http://localhost:3000/product?brand=branca
//
// Find all products if no query is present
// http://localhost:3000/product?name=
// http://localhost:3000/product
/* app.get('/product', async (req, res) => {
  const name = req.query.name;
  const brand = req.query.brand;

  try {
    // Find product where name and brand are same as query case insensitive.
    if (name && brand) {
      const products = await Product.findAll({
        where: {
          name,
          brand,
        },
      });

      if (products) {
        return res.status(200).json(products);
      }
      return res.status(200).json('No products match with your search query');
    }

    if (name) {
      const products = await Product.findAll({
        where: {
          name,
        },
      });

      if (products) {
        return res.status(200).json(products);
      }
      return res.status(200).json('No products match with your search query');
    } else if (brand) {
      const products = await Product.findAll({
        where: {
          brand,
        },
      });

      if (products) {
        return res.status(200).json(products);
      }
      return res.status(200).json('No products match with your search query');
    } else {
      const products = await Product.findAll();
      res.status(200).json(products);
    }
  } catch (error) {
    console.log(error);
    res.status(200).json('Something wrong happened...');
  }
}); */

// Find all products that includes the query in the name attribute or brand attribute
// http://localhost:3000?name=fernet
app.get('/product/search', async (req, res) => {
  const name = req.query.name;
  const brand = req.query.brand;
  const limit = Number(req.query.limit) || 5;
  const page = Number(req.query.page) || 1;
  const offset = page ? (page - 1) * limit : 0;

  try {
    // Find product where name and brand starts with the respective queries case insensitive.
    if (name || brand) {
      const products = await Product.findAndCountAll({
        where: {
          [Op.and]: [
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
        return res.status(200).json({ products, page, totalPages });
      }
      return res.status(200).json('No product match with your search query');
    }

    // find all products if there are not search queries
    const products = await Product.findAndCountAll({
      limit: limit,
      offset: offset,
    });

    if (products) {
      const totalPages = Math.ceil(products.count / limit);
      return res.status(200).json({ products, page, totalPages });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json('Something wrong happened...');
  }
});

app.post('/product', async (req, res) => {
  const { name, brand, price } = req.body;

  try {
    if (name && brand && price) {
      const product = await Product.create({ name, brand, price });
      res.status(201).json(product);
    } else {
      res.status(400).json({ error: 'Invalid fields' });
    }
  } catch (error) {
    console.log(error);
  }
});

app.delete('/product/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);

    if (product) {
      product.destroy();
      return res.status(200).json({ product, msg: 'Product deleted' });
    }

    res.status(404).json({ msg: `Product with id ${id} not found` });
  } catch (error) {
    console.log(error);
  }
});

app.put('/product/:id', async (req, res) => {
  const { id } = req.params;
  const { name, brand, price } = req.body;

  if (!name && !brand && !price) {
    return res.status(400).json({ error: 'Invalid fields' });
  }

  try {
    const product = await Product.update(
      { name, brand, price },
      {
        where: { id },
      }
    );

    if (!product[0]) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.status(200).json({ msg: 'Product updated', product });
  } catch (error) {
    console.log(error);
    res.status(400).json('Error');
  }
});

app.listen(3000, () => {
  console.log('app live');
});
