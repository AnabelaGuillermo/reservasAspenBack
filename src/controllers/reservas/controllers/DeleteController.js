import HttpCodes from 'http-status-codes';
import ReservaModel from '../../../models/reservaSchema.js';
import MotoModel from '../../../models/motoSchema.js';
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

      const motoId = reserva.motoId;
      console.log('motoId de la reserva eliminada:', motoId);

      const moto = await MotoModel.findById(motoId);
      console.log('Moto encontrada para incrementar stock:', moto);

      if (moto) {
        moto.quantity += 1;
        await moto.save();
        console.log(
          `Stock de la moto ${moto.name} (ID: ${motoId}) incrementado. Stock actual: ${moto.quantity}`,
        );
      } else {
        console.warn(
          `Advertencia: No se encontró la moto con ID ${motoId} asociada a la reserva eliminada. El stock no se incrementó.`,
        );
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
