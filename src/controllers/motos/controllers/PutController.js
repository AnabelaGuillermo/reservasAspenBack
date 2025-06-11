import MotoModel from '../../../models/motoSchema.js';
import { registrarActividad } from '../../actividades/index.js';

export const PutController = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const userId = req.user._id;
  const userFullname = req.user.fullname;

  try {
    const motoExistente = await MotoModel.findById(id);

    if (!motoExistente) {
      return res.status(404).json({ message: 'Moto no encontrada' });
    }

    const oldQuantity = motoExistente.quantity;

    const motoActualizada = await MotoModel.findByIdAndUpdate(
      id,
      { quantity: Number(quantity) },
      { new: true }
    );

    if (!motoActualizada) {
      return res.status(404).json({ message: 'Moto no encontrada después de actualizar' });
    }

    const detalles = `El usuario ${userFullname} editó la cantidad de la moto "${motoActualizada.name}" de ${oldQuantity} a ${motoActualizada.quantity}.`;
    await registrarActividad(userId, 'Editar cantidad de producto', detalles);

    res.status(200).json(motoActualizada);
  } catch (error) {
    console.error('Error al actualizar moto:', error);
    res.status(500).json({ message: 'Error al actualizar moto', error });
  }
};