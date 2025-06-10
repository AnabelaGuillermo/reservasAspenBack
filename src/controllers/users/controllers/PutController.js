import HttpCodes from 'http-status-codes';
import UserModel from '../../../models/userSchema.js';
import { internalError } from '../../../helpers/helpers.js';
import { registrarActividad } from '../../actividades/index.js';

export class PutController {
  static async updateUser(req, res) {
    const { id } = req.params;
    const { isAdmin } = req.body;

    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { isAdmin },
        { new: true },
      );

      if (!updatedUser) {
        return res.status(HttpCodes.NOT_FOUND).json({
          data: null,
          message: 'Usuario no encontrado',
        });
      }

      await registrarActividad(req.user._id, 'Editar rol', `Se cambió el rol del usuario ${updatedUser.email} a ${isAdmin ? 'admin' : 'no admin'}.`);

      const { password, ...userWithoutPassword } = updatedUser.toObject();

      res.json({
        data: userWithoutPassword,
        message: 'Usuario actualizado correctamente',
      });
    } catch (e) {
      internalError(res, e, 'Ocurrió un error al actualizar el usuario');
    }
  }
}