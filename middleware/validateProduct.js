import { ValidationError } from '../utils/errors.js';

export default function validateProduct(req, res, next) {
  const { name, price, category, inStock } = req.body;
  if (!name || typeof price !== 'number' || !category || typeof inStock !== 'boolean') {
    return next(new ValidationError('Invalid product data'));
  }
  next();
}
