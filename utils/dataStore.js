import fs from 'fs/promises';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data', 'products.json');

export async function readProducts() {
  const raw = await fs.readFile(dataFile, 'utf8');
  return JSON.parse(raw || '[]');
}

export async function writeProducts(products) {
  const data = JSON.stringify(products, null, 2);
  await fs.writeFile(dataFile, data, 'utf8');
}
