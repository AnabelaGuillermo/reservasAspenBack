import HttpCodes from 'http-status-codes';

import ReservaModel from '../../../models/reservaSchema.js';
import { internalError } from '../../../helpers/helpers.js';

export class PutController {
  static async putReserva(req, res) {
    const {
      body,
      params: { id },
    } = req;

    try {
      const action = await ReservaModel.updateOne(
        {
          _id: id,
        },
        body,
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
        message: 'Reserva actualizada correctamente',
      });
    } catch (e) {
      internalError(
        res,
        e,
        'Ocurrió un error actualizando el recurso indicado',
      );
    }
  }
}
