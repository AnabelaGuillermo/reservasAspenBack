import HttpCodes from 'http-status-codes';
import ReservaModel from '../../../models/reservaSchema.js';
import { internalError } from '../../../helpers/helpers.js';

export class MarcarEntregadoController {
  static async marcarEntregado(req, res) {
    const { id } = req.params;

    try {
      const reserva = await ReservaModel.findByIdAndUpdate(
        id,
        { entregado: true, fechaEntrega: new Date() },
        { new: true }
      );

      if (!reserva) {
        return res.status(HttpCodes.NOT_FOUND).json({
          message: 'No se encontró la reserva a marcar como entregada',
        });
      }

      res.status(HttpCodes.OK).json({
        message: 'Reserva marcada como entregada con éxito',
        data: reserva,
      });
    } catch (error) {
      console.error('Error al marcar la reserva como entregada:', error);
      internalError(res, error, 'Error al marcar la reserva como entregada');
    }
  }
}