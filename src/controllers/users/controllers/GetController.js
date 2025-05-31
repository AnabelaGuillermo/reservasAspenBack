// src/controllers/users/GetController.js

import UsersModel from '../../../models/userSchema.js';
import { internalError } from '../../../helpers/helpers.js';

export class GetController {
  static async getUsers(_, res) {
    try {
      const data = await UsersModel.find({
        isActive: true,
      });

      const filteredData = data.map((user) => {
        return {
          _id: user._doc._id, // <-- ¡CAMBIO AQUÍ! Renombrado de nuevo a _id
          fullname: user.fullname,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          // Puedes agregar isAdmin aquí o filtrarlo desde la consulta de Mongoose si lo necesitas
        };
      });

      res.json({
        data: filteredData,
        message: 'Usuarios encontrados correctamente',
      });
    } catch (e) {
      internalError(res, e, 'Ocurrió un error al leer la lista de usuarios');
    }
  }
}