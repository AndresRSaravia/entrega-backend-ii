import {Router} from 'express';
import passport from 'passport';
const router = Router();

// Controlador de view
import viewController from '../controllers/view.controller.js'

import {onlyAdmin, onlyUser} from '../middleware/auth.js';

router.get('/', viewController.indexe);
router.get('/register', viewController.register);
router.get('/login', viewController.login)
router.get('/products', passport.authenticate('jwt', {session: false}), onlyUser, viewController.products);
router.get('/products/:pid', passport.authenticate('jwt', {session: false}), onlyUser, viewController.productspid);
router.get('/productsadmin', passport.authenticate('jwt', {session: false}), onlyAdmin, viewController.products);
router.get('/productsadmin/:pid', passport.authenticate('jwt', {session: false}), onlyAdmin, viewController.productspid);
router.get('/cartproducts/:cid', viewController.cartproducts);

export default router;