const Categoria = require('../Models/Categorias');
const Product = require('../Models/Productos'); // Asegúrate de importar el modelo de Product
exports.createCategoria = async (req, res) => {
  try {
    console.log('esto es lo que llega del body:'+ req.body.nombre)
    const { nombre, descripcion } = req.body;

    const newCategoria = await Categoria.create({ nombre, descripcion });

    res.status(201).json({ message: 'Categoría creada exitosamente', categoria: newCategoria });
  } catch (error) {
    console.error('Error al crear la categoría:', error);
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
};

exports.getActiveCategorias = async (req, res) => {
    try {
      const activeCategorias = await Categoria.find({ estado: true });
      res.status(200).json({ categorias: activeCategorias });
    } catch (error) {
      console.error('Error al obtener las categorías activas:', error);
      res.status(500).json({ error: 'Error al obtener las categorías activas' });
    }
  };

  exports.getInactiveCategorias = async (req, res) => {
    try {
      const inactiveCategorias = await Categoria.find({ estado: false });
      res.status(200).json({ categorias: inactiveCategorias });
    } catch (error) {
      console.error('Error al obtener las categorías inactivas:', error);
      res.status(500).json({ error: 'Error al obtener las categorías inactivas' });
    }
  };
  
  exports.getCategoriaById = async (req, res) => {
    try {
      const { id } = req.params;
      const categoria = await Categoria.findById(id);
  
      if (!categoria) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }
  
      res.status(200).json({ categoria });
    } catch (error) {
      console.error('Error al obtener la categoría por ID:', error);
      res.status(500).json({ error: 'Error al obtener la categoría por ID' });
    }
  };

  exports.editCategoria = async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion } = req.body;
  
      const updatedCategoria = await Categoria.findByIdAndUpdate(
        id,
        { nombre, descripcion },
        { new: true }
      );
  
      if (!updatedCategoria) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }
  
      res.status(200).json({ message: 'Categoría editada', categoria: updatedCategoria });
    } catch (error) {
      console.error('Error al editar la categoría:', error);
      res.status(500).json({ error: 'Error al editar la categoría' });
    }
  };

 

exports.deactivateCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    // Desactivar la categoría
    const deactivatedCategoria = await Categoria.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true }
    );

    if (!deactivatedCategoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    // Desactivar todos los productos asociados a esta categoría
    await Product.updateMany(
      { categoria: id },
      { estado: false }
    );

    res.status(200).json({ message: 'Categoría y productos asociados desactivados exitosamente', categoria: deactivatedCategoria });
  } catch (error) {
    console.error('Error al desactivar la categoría y sus productos:', error);
    res.status(500).json({ error: 'Error al desactivar la categoría y sus productos' });
  }
};
