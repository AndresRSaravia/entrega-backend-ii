// Repositorio de carrito
import cartRepository from '../repositories/cart.repository.js'

class CartService {
	async getCartById(cid) {
		const foundCart = await cartRepository.findCartById(cid);
		if(!foundCart) throw new Error('Carrito no encontrado');
		return foundCart;	
	}

	async createCart() {
		return await cartRepository.createCart();
	}

	async editCart(cid, cartData) {
		const foundCart = await cartRepository.findCartById(cid);
		if(!foundCart) throw new Error('Carrito no encontrado');
		return await cartRepository.updateCart(cid, cartData);
	}
}

export default new CartService();