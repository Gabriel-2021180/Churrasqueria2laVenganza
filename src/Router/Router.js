const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const productosController = require('../Controllers/productosController');
const upload = multer({ storage }).single('imagencita');
const uploadEdit = multer({ storage }).single('nuevaImagen'); // Cambia 'nuevaImagen' por el nombre de campo adecuado en tu formulario de edición

router.post('/crear', upload,productosController.createProduct);
router.get('/activos', productosController.getActiveProducts);
router.get('/inactivos', productosController.getInactiveProducts);
router.put('/editar/:id', uploadEdit, productosController.editProduct);
router.put('/desactivar/:id', productosController.deactivateProduct);
router.get('/producto/:id', productosController.getProductById);

module.exports = router;
