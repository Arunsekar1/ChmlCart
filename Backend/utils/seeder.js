const products = require('../data/product.json');
const Product = require('../models/productModel');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

dotenv.config({ path: 'Backend/config/config.env' });

connectDatabase();

const seedProducts = async(req, res) => {
    try {
        await Product.deleteMany();
        console.log("Products are deleted!");
        await Product.insertMany(products);
        console.log("All Products are added!");
    } catch (error) {
        console.log(error.message);
    }
    process.exit();
}

seedProducts();
