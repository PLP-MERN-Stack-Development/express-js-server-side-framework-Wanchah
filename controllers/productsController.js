import { v4 as uuidv4 } from 'uuid';
import { readProducts, writeProducts } from '../utils/dataStore.js';
import { NotFoundError } from '../utils/errors.js';

export async function getAllProducts(req, res, next) {
  try {
    const { category } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const products = await readProducts();
    let filtered = products;
    if (category) {
      filtered = products.filter(p => String(p.category).toLowerCase() === String(category).toLowerCase());
    }

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);
    res.json(paginated);
  } catch (err) {
    next(err);
  }
}

export async function getProductById(req, res, next) {
  try {
    const products = await readProducts();
    const product = products.find(p => p.id === req.params.id);
    if (!product) return next(new NotFoundError('Product not found'));
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req, res, next) {
  try {
    const products = await readProducts();
    const newProduct = { id: uuidv4(), ...req.body };
    products.push(newProduct);
    await writeProducts(products);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const products = await readProducts();
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return next(new NotFoundError('Product not found'));
    products[index] = { ...products[index], ...req.body };
    await writeProducts(products);
    res.json(products[index]);
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const products = await readProducts();
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return next(new NotFoundError('Product not found'));
    products.splice(index, 1);
    await writeProducts(products);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function searchProducts(req, res, next) {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: 'Missing search query parameter: name' });
    const q = String(name).toLowerCase();
    const products = await readProducts();
    const results = products.filter(p => String(p.name).toLowerCase().includes(q));
    res.json(results);
  } catch (err) {
    next(err);
  }
}

export async function getStats(req, res, next) {
  try {
    const products = await readProducts();
    const stats = {};
    products.forEach(p => {
      stats[p.category] = (stats[p.category] || 0) + 1;
    });
    res.json(stats);
  } catch (err) {
    next(err);
  }
}