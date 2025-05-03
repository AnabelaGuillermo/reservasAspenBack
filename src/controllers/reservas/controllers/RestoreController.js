import HttpCodes from 'http-status-codes';
import ReservaModel from '../../../models/reservaSchema.js';
import { internalError } from '../../../helpers/helpers.js';

export class RestoreController {
  static async restoreReserva(req, res) {
    const {
      motoId,
      recibo,
      numeroComanda,
      cliente,
      observaciones,
      fecha,
      hora,
      userId,
    } = req.body;

    try {
      const reserva = new ReservaModel({
        userId: userId,
        motoId,
        fecha,
        hora,
        recibo,
        numeroComanda,
        cliente,
        observaciones,
        modifiedBy: req.user._id,
      });

      await reserva.save();

      res.status(HttpCodes.CREATED).json({
        data: reserva,
        message: 'Reserva restaurada con éxito',
      });
    } catch (e) {
      internalError(res, e, 'Error al restaurar la reserva');
    }
  }
}
