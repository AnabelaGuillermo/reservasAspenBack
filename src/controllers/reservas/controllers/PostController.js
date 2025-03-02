import HttpCodes from 'http-status-codes';
import ReservaModel from '../../../models/reservaSchema.js';
import { internalError } from '../../../helpers/helpers.js';

export class PostController {
  static async postReserva(req, res) {
    const { body } = req;
    
    try {
      const reserva = new ReservaModel({
        userId: req.user.id,
        motoId: body.motoId,
        fecha: body.fecha,
        hora: body.hora,
        recibo: body.recibo,
        numeroComanda: body.numeroComanda,
        observaciones: body.observaciones,
      });

      await reserva.save();
      
      res.status(HttpCodes.CREATED).json({
        data: reserva,
        message: 'Reserva creada exitosamente',
      });
    } catch (e) {
      internalError(res, e, 'Ocurrió un error al crear la reserva');
    }
  }
}
