import HttpCodes from 'http-status-codes';
import UserModel from '../../../models/userSchema.js';
import { internalError } from '../../../helpers/helpers.js';
import { registrarActividad } from '../../actividades/index.js';

export class DeleteController {
  static async deleteUser(req, res) {
    const { id } = req.params;
    try {
      const deletedUser = await UserModel.findByIdAndDelete(id);

      if (!deletedUser) {
        return res.status(HttpCodes.NOT_FOUND).json({
          message: 'Usuario no encontrado',
        });
      }

      const userEmail = deletedUser.email;
      await registrarActividad(req.user._id, 'Eliminar usuario (definitivo)', `Se eliminó definitivamente el usuario con email: ${userEmail}`);

      res.status(HttpCodes.OK).json({
        data: deletedUser,
        message: 'Usuario eliminado definitivamente de la base de datos',
      });
    } catch (e) {
      internalError(res, e, 'Ocurrió un error al eliminar el usuario definitivamente');
    }
  }
}