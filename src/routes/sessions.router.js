import {Router} from 'express';
import passport from 'passport';
const router = Router();

// Controlador de usuario
import userController from '../controllers/user.controller.js'

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/current', passport.authenticate('jwt', {session: false}), userController.current);
router.post('/logout', userController.logout);
router.get('/admin', passport.authenticate('jwt', {session: false}), (req, res) => {
	if(req.user.role !== 'admin') {
		return res.status(403).send('Acceso Denegado')
	}
	res.render('admin')
});

/*
router.post('/login', async (req, res) => {
	try {
		const {email, password} = req.body;
		const user = await userModel.findOne({email});
		// Validaciones
		if(!user) {
			return res.status(401).json({error: 'Usuario no encontrado'});
		}
		if(!isValidPassword(password, user)) {
			return res.status(401).json({error: 'Contraseña incorrecta'});
		}
		// Generación de token
		const token = jwt.sign({email: user.email, role: user.role}, 'coderhouse', {expiresIn: '1h'});
		res.cookie('coderCookieToken', token, {httpOnly: true, maxAge: 3600000});
		res.redirect('/api/sessions/current');
	} catch (error) {
		console.error('Error al hacer login', error);
		res.status(500).json({error: 'Error interno del servidor'});
	}
});

router.post('/register', async (req, res) => {
	try {
		const {first_name, last_name, age, email, password} = req.body;
		console.log(bcrypt.hashSync(password, bcrypt.genSaltSync(10)))
		const newCart = new cartModel({'products': []})
		await newCart.save()
		const user = new userModel({
			first_name: first_name,
			last_name: last_name,
			age: Number(age),
			email: email,
			password: createHash(password),
			cart: newCart._id
		});
		await user.save();
		res.redirect('/login');
	} catch (error) {
		console.error('Error al registrar usuario', error);
		res.status(500).json({error: 'Error interno del servidor'});
	}
});

router.post('/logout', (req, res) => {
	res.clearCookie('coderCookieToken');
	res.redirect('/login');
});

router.get('/current', passport.authenticate('current', {session: false}), async (req, res) => {
	if (req.user) {
		console.log(req.user)
		const user = await (userModel.findOne({email: req.user.email})).lean();
		res.render('profile', {user: user})
	} else {
		res.send("No autorizado.")
	}
});


*/
export default router;