import ActividadModel from '../../../models/actividadSchema.js';
import HttpCodes from 'http-status-codes';
import { registrarActividad } from '../index.js';

export class DeleteController {
  static async deleteAllActividades(req, res) {
    try {
      const deletedActivities = await ActividadModel.deleteMany({});

      if (deletedActivities.deletedCount > 0) {
        await registrarActividad(
          req.user._id,
          'Limpieza de Historial',
          `Se eliminaron ${deletedActivities.deletedCount} actividades del historial.`
        );
        res.status(HttpCodes.OK).json({
          message: `Se eliminaron ${deletedActivities.deletedCount} actividades del historial correctamente.`,
        });
      } else {
        res.status(HttpCodes.NOT_FOUND).json({
          message: 'No se encontraron actividades para eliminar.',
        });
      }
    } catch (error) {
      console.error('Error al eliminar todas las actividades:', error);
      res
        .status(HttpCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error al eliminar todas las actividades', error });
    }
  }
}