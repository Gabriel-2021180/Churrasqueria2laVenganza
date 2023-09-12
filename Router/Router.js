const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const { createProduct, getActiveProducts, getInactiveProducts, editProduct, deactivateProduct, getProduct } = require('../Controllers/productosController');
const upload = multer({ storage }).single('imagencita');
router.post('/crear', upload,createProduct);
router.get('/activos', getActiveProducts);
router.get('producto/:id',getProduct)
router.get('/inactivos', getInactiveProducts);
router.put('/editar/:id', editProduct);
router.put('/desactivar/:id', deactivateProduct);

module.exports = router;
