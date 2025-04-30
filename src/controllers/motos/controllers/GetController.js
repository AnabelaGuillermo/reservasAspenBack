import MotoModel from '../../../models/motoSchema.js';

export const GetController = async (req, res) => {
    try {
      const motos = await MotoModel.find();
      res.status(200).json({ data: motos });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener motos', error });
    }
  };
  