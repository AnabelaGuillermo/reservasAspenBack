import HttpCodes from 'http-status-codes';
import bcryptjs from 'bcryptjs';

import UserModel from '../../../models/userSchema.js';
import { internalError } from '../../../helpers/helpers.js';

export class PostController {
  static async postUser(req, res) {
    const { body } = req;

    const hashedPassword = bcryptjs.hashSync(body.password, 10);

    const newUser = new UserModel({
      fullname: body.fullname,
      email: body.email,
      password: hashedPassword,
      isAdmin: body.isAdmin || false,
    });

    try {
      const savedUser = await newUser.save();

      const { password, ...userWithoutPassword } = savedUser.toObject();

      res.status(HttpCodes.CREATED).json({
        data: userWithoutPassword,
        message: 'Usuario guardado correctamente',
      });
    } catch (e) {
      internalError(res, e, 'Ocurrió un error al guardar el usuario');
    }
  }
}
