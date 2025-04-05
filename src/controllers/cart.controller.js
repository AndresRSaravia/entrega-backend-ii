// Servicio de carrito y producto
import cartService from '../services/cart.service.js';
import productService from '../services/product.service.js';

class CartController {
	async getCartById(req, res) {
		console.log('Id del carrito a buscar:', req.params.cid);
		const cid = req.params.cid;
		try{
			const foundCart = await cartService.getCartById(cid);
			return res.send(foundCart);
		} catch (error){
			console.log(error)
			return res.status(500).send({status: 'error', error: 'Error al encontrar el carrito.'});
		}
	}

	async postCart(req,res) {
		try{
			console.log('Pedido de creación de carrito.');
			const newCart = cartService.createCart()
			return res.json({status: 'success', message: 'Carrito agregado exitosamente.'});
		} catch (error){
			console.log(error)
			return res.status(500).send({status: 'error', error: 'Error al crear un producto.'});
		}
	}

	async putCartManyProducts(req,res) {
		console.log('Id del carrito a actualizar:', req.params.cid);
		console.log('Lista de productos a aplicar:', req.body.products);
		const cid = req.params.cid;
		const products = req.body.products;
		try{
			const foundCart = await cartService.getCartById(cid);
			for (let index = 0; index < products.length; index++) {
				const element = products[index];
				const pid = element._id;
				const foundProduct = await productService.getProductById(pid);
				if (!(Number(element.quantity)>0)) {
					throw new Error(`Cantidad inválida para la Id de producto: ${pid} con ${element.quantity}`)
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
			const result = await cartService.editCart(cid, foundCart);
			return res.send({status: "success", message: "Producto agregado al carrito.", payload: result});
		} catch (error){
			console.log(error)
			return res.status(500).send({status: 'error', error: 'Error al actualizar el carrito.'});
		}
	}

	async putCartOneProduct(req,res) {
		console.log('Id del carrito a actualizar:', req.params.cid);
		console.log('Id del producto a actualizar:', req.params.pid);
		console.log('Cantidad a agregar:', req.body.quantity);
		const cid = req.params.cid;
		const pid = req.params.pid;
		const quantity = req.body.quantity
		try{
			const foundCart = await cartService.getCartById(cid);
			const foundProduct = await productService.getProductById(pid);
			if (!(Number(quantity)>0)) {
				throw new Error(`Cantidad inválida para la Id de producto: ${pid} con ${quantity}`)
			}
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
			const result = await cartService.editCart(cid, foundCart);
			return res.send({status: "success", message: "Producto agregado al carrito.", payload: result});
		} catch (error){
			console.log(error)
			return res.status(500).send({status: 'error', error: 'Error al actualizar el carrito.'});
		}
	}

	async emptyCartAll(req,res) {
		console.log('Id del carrito a vaciar:', req.params.cid);
		const cid = req.params.cid;
		try{
			const foundCart = await cartService.getCartById(cid);
			foundCart.products = []
			const result = await cartService.editCart(cid, foundCart);
			return res.send({status:'success', message: 'Carrito vacío.', payload: result});
		} catch (error){
			console.log(error)
			return res.status(500).send({status: 'error', error: 'Error al borrar los productos del carrito.'});
		}
	}

	async emptyCartOne(req,res) {
		console.log('Id del carrito a actualizar:', req.params.cid);
		console.log('Id del producto a eliminar:', req.params.pid);
		const cid = req.params.cid;
		const pid = req.params.pid;
		try{
			const foundCart = await cartService.getCartById(cid);
			const foundProduct = await productService.getProductById(pid);
			const pindex = foundCart.products.findIndex(p => p._id.toString() === pid);
			if(pindex === -1){
				throw new Error(`Producto en el carrito no encontrado: ${pid}`)
			} else {
				foundCart.products.splice(pindex,1);
			}
			const result = await cartService.editCart(cid, foundCart);
			return res.send({status: "success", message: "Producto eliminado del carrito.", payload: result});
		} catch (error){
			console.log(error)
			return res.status(500).send({status: 'error', error: 'Error al borrar el producto del carrito.'});
		}
	}
}

export default new CartController();