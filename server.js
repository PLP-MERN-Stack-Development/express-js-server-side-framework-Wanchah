// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route - simple welcome message while API lives under /api/products
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Use /api/products for the JSON endpoints.');
});

// Helper to read/write products.json (file-backed persistence)
const fs = require('fs').promises;
const path = require('path');
const dataFile = path.join(__dirname, 'data', 'products.json');

async function readProducts() {
  try {
    const raw = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    // If file doesn't exist or is invalid, return empty array
    return [];
  }
}

async function writeProducts(products) {
  await fs.writeFile(dataFile, JSON.stringify(products, null, 2), 'utf8');
}

// TODO: Implement the following routes:
// GET /api/products - Get all products
// GET /api/products/:id - Get a specific product
// POST /api/products - Create a new product
// PUT /api/products/:id - Update a product
// DELETE /api/products/:id - Delete a product

// GET /api/products - list with optional category, page, limit
app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    let productsList = await readProducts();
    if (category) {
      productsList = productsList.filter(p => String(p.category).toLowerCase() === String(category).toLowerCase());
    }
    const start = (page - 1) * limit;
    res.json(productsList.slice(start, start + limit));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/products/:id
app.get('/api/products/:id', async (req, res) => {
  try {
    const productsList = await readProducts();
    const product = productsList.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/products
app.post('/api/products', async (req, res) => {
  try {
    const productsList = await readProducts();
    const newProduct = { id: uuidv4(), ...req.body };
    productsList.push(newProduct);
    await writeProducts(productsList);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/products/:id
app.put('/api/products/:id', async (req, res) => {
  try {
    const productsList = await readProducts();
    const idx = productsList.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });
    productsList[idx] = { ...productsList[idx], ...req.body };
    await writeProducts(productsList);
    res.json(productsList[idx]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/products/:id
app.delete('/api/products/:id', async (req, res) => {
  try {
    const productsList = await readProducts();
    const idx = productsList.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });
    productsList.splice(idx, 1);
    await writeProducts(productsList);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// TODO: Implement custom middleware for:
// - Request logging
// - Authentication
// - Error handling

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 