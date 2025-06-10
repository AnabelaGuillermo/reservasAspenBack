import HttpCodes from 'http-status-codes';
import ReservaModel from '../../../models/reservaSchema.js';
import { internalError } from '../../../helpers/helpers.js';
// ELIMINA ESTA LÍNEA: import { EntregarController } from './EntregarController.js';
import { registrarActividad } from '../../actividades/index.js';

export class EntregarController {
  static async entregarReserva(req, res) {
    const { id } = req.params;

    try {
      const reserva = await ReservaModel.findByIdAndUpdate(
        id,
        { entregado: true, fechaEntrega: new Date() },
        { new: true },
      );

      if (!reserva) {
        return res.status(HttpCodes.NOT_FOUND).json({
          message: 'No se encontró la reserva a entregar',
        });
      }

      // Asegúrate de que `req.user._id` esté disponible.
      // Si el middleware de autenticación se ejecuta antes, debería estar.
      // Si el usuario que realiza esta acción no es el que está logueado, ajusta esto.
      // Por ejemplo, si el user._id que registra la acción es del admin que entrega.
      await registrarActividad(req.user._id, 'Entregar moto', `Se entregó la reserva con ID ${id}.`);

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