import * as dotenv from "dotenv";
import { expressjwt } from "express-jwt";
dotenv.config();
const authMiddleware = expressjwt({
  secret: process.env.TOKEN_SIGN_SECRET,
  algorithms: ["HS256"],
});

const handleAuth = (req, res, next) => {
  authMiddleware(req, res, (err) => {
    if (err) {
      if (err.message === "jwt expired") {
        res
          .status(401)
          .send({ msg: "Sua sessão expirou, realize novo login." });
        return;
      }
      if (err.message === "No authorization token was found") {
        res.status(401).send({ msg: "Realize login para continuar." });
        return;
      }
    }
    next();
  });
};

export default handleAuth;
