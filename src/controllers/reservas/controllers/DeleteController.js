import HttpCodes from 'http-status-codes';
import ReservaModel from '../../../models/reservaSchema.js';
import { internalError } from '../../../helpers/helpers.js';

export class DeleteController {
  static async deleteReserva(req, res) {
    const {
      params: { id },
    } = req;

    try {
      const action = await ReservaModel.updateOne(
        {
          _id: id,
          isActive: true,
        },
        {
          isActive: false,
        },
      );

      if (action.matchedCount === 0) {
        res.status(HttpCodes.BAD_REQUEST).json({
          data: null,
          message: 'La reserva indicada no fue encontrada',
        });
        return;
      }

      res.json({
        data: null,
        message: 'Reserva eliminada correctamente',
      });
    } catch (e) {
      internalError(res, e, 'Ocurrió un error eliminando el recurso indicado');
    }
  }
}
