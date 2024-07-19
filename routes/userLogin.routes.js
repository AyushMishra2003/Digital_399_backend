import { Router } from "express";
import {
  requestLogin,
  Userlogout,
  verifyCode,
} from "../controller/UserLoginController.js";

import sendsms from "../controller/CheckController.js";

const LoginUserrouter = Router();

LoginUserrouter.post("/login", requestLogin);
LoginUserrouter.post("/verify", verifyCode);
LoginUserrouter.post("/logout", Userlogout);
LoginUserrouter.post("/check", sendsms);

export default LoginUserrouter;
