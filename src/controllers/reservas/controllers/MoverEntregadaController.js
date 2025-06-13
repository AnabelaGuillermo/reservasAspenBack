import HttpCodes from 'http-status-codes';
import ReservaModel from '../../../models/reservaSchema.js';
import ReservaEntregadaModel from '../../../models/reservaEntregadaSchema.js';
import { internalError } from '../../../helpers/helpers.js';
import { registrarActividad } from '../../actividades/index.js';

const MAX_RESERVAS_ENTREGADAS = 15;

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
        const reservaEntregadaExistente = await ReservaEntregadaModel.findById(
          id,
        )
          .populate('userId', 'fullname')
          .populate('motoId', 'name patente');

        if (reservaEntregadaExistente) {
          return res.status(HttpCodes.OK).json({
            message:
              'La reserva ya ha sido movida a entregados permanentemente.',
          });
        }

        return res.status(HttpCodes.NOT_FOUND).json({
          message: 'No se encontró la reserva para mover permanentemente.',
        });
      }

      const nuevaReservaEntregada = new ReservaEntregadaModel({
        ...reserva.toObject(),
        _id: undefined,
        originalReservaId: reserva._id,
        fechaEntregaDefinitiva: new Date(),
        modifiedBy: userIdPerformingAction,
        modificationDate: new Date(),
        modifications: [
          ...reserva.modifications,
          {
            modifiedBy: userIdPerformingAction,
            modificationDate: new Date(),
            modificationType: 'Movido a entregadas permanentemente',
          },
        ],
      });

      await nuevaReservaEntregada.save();

      const resultadoEliminacion = await ReservaModel.findByIdAndDelete(id);

      if (!resultadoEliminacion) {
        console.warn(
          `Advertencia: La reserva con ID ${id} no se encontró en la colección principal para eliminar después de mover.`,
        );
      }

      const count = await ReservaEntregadaModel.countDocuments();
      if (count > MAX_RESERVAS_ENTREGADAS) {
        const oldestReserva = await ReservaEntregadaModel.findOne()
          .sort({ fechaEntregaDefinitiva: 1 })
          .exec();

        if (oldestReserva) {
          await ReservaEntregadaModel.findByIdAndDelete(oldestReserva._id);
          const detallesActividadEliminacion =
            `Se eliminó automáticamente la reserva entregada más antigua (ID: ${oldestReserva._id}) ` +
            `del cliente "${oldestReserva.cliente}" para mantener el límite de ${MAX_RESERVAS_ENTREGADAS} registros.`;
          await registrarActividad(
            userIdPerformingAction,
            'Reserva entregada eliminada automáticamente (límite)',
            detallesActividadEliminacion,
          );
        }
      }

      const vendedorReservaNombre = reserva.userId
        ? reserva.userId.fullname
        : 'Desconocido';
      const motoNombre = reserva.motoId ? reserva.motoId.name : 'Desconocida';
      const clienteNombre = reserva.cliente || 'Desconocido';

      const detallesActividad =
        `Se entregó permanentemente la reserva (del vendedor ${vendedorReservaNombre}) ` +
        `del cliente "${clienteNombre}" para la moto "${motoNombre}".`;

      await registrarActividad(
        userIdPerformingAction,
        'Reserva entregada (permanente)',
        detallesActividad,
      );

      res.status(HttpCodes.OK).json({
        message: 'Reserva movida a entregados con éxito.',
      });
    } catch (error) {
      console.error('Error al mover la reserva entregada:', error);
      internalError(res, error, 'Error al mover la reserva entregada');
    }
  }
}
