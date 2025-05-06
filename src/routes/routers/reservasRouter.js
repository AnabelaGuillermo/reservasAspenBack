import express from 'express';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { isAdmin } from '../../middlewares/isAdmin.js';
import { Reservas } from '../../controllers/reservas/index.js';
import { EntregarController } from '../../controllers/reservas/controllers/EntregarController.js';
import { MarcarEntregadoController } from '../../controllers/reservas/controllers/MarcarEntregadoController.js';
import { MoverEntregadaController } from '../../controllers/reservas/controllers/MoverEntregadaController.js';

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

reservasRouter.put(
  '/:id/entregar',
  isAuthenticated,
  isAdmin,
  MarcarEntregadoController.marcarEntregado,
);

reservasRouter.delete(
  '/:id',
  isAuthenticated,
  isAdmin,
  Reservas.DeleteController.deleteReserva,
);

reservasRouter.post(
  '/restore',
  isAuthenticated,
  isAdmin,
  Reservas.RestoreController.restoreReserva,
);

reservasRouter.post(
  '/entregar/:id',
  isAuthenticated,
  isAdmin,
  EntregarController.entregarReserva,
);

reservasRouter.post(
  '/entregadas/:id/mover',
  isAuthenticated,
  isAdmin,
  MoverEntregadaController.moverReserva,
);

export default reservasRouter;