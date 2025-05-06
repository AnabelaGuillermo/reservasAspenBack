import HttpCodes from 'http-status-codes';
import ReservaModel from '../../../models/reservaSchema.js';
import { internalError } from '../../../helpers/helpers.js';

export class DeleteController {
  static async deleteReserva(req, res) {
    const { id } = req.params;

    try {
      const reserva = await ReservaModel.findByIdAndDelete(id);
      console.log('Reserva eliminada:', reserva);

      if (!reserva) {
        return res.status(HttpCodes.NOT_FOUND).json({
          message: 'No se encontró la reserva a eliminar',
        });
      }

      res.status(HttpCodes.OK).json({
        message: 'Reserva eliminada con éxito',
      });
    } catch (error) {
      console.error('Error al eliminar la reserva:', error);
      internalError(res, error, 'Error al eliminar la reserva');
    }
  }
}