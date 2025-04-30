import express from 'express';
import { Motos } from '../../controllers/motos/index.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { isAdmin } from '../../middlewares/isAdmin.js';

export const motosRouter = express.Router();

motosRouter.post(
  '/',
  isAuthenticated,
  isAdmin,
  Motos.PostController.postMoto,
);

motosRouter.get('/', Motos.GetController);

motosRouter.put(
  '/:id',
  isAuthenticated,
  isAdmin,
  Motos.PutController,
);

motosRouter.delete(
  '/:id',
  isAuthenticated,
  isAdmin,
  Motos.DeleteController,
);