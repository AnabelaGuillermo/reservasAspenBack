import { DeleteController } from './controllers/DeleteController.js';
import { GetController } from './controllers/GetController.js';
import { PostController } from './controllers/PostController.js';
import { PutController } from './controllers/PutController.js';
import { RestoreController } from './controllers/RestoreController.js';
import { MarcarEntregadoController } from './controllers/MarcarEntregadoController.js';
import { MoverEntregadaController } from './controllers/MoverEntregadaController.js';

export const Reservas = {
  GetController,
  PostController,
  PutController,
  DeleteController,
  RestoreController,
  MarcarEntregadoController,
  MoverEntregadaController,
};