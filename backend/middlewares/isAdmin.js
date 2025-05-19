//Middleware que verifica se o usuário autenticado tem papel de administrador
function isAdmin(req, res, next) {
  if (req.auth.papel !== "admin") {
    return res
      .status(401)
      .json({ msg: "Usuário não autorizado para esta rota!" });
  }

  next();
}

export default isAdmin;
