import HttpCodes from 'http-status-codes';
import MotoModel from '../../../models/motoSchema.js';
import { internalError } from '../../../helpers/helpers.js';
import { registrarActividad } from '../../actividades/index.js';

export class IncrementStockController {
  static async incrementStock(req, res) {
    const { id } = req.params;

    try {
      const moto = await MotoModel.findByIdAndUpdate(
        id,
        { $inc: { quantity: 1 } },
        { new: true }
      );

      if (!moto) {
        return res.status(HttpCodes.NOT_FOUND).json({
          message: 'No se encontró la moto para actualizar el stock.',
        });
      }

      await registrarActividad(req.user._id, 'Incrementar stock', `Se incrementó el stock de la moto ${moto.name}. Nuevo stock: ${moto.quantity}`);

      res.status(HttpCodes.OK).json({
        message: 'Stock de la moto incrementado con éxito.',
        data: moto,
      });

    } catch (error) {
      console.error('Error al incrementar el stock de la moto:', error);
      internalError(res, error, 'Error al incrementar el stock de la moto.');
    }
  }
}