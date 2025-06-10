import HttpCodes from 'http-status-codes';
import UserModel from '../../../models/userSchema.js';
import { internalError } from '../../../helpers/helpers.js';
import { registrarActividad } from '../../actividades/index.js';

export class DeleteController {
  static async deleteUser(req, res) {
    const { id } = req.params;

    try {
      const deletedUser = await UserModel.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true },
      );

      if (!deletedUser) {
        return res.status(HttpCodes.NOT_FOUND).json({
          data: null,
          message: 'Usuario no encontrado',
        });
      }

      await registrarActividad(req.user._id, 'Eliminar usuario', `Se eliminó el usuario ${deletedUser.email}.`);

      res.json({
        data: null,
        message: 'Usuario eliminado correctamente',
      });
    } catch (e) {
      internalError(res, e, 'Ocurrió un error al eliminar el usuario');
    }
  }
}