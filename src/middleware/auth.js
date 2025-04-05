export function onlyAdmin(req, res, next) {
	req.user.role === "admin" ? next() : res.status(403).send("Lugar sólo para administradores");
}

export function onlyUser(req, res, next) {
	req.user.role === "user" ? next() : res.status(403).send("Lugar sólo para usuarios comunes");
}