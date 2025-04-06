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

export default router;