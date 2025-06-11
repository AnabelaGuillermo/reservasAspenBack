import HttpCodes from 'http-status-codes';
import ReservaModel from '../../../models/reservaSchema.js';
import ReservaEntregadaModel from '../../../models/reservaEntregadaSchema.js';
import { internalError } from '../../../helpers/helpers.js';
import { registrarActividad } from '../../actividades/index.js';

export class MoverEntregadaController {
  static async moverReserva(req, res) {
    const { id } = req.params;
    const userIdPerformingAction = req.user._id;
    const userFullnamePerformingAction = req.user.fullname;

    try {
      const reserva = await ReservaModel.findById(id)
        .populate('userId', 'fullname')
        .populate('motoId', 'name patente');

      if (!reserva) {
        const reservaEntregadaExistente = await ReservaEntregadaModel.findById(id)
          .populate('userId', 'fullname')
          .populate('motoId', 'name patente');

        if (reservaEntregadaExistente) {
          return res.status(HttpCodes.OK).json({
            message: 'La reserva ya ha sido movida a entregados permanentemente.',
          });
        }
        
        return res.status(HttpCodes.NOT_FOUND).json({
          message: 'No se encontró la reserva para mover permanentemente.',
        });
      }

      const vendedorReservaNombre = reserva.userId ? reserva.userId.fullname : 'Desconocido';
      const motoNombre = reserva.motoId ? reserva.motoId.name : 'Desconocida';
      const motoPatente = reserva.motoId ? reserva.motoId.patente : 'N/A';
      const clienteNombre = reserva.cliente || 'Desconocido';
      const comanda = reserva.numeroComanda || 'N/A';

      const nuevaReservaEntregada = new ReservaEntregadaModel({
        ...reserva.toObject(),
        _id: undefined,
        originalReservaId: reserva._id
      });

      await nuevaReservaEntregada.save();

      const resultadoEliminacion = await ReservaModel.findByIdAndDelete(id);

      if (!resultadoEliminacion) {
        console.warn(`Advertencia: La reserva con ID ${id} no se encontró en la colección principal para eliminar después de mover.`);
      }

      const detallesActividad =
        `Se entregó permanentemente la reserva (del vendedor ${vendedorReservaNombre}) ` +
        `del cliente "${clienteNombre}" para la moto "${motoNombre}".`;

      await registrarActividad(userIdPerformingAction, 'Reserva entregada (permanente)', detallesActividad);

      res.status(HttpCodes.OK).json({
        message: 'Reserva movida a entregados con éxito.',
      });
    } catch (error) {
      console.error('Error al mover la reserva entregada:', error);
      internalError(res, error, 'Error al mover la reserva entregada');
    }
  }
}