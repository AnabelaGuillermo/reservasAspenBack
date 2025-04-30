import MotoModel from '../../../models/motoSchema.js';

export const PutController = async (req, res) => {
  const { id } = req.params;
  try {
    const motoActualizada = await MotoModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!motoActualizada) {
      return res.status(404).json({ message: 'Moto no encontrada' });
    }
    res.status(200).json(motoActualizada);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar moto', error });
  }
};
