const express = require('express');
const router = express.Router();
const productosController = require('../Controllers/productosController');
const upload = multer({ storage }).single('imagencita');
router.post('/crear', upload,productosController.createProduct);
router.get('/activos', productosController.getActiveProducts);
router.get('/inactivos', productosController.getInactiveProducts);
router.put('/editar/:id', productosController.editProduct);
router.put('/desactivar/:id', productosController.deactivateProduct);

module.exports = router;
