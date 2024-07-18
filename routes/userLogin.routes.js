

import { Router } from 'express';
import { requestLogin, Userlogout, verifyCode } from '../controller/UserLoginController.js';

const LoginUserrouter = Router();

LoginUserrouter.post('/login', requestLogin);
LoginUserrouter.post('/verify', verifyCode);
LoginUserrouter.post('/logout', Userlogout);

export default LoginUserrouter;
