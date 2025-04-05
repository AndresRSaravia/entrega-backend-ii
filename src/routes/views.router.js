import {Router} from 'express';
const router = Router();

// Controlador de view
import viewController from '../controllers/view.controller.js'

import {onlyAdmin, onlyUser} from '../middleware/auth.js';

router.get('/', viewController.indexe);
router.get('/register', viewController.register);
router.get('/login', viewController.login)
router.get('/products', viewController.products);
router.get('/products/:pid', viewController.productspid);
router.get('/cartproducts/:cid', viewController.cartproducts);

export default router;