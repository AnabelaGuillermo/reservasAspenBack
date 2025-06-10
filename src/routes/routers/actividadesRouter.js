import express from 'express';
import { GetController } from '../../controllers/actividades/controllers/GetController.js'; 
import { isAdmin } from '../../middlewares/isAdmin.js'; 
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';

export const actividadesRouter = express.Router();

actividadesRouter.get('/', isAuthenticated, isAdmin, GetController.getActividades);