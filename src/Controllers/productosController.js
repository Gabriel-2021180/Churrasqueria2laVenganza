const { Request, Response } = require('express');
const Product = require('../Models/Productos');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ keyFilename: "googleimage.json" });

const moment = require('moment');
// Crear un nuevo producto
exports.createProduct = async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;
    
    const imagen = await uploadFile(req.file);
    
    const newProduct = await Product.create({ nombre, descripcion, precio,imagen});
    
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


// Editar un producto existente, incluyendo la imagen
exports.editProduct = async (req, res) => {
  

  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, nuevaImagen } = req.body;

    // Obtén la URL de la imagen anterior de la base de datos
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const imagenAnteriorUrl = existingProduct.imagen;

    // Extrae el nombre del archivo de la URL de la imagen anterior
    const nombreImagenAnterior = imagenAnteriorUrl.substring(imagenAnteriorUrl.lastIndexOf('/') + 1);
    
    
    // Si el usuario no sube una nueva imagen, no actualizamos la imagen
    if (nuevaImagen) {
      // Reemplaza la imagen en Google Cloud Storage y obtén la URL de la nueva imagen
      const nuevaImagenUrl = await reemplazarImagenEnStorage(req.file, nombreImagenAnterior);

      // Actualiza los campos del producto, incluyendo la nueva URL de la imagen
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { nombre, descripcion, precio, imagen: nuevaImagenUrl },
        { new: true }
      );

      res.status(200).json({ message: 'Producto editado'});
    } else {
      // No se ha proporcionado una nueva imagen, por lo que no se actualiza la imagen del producto
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { nombre, descripcion, precio },
        { new: true }
      );
      res.status(200).json({ message: 'Producto editado' });
    }
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
//fats para la peticion de ajax perro maldito mauro 
// Obtener detalles de un producto por ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error('Error al obtener los detalles del producto:', error);
    res.status(500).json({ error: 'Error al obtener los detalles del producto' });
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

// Reemplaza la imagen en Google Cloud Storage
async function reemplazarImagenEnStorage(file, nombreImagenAnterior) {
  const bucket = storage.bucket('primerstorage');

  // Verificamos si el nombre de la imagen anterior existe en el Cloud Storage
  const blob = await bucket.file(nombreImagenAnterior).get();

  // Si el nombre de la imagen anterior existe en el Cloud Storage, la borramos
  if (blob) {
    await bucket.file(nombreImagenAnterior).delete();
  }

  // Subimos la nueva imagen
  const nuevaImagenUrl = await uploadFile(file);

  // Obtenemos el nombre del archivo de la nueva imagen
  const nombreImagenNueva = nuevaImagenUrl

  return nombreImagenNueva;
}



