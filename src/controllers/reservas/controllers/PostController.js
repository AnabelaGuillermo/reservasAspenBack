import HttpCodes from 'http-status-codes';
import ReservaModel from '../../../models/reservaSchema.js';
import { internalError } from '../../../helpers/helpers.js';

export class PostController {
  static async postReserva(req, res) {
    const { motoId, fecha, hora, recibo, numeroComanda, observaciones } = req.body;
    const { user } = req;

    try {
      const reserva = new ReservaModel({
        userId: user._id,
        motoId,
        fecha,
        hora,
        recibo,
        numeroComanda,
        observaciones,
        modifiedBy: user._id,
      });

      await reserva.save();

      res.status(HttpCodes.CREATED).json({
        data: reserva,
        message: 'Reserva realizada con éxito',
      });
    } catch (e) {
      internalError(res, e, 'Error al realizar la reserva');
    }
  }
}
