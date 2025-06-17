import HttpCodes from 'http-status-codes';
import MotoModel from '../../../models/motoSchema.js';
import { internalError } from '../../../helpers/helpers.js';
import { registrarActividad } from '../../actividades/index.js';

export class PostController {
  static async postMoto(req, res) {
    const { name, quantity } = req.body;

    try {
      const moto = new MotoModel({ name, quantity });
      await moto.save();

      await registrarActividad(req.user._id, 'Cargar moto', `Moto ${name} creada con ${quantity} unidades.`);

      res.status(HttpCodes.CREATED).json({
        data: moto,
        message: 'Moto creada exitosamente',
      });
    } catch (e) {
      internalError(res, e, 'Error al crear la moto');
    }
  }
}