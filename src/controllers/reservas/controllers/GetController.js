import HttpCodes from 'http-status-codes';
import ReservaModel from '../../../models/reservaSchema.js';

export class GetController {
  static async getReservas(req, res) {
    const { user } = req;

    try {
      if (user.isAdmin) {
        const reservas = await ReservaModel.find().populate('userId motoId');
        res.json({
          data: reservas,
          message: 'Reservas obtenidas con éxito',
        });
      } else {
        const reservas = await ReservaModel.find({ userId: user._id }).populate('motoId');
        res.json({
          data: reservas,
          message: 'Tus reservas obtenidas con éxito',
        });
      }
    } catch (e) {
      internalError(res, e, 'Error al obtener las reservas');
    }
  }
}
