import HttpCodes from 'http-status-codes';
import MotoModel from '../../../models/motoSchema.js';
import { internalError } from '../../../helpers/helpers.js';

export class PostController {
  static async postMoto(req, res) {
    const { name, quantity } = req.body;

    try {
      const moto = new MotoModel({ name, quantity });
      await moto.save();

      res.status(HttpCodes.CREATED).json({
        data: moto,
        message: 'Moto creada exitosamente',
      });
    } catch (e) {
      internalError(res, e, 'Error al crear la moto');
    }
  }
}
