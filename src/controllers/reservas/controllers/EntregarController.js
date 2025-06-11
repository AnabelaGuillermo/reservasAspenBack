import HttpCodes from 'http-status-codes';
import ReservaModel from '../../../models/reservaSchema.js';
import { internalError } from '../../../helpers/helpers.js';
import { registrarActividad } from '../../actividades/index.js';

export class EntregarController {
  static async entregarReserva(req, res) {
    const { id } = req.params;
    const userIdPerformingAction = req.user._id;
    const userFullnamePerformingAction = req.user.fullname;

    try {
      const reserva = await ReservaModel.findById(id)
        .populate('userId', 'fullname')
        .populate('motoId', 'name patente');

      if (!reserva) {
        return res.status(HttpCodes.NOT_FOUND).json({
          message: 'No se encontró la reserva a entregar',
        });
      }

      reserva.entregado = true;
      reserva.fechaEntrega = new Date();
      await reserva.save();

      const vendedorReservaNombre = reserva.userId ? reserva.userId.fullname : 'Desconocido';
      const motoNombre = reserva.motoId ? reserva.motoId.name : 'Desconocida';
      const motoPatente = reserva.motoId ? reserva.motoId.patente : 'N/A';
      const clienteNombre = reserva.cliente || 'Desconocido';
      const comanda = reserva.numeroComanda || 'N/A';

      const detallesActividad =
        `El usuario ${userFullnamePerformingAction} marcó como entregada la reserva (del vendedor ${vendedorReservaNombre}) ` +
        `del cliente "${clienteNombre}" para la moto "${motoNombre}". ` +
        `La reserva se movió a entregadas recientemente.`;

      await registrarActividad(userIdPerformingAction, 'Reserva entregada (recientemente)', detallesActividad);

      res.status(HttpCodes.OK).json({
        message: 'Reserva marcada como entregada con éxito',
        data: reserva,
      });
    } catch (error) {
      console.error('Error al entregar la reserva:', error);
      internalError(res, error, 'Error al entregar la reserva');
    }
  }
}