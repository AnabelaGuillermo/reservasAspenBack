// src/controllers/reservas/controllers/MoverEntregadaController.js
import HttpCodes from 'http-status-codes';
import ReservaModel from '../../../models/reservaSchema.js';
import ReservaEntregadaModel from '../../../models/reservaEntregadaSchema.js';
import { internalError } from '../../../helpers/helpers.js';

export class MoverEntregadaController {
  static async moverReserva(req, res) {
    const { id } = req.params;

    try {
      console.log(`MoverReservaController: Intentando mover reserva con ID ${id}`);
      const reserva = await ReservaModel.findById(id).populate('userId motoId');

      if (!reserva) {
        console.log(`MoverReservaController: No se encontró la reserva con ID ${id}`);
        return res.status(HttpCodes.NOT_FOUND).json({
          message: 'No se encontró la reserva para mover.',
        });
      }

      console.log(`MoverReservaController: Reserva encontrada: ${JSON.stringify(reserva)}`);

      const nuevaReservaEntregada = new ReservaEntregadaModel({
        ...reserva.toObject(),
        _id: undefined,
      });

      console.log(`MoverReservaController: Creando nueva reserva entregada: ${JSON.stringify(nuevaReservaEntregada)}`);
      await nuevaReservaEntregada.save();
      console.log(`MoverReservaController: Reserva entregada guardada con éxito.`);

      console.log(`MoverReservaController: Eliminando reserva de la colección principal con ID ${id}`);
      const resultadoEliminacion = await ReservaModel.findByIdAndDelete(id);
      console.log(`MoverReservaController: Resultado de la eliminación: ${JSON.stringify(resultadoEliminacion)}`);

      res.status(HttpCodes.OK).json({
        message: 'Reserva movida a entregados con éxito.',
      });
    } catch (error) {
      console.error('Error al mover la reserva entregada:', error);
      internalError(res, error, 'Error al mover la reserva entregada');
    }
  }
}