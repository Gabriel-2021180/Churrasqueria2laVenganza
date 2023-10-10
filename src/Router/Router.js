const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const productosController = require('../Controllers/productosController');
const categoriasController = require('../Controllers/CategoriaControler');
const upload = multer({ storage }).single('imagencita');
const uploadEdit = multer({ storage }).single('nuevaImagen'); // Cambia 'nuevaImagen' por el nombre de campo adecuado en tu formulario de edición

router.post('/crear', upload,productosController.createProduct);
router.get('/activos', productosController.getActiveProducts);
router.get('/inactivos', productosController.getInactiveProducts);
router.put('/editar/:id', uploadEdit, productosController.editProduct);
router.put('/desactivar/:id', productosController.deactivateProduct);
router.get('/producto/:id', productosController.getProductById);

router.get('/categoriasA',categoriasController.getActiveCategorias)
router.post('/crearCat',categoriasController.createCategoria)
router.get('/categoriasDes', categoriasController.getInactiveCategorias)
router.put('/editarCat/:id', categoriasController.editCategoria)
router.get('/categoria/:id',categoriasController.getCategoriaById)
router.put('/desactivarCat/:id', categoriasController.deactivateCategoria)

module.exports = router;
