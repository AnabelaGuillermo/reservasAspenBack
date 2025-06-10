import ActividadModel from '../../../models/actividadSchema.js';
import HttpCodes from 'http-status-codes';

export class GetController {
  static async getActividades(req, res) {
    try {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      const actividades = await ActividadModel.find().populate('usuarioId', 'fullname email').sort({ fechaHora: -1 });
      res.status(HttpCodes.OK).json({ data: actividades });
    } catch (error) {
      console.error('Error al obtener las actividades:', error);
      res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener las actividades', error });
    }
  }
}