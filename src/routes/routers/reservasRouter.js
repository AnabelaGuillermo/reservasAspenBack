import express from 'express';
import { Reservas } from '../../controllers/reservas/index.js';
import { validateBody } from '../../middlewares/validateBody.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { isAdmin } from '../../middlewares/isAdmin.js';

import { post_put_reservasValidationSchema } from '../../helpers/validationSchemas/reservasValidationSchemas.js';

export const reservasRouter = express.Router();

// Rutas para las reservas
reservasRouter.get('/', Reservas.GetController.getReservas); // Obtener todas las reservas
reservasRouter.get('/:id', Reservas.GetController.getReserva); // Obtener una reserva por ID

// Ruta para crear una nueva reserva (solo admin)
reservasRouter.post(
  '/',
  isAuthenticated,
  isAdmin,
  (req, res, next) =>
    validateBody(req, res, next, post_put_reservasValidationSchema),
  Reservas.PostController.postReserva, // Crear nueva reserva
);

// Ruta para editar una reserva (solo admin)
reservasRouter.put(
  '/:id',
  isAuthenticated,
  isAdmin,
  (req, res, next) =>
    validateBody(req, res, next, post_put_reservasValidationSchema),
  Reservas.PutController.putReserva, // Editar reserva
);

// Ruta para eliminar una reserva (solo admin)
reservasRouter.delete(
  '/:id',
  isAuthenticated,
  isAdmin,
  Reservas.DeleteController.deleteReserva, // Eliminar reserva
);
