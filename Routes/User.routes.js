import express from 'express';
import { login,register,logoutUser,updateuser } from '../Controllers/user.controller.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/logout', logoutUser);
userRouter.put('/update', updateuser);


export default userRouter;