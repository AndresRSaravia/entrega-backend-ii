// DAO
import productDao from '../dao/product.dao.js';

class ProductRepository {
	async createProduct(productData) {
		return await productDao.save(productData);
	}

	async listPage(limit, page, query, pricesort) {
		return await productDao.paginate(limit, page, query, pricesort)
	}

	async findProductById(pid) {
		return await productDao.findById(pid);
	}

	async getProductByQuery(query) {
		return await productDao.findOne(query);
	}

	async updateProduct(pid, productData) {
		return await productDao.updateOne(pid, productData);
	}

	async deleteProduct(pid) {
		return await productDao.deleteOne(pid);
	}
}

export default new ProductRepository();