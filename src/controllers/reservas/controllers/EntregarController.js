import HttpCodes from 'http-status-codes';
import ReservaModel from '../../../models/reservaSchema.js';
import { internalError } from '../../../helpers/helpers.js';

export class EntregarController {
  static async entregarReserva(req, res) {
    const { id } = req.params;

    try {
      const reserva = await ReservaModel.findByIdAndUpdate(
        id,
        { entregado: true, fechaEntrega: new Date() },
        { new: true },
      );

      if (!reserva) {
        return res.status(HttpCodes.NOT_FOUND).json({
          message: 'No se encontró la reserva a entregar',
        });
      }

      res.status(HttpCodes.OK).json({
        message: 'Reserva marcada como entregada con éxito',
        data: reserva,
      });
    } catch (error) {
      console.error('Error al entregar la reserva:', error);
      internalError(res, error, 'Error al entregar la reserva');
    }
  }
}

