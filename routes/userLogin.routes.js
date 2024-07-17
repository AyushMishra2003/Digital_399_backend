

import { Router } from 'express';
import { requestLogin, verifyCode } from '../controller/UserLoginController.js';

const LoginUserrouter = Router();

LoginUserrouter.post('/login', requestLogin);
LoginUserrouter.post('/verify', verifyCode);

export default LoginUserrouter;
