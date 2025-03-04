import {Router} from 'express';
import cartModel from '../models/cart.model.js'

const router = Router();

// Métodos GET para productos
router.get('/:cid', async (req,res) => {
	console.log('Pedido viewer de listado de productos de un carrito.');
	console.log('Id del carrito a buscar:', req.params.cid);
	try{
		const cid = req.params.cid;
		const foundCart = await cartModel.findOne({_id: cid}).lean();
		if (!foundCart) {
			return res.status(404).send({status: "error", error: "Carrito no encontrado."})
		}
		const foundCartpop = await cartModel.findOne({_id: cid}).populate('products._id').lean()
		let prodpop = [];
		(foundCartpop.products).forEach((element) => {
			element._id.quantity = element.quantity;
			console.log(element._id.quantity)
			prodpop.push(element._id)
		});
		return res.render('cartproducts',{prodpop,cid});
	} catch (error){
		console.log(error)
		return res.status(500).send({status: 'error', error: 'Error al encontrar el carrito.'});
	}
});

export default router;