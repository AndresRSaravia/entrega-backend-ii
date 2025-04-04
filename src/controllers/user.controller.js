import jwt from 'jsonwebtoken'
import passport from 'passport';

// Servicio de usuario
import userService from '../services/user.services.js';

class UserConstroller {
	async register(req, res) {
		const {first_name, last_name, age, email, password} = req.body;
		try {
			const newUser = await userService.registerUser({first_name, last_name, age, email, password})
			const token = jwt.sign({email: newUser.email, role: newUser.role}, 'coderhouse', {expiresIn: '1h'});
			res.cookie('coderCookieToken', token, {httpOnly: true, maxAge: 3600000});
			res.redirect('/api/sessions/current');
		} catch (error) {
			console.error('Error al registrar usuario', error);
			res.status(500).send({error: 'Error interno del servidor'});
		}
	}

	async login(req, res) {
		const {email, password} = req.body;
		try {
			const user = await userService.loginUser(email, password)
			const token = jwt.sign({email: user.email, role: user.role}, 'coderhouse', {expiresIn: '1h'});
			res.cookie('coderCookieToken', token, {httpOnly: true, maxAge: 3600000});
			res.redirect('/api/sessions/current');
		} catch (error) {
			console.error('Error al hacer login', error);
			res.status(500).send({error: 'Error interno del servidor'});
		}
	}

	async current(req, res) {
		if (req.user) {
			const user = req.user
			res.render('profile', user)
		} else {
			res.send("No autorizado.")
		}
	}

	async logout(req, res) {
		res.clearCookie('coderCookieToken');
		res.redirect('/login');
	}
}

export default new UserConstroller();