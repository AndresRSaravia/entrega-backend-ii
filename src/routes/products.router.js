import {Router} from 'express';
const router = Router();

// Controlador de producto
import productController from '../controllers/product.controller.js'

// Métodos POST para productos
router.post('/', productController.postProduct);
// Métodos GET para productos
router.get('/', productController.getProductPaginate);
router.get('/:pid', productController.getProductById);
// Métodos PUT para productos
router.put('/:pid', productController.putProduct);
// Métodos DELETE para productos
router.delete('/:pid', productController.deleteProduct);

export default router;