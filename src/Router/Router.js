const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const { createProduct, getActiveProducts, getInactiveProducts, editProduct, deactivateProduct, getProduct } = require('../Controllers/productosController');
const upload = multer({ storage }).single('imagencita');
<<<<<<< HEAD:src/Router/Router.js
const uploadEdit = multer({ storage }).single('nuevaImagen'); // Cambia 'nuevaImagen' por el nombre de campo adecuado en tu formulario de edición

router.post('/crear', upload,productosController.createProduct);
router.get('/activos', productosController.getActiveProducts);
router.get('/inactivos', productosController.getInactiveProducts);
router.put('/editar/:id', uploadEdit, productosController.editProduct);
router.put('/desactivar/:id', productosController.deactivateProduct);
router.get('/producto/:id', productosController.getProductById);
=======
router.post('/crear', upload,createProduct);
router.get('/activos', getActiveProducts);
router.get('producto/:id',getProduct)
router.get('/inactivos', getInactiveProducts);
router.put('/editar/:id', editProduct);
router.put('/desactivar/:id', deactivateProduct);
>>>>>>> c35a46dcc53d1d156224d36486dabb6c1fc2e95c:Router/Router.js

module.exports = router;
