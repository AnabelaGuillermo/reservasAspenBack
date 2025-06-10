import HttpCodes from 'http-status-codes';
import ReservaModel from '../../../models/reservaSchema.js';
import MotoModel from '../../../models/motoSchema.js';
import { internalError } from '../../../helpers/helpers.js';
import { registrarActividad } from '../../actividades/index.js';

export class PostController {
  static async postReserva(req, res) {
    const {
      userId,
      motoId,
      recibo,
      numeroComanda,
      cliente,
      observaciones,
      fecha,
      hora,
    } = req.body;
    const { user } = req;

    console.log('Backend - userId recibido de req.body:', userId);
    console.log('Backend - user._id (ID del admin logueado):', user._id);

    try {
      const reserva = new ReservaModel({
        userId: userId,
        motoId,
        fecha,
        hora,
        recibo,
        numeroComanda,
        cliente,
        observaciones,
        modifiedBy: user._id,
      });

      await reserva.save();

      const moto = await MotoModel.findById(motoId);

      if (!moto) {
        console.error(
          `Error: No se encontró la moto con ID ${motoId} al intentar descontar el stock.`,
        );
        return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({
          message: 'Error interno al procesar la reserva (moto no encontrada).',
        });
      }

      if (moto.quantity > 0) {
        moto.quantity -= 1;
        await moto.save();
        console.log(
          `Stock de la moto ${moto.name} descontado. Stock actual: ${moto.quantity}`,
        );
      } else {
        console.warn(
          `Advertencia: No hay stock disponible para la moto ${moto.name} (ID: ${motoId}). La reserva se creó pero el stock no se descontó.`,
        );
        return res.status(HttpCodes.CONFLICT).json({
          message: `No hay stock disponible para ${moto.name}. La reserva se ha creado.`,
        });
      }

      let detallesReserva = `Reserva para ${cliente} de la moto ${moto.name} (ID: ${motoId}).`;
      if (observaciones) {
        detallesReserva += ` Observaciones: ${observaciones}`;
      }
        await registrarActividad(user._id, 'Crear reserva', detallesReserva);

      res.status(HttpCodes.CREATED).json({
        data: reserva,
        message: 'Reserva realizada con éxito',
      });
    } catch (e) {
      internalError(res, e, 'Error al realizar la reserva');
    }
  }
}
