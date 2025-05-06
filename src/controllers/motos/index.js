// src/controllers/motos/index.js
import { PostController } from './controllers/PostController.js';
import { GetController } from './controllers/GetController.js';
import { PutController } from './controllers/PutController.js';
import { DeleteController } from './controllers/DeleteController.js';
import { IncrementStockController } from './controllers/IncrementStockController.js'; // Importa el nuevo controlador

export const Motos = {
  PostController,
  GetController,
  PutController,
  DeleteController,
  IncrementStockController, // Exporta el nuevo controlador
};