import HttpCodes from 'http-status-codes';
import ReservaModel from '../../../models/reservaSchema.js';
import { internalError } from '../../../helpers/helpers.js';
import { registrarActividad } from '../../actividades/index.js';
import MotoModel from '../../../models/motoSchema.js';

export class PutController {
  static async putReserva(req, res) {
    const {
      body,
      params: { id },
    } = req;
    const userId = req.user._id;
    const userFullname = req.user.fullname;

    try {
      const reservaExistente = await ReservaModel.findById(id).populate(
        'motoId',
        'name',
      );

      if (!reservaExistente) {
        return res.status(HttpCodes.BAD_REQUEST).json({
          data: null,
          message: 'La reserva indicada no fue encontrada',
        });
      }

      const oldObservaciones = reservaExistente.observaciones || 'ninguna';
      const newObservaciones = body.observaciones || '';

      const action = await ReservaModel.updateOne(
        {
          _id: id,
        },
        body,
      );

      if (action.matchedCount === 0) {
        res.status(HttpCodes.BAD_REQUEST).json({
          data: null,
          message: 'La reserva indicada no fue encontrada',
        });
        return;
      }

      if (oldObservaciones !== newObservaciones) {
        const motoName = reservaExistente.motoId
          ? reservaExistente.motoId.name
          : 'Desconocida';
        const detalles = `El usuario ${userFullname} editó las observaciones de la reserva del cliente "${reservaExistente.cliente}" (Moto: ${motoName}). Las observaciones cambiaron de "${oldObservaciones}" a "${newObservaciones}".`;
        await registrarActividad(
          userId,
          'Editar observación de reserva',
          detalles,
        );
      }

      res.json({
        data: null,
        message: 'Reserva actualizada correctamente',
      });
    } catch (e) {
      internalError(
        res,
        e,
        'Ocurrió un error actualizando el recurso indicado',
      );
    }
  }
}
