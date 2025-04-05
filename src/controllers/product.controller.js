// Servicio de producto
import productService from '../services/product.service.js';

class ProductController {
	async postProduct(req,res) {
		console.log('Pedido del creación de producto.');
		console.log('Información del req.body', req.body);
		const {title, description, code, price, status, stock, category, thumbnail} = req.body
		try{
			const newProduct = await productService.addProduct({title, description, code, price, status, stock, category, thumbnail})
			return res.json({status: 'success', message: 'Producto agregado exitosamente.'});
		} catch (error){
			console.error('Error al crear un procucto', error)
			return res.status(500).send({status: 'error', error: 'Error al crear un producto.'});
		}
	}

	async getProductPaginate(req,res) {
		console.log('Pedido de listado de productos.');
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
			console.error('Error al obtener el listado de productos', error)
			return res.status(500).send({status: 'error', error: 'Error al obtener el listado de productos.'});
		}
	}

	async getProductById(req, res) {
		console.log('Id del producto a buscar:', req.params.pid);
		const pid = req.params.pid
		try{
			const foundProduct = await productService.getProductById(pid)
			return res.send(foundProduct);
		} catch (error){
			console.error('Error al obtener el producto', error)
			return res.status(500).send({status: 'error', error: 'Error al obtener el producto.'});
		}
	}

	async putProduct(req,res) {
		delete req.body._id;
		console.log('Id del producto a actualizar:', req.params.pid);
		const pid = req.params.pid;
		const productData = req.body;
		try{
			const result = await productService.editProduct(pid, productData);
			return res.send({status:'success', message: 'Producto actualizado.', payload: result});
		} catch (error){
			console.error('Error al actualizar el producto', error)
			return res.status(500).send({status: 'error', error: 'Error al actualizar el producto.'});
		}
	}

	async deleteProduct(req,res) {
		console.log('Id del producto a eliminar:', req.params.pid);
		const pid = req.params.pid;
		try{
			const result = await productService.removeProduct(pid);
			return res.send({status:'success', message: 'Producto eliminado.', payload: result});
		} catch (error){
			console.error('Error al borrar el producto', error)
			return res.status(500).send({status: 'error', error: 'Error al borrar el producto.'});
		}
	}
}

export default new ProductController();