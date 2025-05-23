import jwt from 'jsonwebtoken';
import UserDTO from '../dto/user.dto.js';

// Servicio de usuario
import userService from '../services/user.service.js';

class UserController {
	async register(req, res) {
		const {first_name, last_name, age, email, password} = req.body;
		try {
			const user = await userService.registerUser({first_name, last_name, age, email, password})
			const token = jwt.sign({
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.email,
				role: user.role,
				age: user.age,
				cart: user.cart
			}, 'coderhouse', {expiresIn: '1h'});
			res.cookie('coderCookieToken', token, {httpOnly: true, maxAge: 3600000});
			res.redirect('/api/sessions/current');
		} catch (error) {
			console.error('Error al registrar usuario', error);
			res.status(500).send({status: 'error', error: 'Error interno del servidor'});
		}
	}

	async login(req, res) {
		const {email, password} = req.body;
		try {
			const user = await userService.loginUser(email, password);
			const token = jwt.sign({
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.email,
				role: user.role,
				age: user.age,
				cart: user.cart
			}, 'coderhouse', {expiresIn: '1h'});
			res.cookie('coderCookieToken', token, {httpOnly: true, maxAge: 3600000});
			res.redirect('/api/sessions/current');
		} catch (error) {
			console.error('Error al hacer login', error);
			res.status(500).send({status: 'error', error: 'Error interno del servidor'});
		}
	}

	async current(req, res) {
		if (req.user) {
			const user = req.user;
			console.log(user);
			const userDTO = new UserDTO(user);
			console.log(userDTO);
			res.render('profile', {user: userDTO});
		} else {
			return res.status(403).send('Acceso Denegado');
		}
	}

	async logout(req, res) {
		res.clearCookie('coderCookieToken');
		res.redirect('/login');
	}
}

export default new UserController();