import cartModel from './models/cart.model.js'

class CartDao {
	async findById(cid) {
		return await cartModel.findById(cid);
	}

	async save() {
		const cart = new cartModel({'products': []});
		return await cart.save();
	}

	async updateOne(cid, cartData) {
		return await cartModel.updateOne({_id:cid}, cartData)
	}
}

export default new CartDao();