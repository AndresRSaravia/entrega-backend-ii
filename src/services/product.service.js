// Repositorio de producto
import productRepository from '../repositories/product.repository.js'

class ProductService {
	async addProduct(productData) {
		const {title, description, code, price, status, stock, category, thumbnail} = productData
		const incompleteValues1 = !title||!description||!code||(price == null)
		const incompleteValues2 = (status == null)||(stock == null)||!category||!thumbnail
		const incompleteValues = incompleteValues1||incompleteValues2
		if(incompleteValues) throw new Error('Valores incompletos', code)
		const productExists = await productRepository.getProductByQuery({code: code});
		if(productExists) throw new Error('El producto con ese código ya existe:', code)
		return await productRepository.createProduct(productData)
	}

	async listProduct(arglimit, argpage, argquery, argsort) {
		let limit = 10
		if (Number(arglimit)>0) {
			limit = Math.ceil(Number(arglimit))
		}
		let page = 1
		if (Number(argpage)>0) {
			page = Math.ceil(Number(argpage))
		}
		let query = {}
		if ((!!argquery) && (JSON.parse(argquery).constructor == Object)) {
			query = JSON.parse(argquery)
		}
		let sort = argsort
		let pricesort = undefined
		if (sort == '1' || sort == '-1') {
			pricesort = {price: Number(sort)};
		}
		return [limit, page, query, sort, await productRepository.listPage(limit, page, query, pricesort)];
	}

	async getProductById(pid) {
		const foundProduct = await productRepository.findProductById(pid);
		if(!foundProduct) throw new Error('Producto no encontrado');
		return foundProduct;
	}

	async editProduct(pid, productData) {
		const foundProduct = await productRepository.findProductById(pid);
		if(!foundProduct) throw new Error('Producto no encontrado');
		return await productRepository.updateProduct(pid, productData);
	}

	async removeProduct(pid) {
		const foundProduct = await productRepository.findProductById(pid);
		if(!foundProduct) throw new Error('Producto no encontrado');
		return await productRepository.deleteProduct(pid);
	}
}

export default new ProductService();