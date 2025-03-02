import ReservaModel from '../../../models/reservaSchema.js';
import { internalError } from '../../../helpers/helpers.js';

export class GetController {
  static async getReservas(req, res) {
    try {
      const reservas = await ReservaModel.find({ isActive: true }).populate('userId').populate('motoId');
      res.json({ data: reservas });
    } catch (e) {
      internalError(res, e, 'Ocurrió un error al obtener las reservas');
    }
  }

  static async getReserva(req, res) {
    const { id } = req.params;

    try {
      const reserva = await ReservaModel.findOne({ _id: id, isActive: true }).populate('userId').populate('motoId');
      
      if (!reserva) {
        return res.status(HttpCodes.NOT_FOUND).json({
          data: null,
          message: 'Reserva no encontrada',
        });
      }
      
      res.json({ data: reserva });
    } catch (e) {
      internalError(res, e, 'Ocurrió un error al obtener la reserva');
    }
  }
}
