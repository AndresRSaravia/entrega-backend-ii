import { Router } from 'express';
import cartModel from '../dao/models/cart.model.js'
import productModel from '../dao/models/product.model.js'

const router = Router();

router.get('/',(req,res) => {
	res.render('index', {})
});

router.get('/register', (req, res) => {
    res.render('register', {});
})

router.get('/login', (req, res) => {
    res.render('login', {});
})

router.get('/products', async (req,res) => {
	console.log('Pedido de listado de productos.');
	try{
		let limit = 10
		if (Number(req.query.limit)>0) {
			limit = Math.ceil(Number(req.query.limit))
		}
		let page = 1
		if (Number(req.query.page)>0) {
			page = Math.ceil(Number(req.query.page))
		}
		let query = {}
		if ((!!req.query.query) && (JSON.parse(req.query.query).constructor == Object)) {
			query = JSON.parse(req.query.query)
		}
		let sortorder = req.query.sort
		let infoPaginate = {}
		if (sortorder == '1' || sortorder == -1) {
			infoPaginate = await productModel.paginate(query,{limit: limit, page: page, sort: {price: Number(sortorder)}});
		} else {
			infoPaginate = await productModel.paginate(query,{limit: limit, page: page});
		}
		console.log(infoPaginate);
		// let usersObject = infoPaginate.docs.map( doc => doc.toObject());
		// res.render('index', {info: infoPaginate, users: usersObject});
		const totalPages = infoPaginate.totalPages
		const prevPage = infoPaginate.prevPage
		const nextPage = infoPaginate.nextPage
		const hasPrevPage = infoPaginate.hasPrevPage
		const hasNextPage = infoPaginate.hasNextPage
		let prevLink = null
		if (hasPrevPage) {
			prevLink = `?limit=${limit}&page=${page-1}&query=${JSON.stringify(query).replace(/"/g, "'")}&sort=${sortorder}`
		}
		let nextLink = null
		if (hasNextPage) {
			nextLink = `?limit=${limit}&page=${page+1}&query=${JSON.stringify(query).replace(/"/g, "'")}&sort=${sortorder}`
		}
		console.log(infoPaginate.docs)
		return res.render('products', {
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
});

router.get('/products/:pid', async (req, res) => {
	console.log('Id del producto a buscar:', req.params.pid);
	try{
		const pid = req.params.pid
		const foundProduct = await productModel.findOne({_id: pid});
		console.log(foundProduct)
		return res.render('showproduct',foundProduct);
	} catch (error){
		console.log(error)
		return res.status(500).send({status: 'error', error: 'Error al obtener el producto.'});
	}
});

// Métodos GET para productos
router.get('/cartproducts/:cid', async (req,res) => {
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