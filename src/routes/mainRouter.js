import express from 'express';
import { reservasRouter } from './routers/reservasRouter.js';
import { userRouter } from './routers/userRouter.js';
import { authRouter } from './routers/authRouter.js';
import { motosRouter } from './routers/motosRouter.js';
import { actividadesRouter } from './routers/actividadesRouter.js';

export const mainRouter = express.Router();

mainRouter.use('/reservas', reservasRouter);
mainRouter.use('/users', userRouter);
mainRouter.use('/auth', authRouter);
mainRouter.use('/motos', motosRouter);
mainRouter.use('/actividades', actividadesRouter);