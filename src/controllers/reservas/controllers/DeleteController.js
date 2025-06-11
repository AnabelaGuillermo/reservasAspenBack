import HttpCodes from 'http-status-codes';
import ReservaModel from '../../../models/reservaSchema.js';
import MotoModel from '../../../models/motoSchema.js';
import { internalError } from '../../../helpers/helpers.js';
import { registrarActividad } from '../../actividades/index.js';

export class DeleteController {
  static async deleteReserva(req, res) {
    const { id } = req.params;
    const userId = req.user._id;
    const userFullname = req.user.fullname;

    try {
      const reservaToDelete = await ReservaModel.findById(id)
        .populate('motoId', 'name')
        .populate('userId', 'fullname');

      if (!reservaToDelete) {
        return res.status(HttpCodes.NOT_FOUND).json({
          message: 'No se encontró la reserva a eliminar',
        });
      }

      const vendedorReservaNombre = reservaToDelete.userId
        ? reservaToDelete.userId.fullname
        : 'Desconocido';

      const deletedReserva = await ReservaModel.findByIdAndDelete(id);

      if (!deletedReserva) {
        return res.status(HttpCodes.NOT_FOUND).json({
          message: 'La reserva no pudo ser eliminada.',
        });
      }

      const motoActualizada = await MotoModel.findByIdAndUpdate(
        reservaToDelete.motoId._id,
        { $inc: { quantity: 1 } },
        { new: true },
      );

      if (!motoActualizada) {
        console.warn(
          `Advertencia: No se encontró la moto con ID ${reservaToDelete.motoId._id} para actualizar stock.`,
        );
      }

      const detallesActividad =
        `El usuario ${userFullname} eliminó la reserva (del vendedor ${vendedorReservaNombre}) ` +
        `del cliente "${reservaToDelete.cliente}" para la moto "${reservaToDelete.motoId.name}". ` +
        `El stock de la moto "${motoActualizada.name}" se incrementó a ${motoActualizada.quantity}.`;

      await registrarActividad(
        userId,
        'Reserva eliminada y stock devuelto',
        detallesActividad,
      );

      res.status(HttpCodes.OK).json({
        message: 'Reserva eliminada y stock actualizado con éxito.',
        data: {
          reservaEliminada: deletedReserva,
          motoStockActualizado: motoActualizada,
        },
      });
    } catch (error) {
      console.error(
        'Error al eliminar la reserva y actualizar el stock:',
        error,
      );
      internalError(
        res,
        error,
        'Error al eliminar la reserva y actualizar el stock.',
      );
    }
  }
}
