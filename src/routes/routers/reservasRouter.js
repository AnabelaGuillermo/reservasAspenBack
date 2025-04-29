import express from 'express';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { isAdmin } from '../../middlewares/isAdmin.js';
import { Reservas } from '../../controllers/reservas/index.js';

export const reservasRouter = express.Router();

reservasRouter.get('/', isAuthenticated, Reservas.GetController.getReservas);
reservasRouter.get('/:id', isAuthenticated, Reservas.GetController.getReserva);

reservasRouter.post('/', isAuthenticated, Reservas.PostController.postReserva);

reservasRouter.put(
  '/:id',
  isAuthenticated,
  isAdmin,
  Reservas.PutController.putReserva,
);

reservasRouter.delete(
  '/:id',
  isAuthenticated,
  isAdmin,
  Reservas.DeleteController.deleteReserva,
);
