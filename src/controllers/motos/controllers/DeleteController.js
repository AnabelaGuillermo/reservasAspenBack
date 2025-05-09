import MotoModel from '../../../models/motoSchema.js';

export const DeleteController = async (req, res) => {
  const { id } = req.params;
  try {
    const motoEliminada = await MotoModel.findByIdAndDelete(id);
    if (!motoEliminada) {
      return res.status(404).json({ message: 'Moto no encontrada' });
    }
    res.status(200).json({ message: 'Moto eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar moto', error });
  }
};
