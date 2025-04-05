import productModel from './models/product.model.js'

class ProductDao {
	async save(productData) {
		const product = new productModel(productData);
		return await product.save();
	}

	async paginate(limit, page, query, pricesort) {
		return await productModel.paginate(query,{limit: limit, page: page, sort: pricesort});
	}

	async findById(pid) {
		return await productModel.findById(pid);
	}

	async findOne(query) {
		return await productModel.findOne(query)
	}

	async updateOne(pid, productData) {
		return await productModel.updateOne({_id: pid}, productData);
	}

	async deleteOne(pid) {
		return await productModel.deleteOne({_id: pid})
	}
}

export default new ProductDao();