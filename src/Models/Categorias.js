const mongoose = require('mongoose');

// Define el esquema de la categoría
const categoriaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  descripcion: {
    type: String,
  },
  estado: { type: Boolean, required: true, default: true },
  productos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto', // Referencia al modelo de Producto
    },
  ],
});

// Define el modelo de la categoría
const Categoria = mongoose.model('Categoria', categoriaSchema);

module.exports = Categoria;
