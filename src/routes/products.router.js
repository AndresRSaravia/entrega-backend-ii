import {Router} from 'express';
import productModel from '../models/product.model.js'

const router = Router();

// Métodos GET para productos
router.get('/', async (req,res) => {
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
		return res.send({
			status: 'success',
			payload: infoPaginate.docs,
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

router.get('/:pid', async (req, res) => {
	console.log('Id del producto a buscar:', req.params.pid);
	try{
		const pid = req.params.pid
		const foundProduct = await productModel.findOne({_id: pid});
		console.log(foundProduct)
		return res.send(foundProduct);
	} catch (error){
		console.log(error)
		return res.status(500).send({status: 'error', error: 'Error al obtener el producto.'});
	}
});

// Métodos POST para productos
router.post('/', async (req,res) => {
	console.log('Pedido del creación de producto.');
	console.log('Información del req.body', req.body);
	const incompleteValues1 = !req.body.title||!req.body.description||!req.body.code||(req.body.price == null)
	const incompleteValues2 = (req.body.status == null)||(req.body.stock == null)||!req.body.category||!req.body.thumbnail
	const incompleteValues = incompleteValues1||incompleteValues2
	if(incompleteValues){
		return res.status(400).send({status: 'error', error: 'Valores incompletos.'});
	}
	try{
		const newProduct = new productModel(req.body);
		await newProduct.save();
		return res.json({status: 'success', message: 'Producto agregado exitosamente.'});
	} catch (error){
		console.log(error)
		return res.status(500).send({status: 'error', error: 'Error al crear un producto.'});
	}
});

// Métodos PUT para productos
router.put('/:pid', async (req,res) => {
	delete req.body._id;
	console.log('Id del producto a actualizar:', req.params.pid);
	try{
		const pid = req.params.pid;
		const updatedProduct = req.body;
		const result = await productModel.updateOne({_id: pid}, updatedProduct);
		return res.send({status:'success', message: 'Producto actualizado.', payload: result});
	} catch (error){
		console.log(error)
		return res.status(500).send({status: 'error', error: 'Error al actualizar el producto.'});
	}
});

// Métodos DELETE para productos
router.delete('/:pid', async (req,res) => {
	console.log('Id del producto a eliminar:', req.params.pid);
	try{
		const pid = req.params.pid;
		const result = await productModel.deleteOne({_id: pid});
		if (result.deletedCount == 0){
			return res.send({status:'error', error: 'Producto ya eliminado.'});
		}
		return res.send({status:'success', message: 'Producto eliminado.', payload: result});
	} catch (error){
		console.log(error)
		return res.status(500).send({status: 'error', error: 'Error al borrar el producto.'});
	}
});

export default router;