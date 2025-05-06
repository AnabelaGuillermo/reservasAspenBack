import HttpCodes from 'http-status-codes';
import ReservaModel from '../../../models/reservaSchema.js';
import { internalError } from '../../../helpers/helpers.js';

export class RestoreController {
  static async restoreReserva(req, res) {
    const { _id } = req.body;

    try {
      const reservaRestaurada = await ReservaModel.findByIdAndUpdate(
        _id,
        { entregado: false, fechaEntrega: null },
        { new: true }
      );

      if (!reservaRestaurada) {
        return res.status(HttpCodes.NOT_FOUND).json({
          message: 'No se encontró la reserva entregada con este ID.',
        });
      }

      res.status(HttpCodes.OK).json({
        data: reservaRestaurada,
        message: 'Entrega deshecha con éxito. La reserva ha vuelto a la lista.',
      });
    } catch (e) {
      console.error('Error al deshacer la entrega:', e);
      internalError(res, e, 'Error al deshacer la entrega');
    }
  }
}