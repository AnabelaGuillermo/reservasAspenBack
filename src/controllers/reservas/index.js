// src/controllers/reservas/index.js
import { DeleteController } from './controllers/DeleteController.js';
import { GetController } from './controllers/GetController.js';
import { PostController } from './controllers/PostController.js';
import { PutController } from './controllers/PutController.js';
import { RestoreController } from './controllers/RestoreController.js'; // Importa el nuevo controlador

export const Reservas = {
  GetController,
  PostController,
  PutController,
  DeleteController,
  RestoreController, // Exporta el nuevo controlador
};