import { createHash, isValidPassword } from '../utils/utilscrypt.js'

// Repositorio de usuario
import userRepository from '../repositories/user.repository.js'
import cartModel from '../dao/models/cart.model.js';

class UserService {
	async registerUser(userData) {
		const userExists = await userRepository.getUserByEmail(userData.email);
		if(userExists) throw new Error('El usuario ya existe')
		userData.password = createHash(userData.password);
		const newCart = new cartModel({'products': []})
		userData.cart = newCart._id
		return await userRepository.createUser(userData)
	}

	async loginUser(email, password) {
		const user = await userRepository.getUserByEmail(email);
		// Validaciones
		if(!user) throw new Error('Usuario no encontrado');
		if(!isValidPassword(password, user)) throw Error('Contraseña incorrecta');
		return user;
	}
}

export default new UserService();