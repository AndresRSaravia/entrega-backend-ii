// Servicio de carrito y producto
import cartService from '../services/cart.service.js';
import productService from '../services/product.service.js';

class ViewController {
	async indexe(req,res) {
		res.render('index', {})
	}

	async register(req, res) {
		res.render('register', {});
	}

	async login(req, res) {
		res.render('login', {});
	}

	async products(req,res) {
		console.log('Pedido de listado de productos.');
		console.log(req.user);
		console.log(req.user.cart);
		const {limit, page, query, sort} = req.query
		try{
			const [reslimit, respage, resquery, ressort, infoPaginate] = await productService.listProduct(limit, page, query, sort);
			const totalPages = infoPaginate.totalPages
			const prevPage = infoPaginate.prevPage
			const nextPage = infoPaginate.nextPage
			const hasPrevPage = infoPaginate.hasPrevPage
			const hasNextPage = infoPaginate.hasNextPage
			let prevLink = null
			if (hasPrevPage) {
				prevLink = `?limit=${reslimit}&page=${respage-1}&query=${JSON.stringify(resquery).replace(/"/g, "'")}&sort=${ressort}`
			}
			let nextLink = null
			if (hasNextPage) {
				nextLink = `?limit=${reslimit}&page=${respage+1}&query=${JSON.stringify(resquery).replace(/"/g, "'")}&sort=${ressort}`
			}
			let handlebar = 'products'
			if (req.user.role === 'admin') {
				handlebar += 'admin';
			}
			return res.render(handlebar, {
				cart: req.user.cart,
				status: 'success',
				payload: (infoPaginate.docs).map( product => product.toObject()),
				totalPages: totalPages,
				prevPage: prevPage,
				nextPage: nextPage,
				page: page,
				hasPrevPage: hasPrevPage,
				hasNextPage: hasNextPage,
				prevLink: prevLink,
				nextLink: nextLink
			});
		} catch (error){
			console.log(error)
			return res.status(500).send({status: 'error', error: 'Error al obtener el listado de productos.'});
		}
	}

	async productspid(req, res) {
		const pid = req.params.pid
		console.log('Id del producto a buscar:', pid);
		try{
			let foundProduct = await productService.getProductById(pid);
			foundProduct = JSON.parse(JSON.stringify(foundProduct));
			foundProduct.cart = req.user.cart;
			console.log(req.user.cart)
			console.log(foundProduct)
			let handlebar = 'showproduct'
			if (req.user.role === 'admin') {
				handlebar += 'admin';
			}
			return res.render(handlebar, foundProduct);
		} catch (error){
			console.log(error)
			return res.status(500).send({status: 'error', error: 'Error al obtener el producto.'});
		}
	}

	async cartproducts(req,res) {
		console.log('Pedido viewer de listado de productos de un carrito.');
		console.log('Id del carrito a buscar:', req.params.cid);
		const cid = req.params.cid;
		try{
			const foundCart = await cartService.getCartById(cid); //cartModel.findOne({_id: cid})
			//foundCart = foundCart.toObject()
			let prodpop = [];
			for (let key in foundCart.products) {
				let product = foundCart.products[key];
				let pid = product._id;
				let foundProduct = await productService.getProductById(pid);
				foundProduct = JSON.parse(JSON.stringify(foundProduct));
				foundProduct.quantity = product.quantity;
				foundProduct.notenough = foundProduct.quantity > foundProduct.stock;
				console.log(foundProduct.notenough)
				prodpop.push(foundProduct)
			}
			//console.log(prodpop[1].quantity)
			return res.render('cartproducts', {prodpop,cid});
		} catch (error){
			console.log(error)
			return res.status(500).send({status: 'error', error: 'Error al encontrar el carrito.'});
		}
	}
}

export default new ViewController();