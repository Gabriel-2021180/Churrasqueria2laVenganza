const { Request, Response } = require('express');
const Product = require('../Models/Productos');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ keyFilename: "googleimage.json" });

const moment = require('moment');
// Crear un nuevo producto
exports.createProduct = async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;
    console.log("estos son los datos",nombre,descripcion,precio,req.file)
    const imagen = await uploadFile(req.file);
    console.log("estos son los datos",nombre,descripcion,precio,imagen)
    const newProduct = await Product.create({ nombre, descripcion, precio,imagen});
    console.log("los datos son"+newProduct)
    res.status(201).json({ message: 'Producto creado exitosamente', product: newProduct });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

// Ver productos activos
exports.getActiveProducts = async (req, res) => {
  try {
    const activeProducts = await Product.find({ estado: true });
    res.status(200).json(activeProducts );
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// Ver productos inactivos
exports.getInactiveProducts = async (req, res) => {
  try {
    const inactiveProducts = await Product.find({ estado: false });
    res.status(200).json({ products: inactiveProducts });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// Editar un producto existente
exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio } = req.body;
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { nombre, descripcion, precio },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'Producto editado exitosamente', product: updatedProduct });
  } catch (error) {
    console.error('Error al editar el producto:', error);
    res.status(500).json({ error: 'Error al editar el producto' });
  }
};

// Desactivar un producto (cambiar estado a inactivo)
exports.deactivateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deactivatedProduct = await Product.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true }
    );

    if (!deactivatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'Producto desactivado exitosamente', product: deactivatedProduct });
  } catch (error) {
    console.error('Error al desactivar el producto:', error);
    res.status(500).json({ error: 'Error al desactivar el producto' });
  }
};
// subir imagenes a google cloud storage
async function uploadFile(file) {
  const now = moment().format('YYYYMMDD_HHmmss');
  const bucket = storage.bucket('primerstorage');
  const fileName = `${now}_${file.originalname}`;
  const fileUpload = bucket.file(fileName);
  const stream = fileUpload.createWriteStream({
      resumable: false,
      public: true,
      metadata: {
          contentType: file.mimetype,
      },
  });

  return new Promise((resolve, reject) => {
      stream.on('error', reject);
      stream.on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
          resolve(publicUrl);
      });
      stream.end(file.buffer);
  });
}