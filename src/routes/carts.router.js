import {Router} from 'express';
import cartModel from '../models/cart.model.js'
import productModel from '../models/product.model.js'

const router = Router();

// Métodos GET para carritos
router.get('/:cid', async (req, res) => {
	console.log('Id del carrito a buscar:', req.params.cid);
	try{
		const cid = req.params.cid;
		const foundCart = await cartModel.findOne({_id: cid});
		if (!foundCart) {
			return res.status(404).send({status: "error", error: "Carrito no encontrado."})
		}
		return res.send(foundCart);
	} catch (error){
		console.log(error)
		return res.status(500).send({status: 'error', error: 'Error al encontrar el carrito.'});
	}
});

// Métodos POST para carritos
router.post('/', async (req,res) => {
	try{
		console.log('Pedido de creación de carrito.');
		const newCart = new cartModel({'products': []})
		await newCart.save();
		return res.json({status: 'success', message: 'Carrito agregado exitosamente.'});
	} catch (error){
		console.log(error)
		return res.status(500).send({status: 'error', error: 'Error al crear un producto.'});
	}
});

// Métodos PUT para carritos
router.put('/:cid', async (req,res) => {
	console.log('Id del carrito a actualizar:', req.params.cid);
	console.log('Lista de productos a aplicar:', req.body.products);
	try{
		const cid = req.params.cid;
		const foundCart = await cartModel.findOne({_id: cid});
		if (!foundCart) {
			return res.status(404).send({status: "error", error: "Carrito no encontrado."})
		}
		const products = req.body.products;
		for (let index = 0; index < products.length; index++) {
			const element = products[index];
			const pid = element._id;
			const foundProduct = await productModel.findOne({_id: pid});
			if (!foundProduct) {
				console.log('Id de producto no encontrada:', element._id)
			} else {
				if (!(Number(element.quantity)>0)) {
					console.log('Cantidad inválida para la Id de producto:', pid, element.quantity)
				} else {
					const quantity = element.quantity
					const pindex = foundCart.products.findIndex(p => p._id.toString() === pid);
					if(pindex === -1){
						const product = {
							"_id": pid.toString(),
							"quantity": quantity
						};
						(foundCart.products).push(product);
					} else {
						const totalquantity = Number(foundCart.products[pindex].quantity)+Number(element.quantity)
						foundCart.products[pindex].quantity = String(totalquantity);
					}
				}
			}
		}
		const result = await cartModel.updateOne({_id:cid}, foundCart);
		return res.send({status: "success", message: "Producto agregado al carrito.", payload: result});
	} catch (error){
		console.log(error)
		return res.status(500).send({status: 'error', error: 'Error al actualizar el carrito.'});
	}
});

router.put('/:cid/products/:pid', async (req,res) => {
	console.log('Id del carrito a actualizar:', req.params.cid);
	console.log('Id del producto a actualizar:', req.params.pid);
	console.log('Cantidad a agregar:', req.body.quantity);
	try{
		const cid = req.params.cid;
		const foundCart = await cartModel.findOne({_id: cid});
		if (!foundCart) {
			return res.status(404).send({status: "error", error: "Carrito no encontrado."})
		}
		const pid = req.params.pid;
		const foundProduct = await productModel.findOne({_id: pid});
		if (!foundProduct) {
			return res.status(404).send({status: "error", error: "Producto no encontrado."})
		}
		if (!(Number(req.body.quantity)>0)) {
			return res.status(404).send({status: "error", error: "Cantidad para el producto inválida."})
		}
		const quantity = req.body.quantity
		const pindex = foundCart.products.findIndex(p => p._id.toString() === pid);
		if(pindex === -1){
			const product = {
				"_id": pid.toString(),
				"quantity": quantity
			};
			(foundCart.products).push(product);
		} else {
			const totalquantity = Number(foundCart.products[pindex].quantity)+Number(quantity)
			foundCart.products[pindex].quantity = String(totalquantity);
		}
		const result = await cartModel.updateOne({_id:cid}, foundCart);
		return res.send({status: "success", message: "Producto agregado al carrito.", payload: result});
	} catch (error){
		console.log(error)
		return res.status(500).send({status: 'error', error: 'Error al actualizar el carrito.'});
	}
});

// Métodos DELETE para carritos
router.delete('/:cid', async (req,res) => {
	console.log('Id del carrito a vaciar:', req.params.cid);
	try{
		const cid = req.params.cid;
		const foundCart = await cartModel.findOne({_id: cid});
		if (!foundCart) {
			return res.status(404).send({status: "error", error: "Carrito no encontrado."})
		}
		foundCart.products = []
		const result = await cartModel.updateOne({_id:cid}, foundCart);
		return res.send({status:'success', message: 'Carrito vacío.', payload: result});
	} catch (error){
		console.log(error)
		return res.status(500).send({status: 'error', error: 'Error al borrar los productos del carrito.'});
	}
});

router.delete('/:cid/products/:pid', async (req,res) => {
	console.log('Id del carrito a actualizar:', req.params.cid);
	console.log('Id del producto a eliminar:', req.params.pid);
	try{
		const cid = req.params.cid;
		const foundCart = await cartModel.findOne({_id: cid});
		if (!foundCart) {
			return res.status(404).send({status: "error", error: "Carrito no encontrado."})
		}
		const pid = req.params.pid;
		const foundProduct = await productModel.findOne({_id: pid});
		if (!foundProduct) {
			return res.status(404).send({status: "error", error: "Producto no encontrado."})
		}
		const pindex = foundCart.products.findIndex(p => p._id.toString() === pid);
		if(pindex === -1){
			return res.status(404).send({status: "error", error: "Producto en el carrito no encontrado."})
		} else {
			foundCart.products.splice(pindex,1);
		}
		const result = await cartModel.updateOne({_id:cid}, foundCart);
		return res.send({status: "success", message: "Producto eliminado del carrito.", payload: result});
	} catch (error){
		console.log(error)
		return res.status(500).send({status: 'error', error: 'Error al borrar el producto del carrito.'});
	}
});

export default router;