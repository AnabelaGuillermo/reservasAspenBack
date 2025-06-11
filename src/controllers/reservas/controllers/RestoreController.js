import HttpCodes from 'http-status-codes';
import ReservaModel from '../../../models/reservaSchema.js';
import { internalError } from '../../../helpers/helpers.js';
import { registrarActividad } from '../../actividades/index.js';

export class RestoreController {
  static async restoreReserva(req, res) {
    const { _id } = req.body;
    const userIdPerformingAction = req.user._id;
    const userFullnamePerformingAction = req.user.fullname;

    try {
      const reserva = await ReservaModel.findById(_id)
        .populate('userId', 'fullname')
        .populate('motoId', 'name patente');

      if (!reserva) {
        return res.status(HttpCodes.NOT_FOUND).json({
          message: 'No se encontró la reserva entregada con este ID para restaurar.',
        });
      }

      const reservaRestaurada = await ReservaModel.findByIdAndUpdate(
        _id,
        { entregado: false, fechaEntrega: null },
        { new: true }
      );

      const vendedorReservaNombre = reserva.userId ? reserva.userId.fullname : 'Desconocido';
      const motoNombre = reserva.motoId ? reserva.motoId.name : 'Desconocida';
      const motoPatente = reserva.motoId ? reserva.motoId.patente : 'N/A';
      const clienteNombre = reserva.cliente || 'Desconocido';
      const comanda = reserva.numeroComanda || 'N/A';

      const detallesActividad =
        `El usuario ${userFullnamePerformingAction} deshizo la entrega de la reserva (del vendedor ${vendedorReservaNombre}) ` +
        `del cliente "${clienteNombre}" para la moto "${motoNombre}". ` +
        `La reserva volvió a la lista de pendientes.`;

      await registrarActividad(userIdPerformingAction, 'Entrega de reserva deshecha', detallesActividad);

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