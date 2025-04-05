// DAO
import cartDao from '../dao/cart.dao.js';

class CartRepository {
	async findCartById(cid) {
		return await cartDao.findById(cid);
	}

	async createCart() {
		return await cartDao.save();
	}

	async updateCart(cid, cartData) {
		return await cartDao.updateOne(cid, cartData)
	}
}

export default new CartRepository();