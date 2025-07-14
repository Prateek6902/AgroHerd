import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const products = await Product.find({ user: req.user._id });
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err.message, err.stack);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { type, quantity, unit, source, icon } = req.body;

    if (!type || typeof quantity === 'undefined') {
      return res.status(400).json({ message: 'Type and quantity are required' });
    }

    const product = new Product({
      type,
      quantity: Number(quantity),
      unit: unit || 'unit',
      source: source || 'manual',
      icon: icon || '',
      user: req.user._id,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error adding product:', err.message, err.stack);
    res.status(400).json({ message: 'Failed to add product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    console.log('Delete request for product:', req.params.id);
    console.log('Requesting user ID:', req.user?._id);

    const deletedProduct = await Product.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
