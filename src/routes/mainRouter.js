import express from 'express';
import { reservasRouter } from './routers/reservasRouter.js';
import { userRouter } from './routers/userRouter.js';
import { authRouter } from './routers/authRouter.js';

export const mainRouter = express.Router();

mainRouter.use('/reservas', reservasRouter);
mainRouter.use('/users', userRouter);
mainRouter.use('/auth', authRouter);
