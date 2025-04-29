import HttpCodes from 'http-status-codes';
import ReservaModel from '../../../models/reservaSchema.js';
import { internalError } from '../../../helpers/helpers.js';

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
        const reservas = await ReservaModel.find({ userId: user._id }).populate(
          'motoId',
        );
        res.json({
          data: reservas,
          message: 'Tus reservas obtenidas con éxito',
        });
      }
    } catch (e) {
      internalError(res, e, 'Error al obtener las reservas');
    }
  }

  static async getReserva(req, res) {
    const { id } = req.params;
    const { user } = req;

    try {
      const reserva = await ReservaModel.findById(id).populate('motoId userId');

      if (!reserva) {
        return res.status(HttpCodes.NOT_FOUND).json({
          data: null,
          message: 'Reserva no encontrada',
        });
      }

      if (!user.isAdmin && reserva.userId._id.toString() !== user.id) {
        return res.status(HttpCodes.FORBIDDEN).json({
          data: null,
          message: 'No tienes permiso para ver esta reserva',
        });
      }

      res.json({
        data: reserva,
        message: 'Reserva obtenida con éxito',
      });
    } catch (e) {
      internalError(res, e, 'Error al obtener la reserva');
    }
  }
}
