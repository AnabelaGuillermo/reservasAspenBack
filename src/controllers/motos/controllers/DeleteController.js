import MotoModel from '../../../models/motoSchema.js';
import ReservaModel from '../../../models/reservaSchema.js';
import { registrarActividad } from '../../actividades/index.js';
import HttpCodes from 'http-status-codes';

export const DeleteController = async (req, res) => {
  const { id } = req.params;
  try {
    const reservasAsociadas = await ReservaModel.findOne({ motoId: id, isActive: true });

    if (reservasAsociadas) {
      return res.status(HttpCodes.CONFLICT).json({
        message: 'No se puede eliminar la moto porque tiene reservas activas asociadas.',
      });
    }

    const motoEliminada = await MotoModel.findByIdAndDelete(id);
    if (!motoEliminada) {
      return res.status(HttpCodes.NOT_FOUND).json({ message: 'Moto no encontrada' });
    }

    await registrarActividad(req.user._id, 'Eliminar moto', `Se eliminó la moto ${motoEliminada.name}.`);

    res.status(HttpCodes.OK).json({ message: 'Moto eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar moto:', error);
    res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error al eliminar moto', error: error.message });
  }
};