import {Router} from 'express';
import passport from 'passport';
const router = Router();

// Controlador de carrito
import cartController from '../controllers/cart.controller.js'
// Métodos GET para carritos
router.get('/:cid', cartController.getCartById);
// Métodos POST para carritos
router.post('/', cartController.postCart);
// Métodos PUT para carritos
router.put('/:cid', cartController.putCartManyProducts);
router.put('/:cid/products/:pid', cartController.putCartOneProduct);
// Métodos DELETE para carritos
router.delete('/:cid', cartController.emptyCartAll);
router.delete('/:cid/products/:pid', cartController.emptyCartOne);
router.delete('/:cid/purchase', passport.authenticate('jwt', {session: false}), cartController.checkoutCart);

export default router;