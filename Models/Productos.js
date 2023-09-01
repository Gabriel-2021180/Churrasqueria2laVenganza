const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const productSchema = new Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  estado: { type: Boolean, required: true, default: true },
});

const Product = model('Product', productSchema);

module.exports = Product;
