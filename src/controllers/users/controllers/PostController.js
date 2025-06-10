import HttpCodes from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import UserModel from '../../../models/userSchema.js';
import { internalError } from '../../../helpers/helpers.js';
import { registrarActividad } from '../../actividades/index.js';

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

      await registrarActividad(req.user._id, 'Crear usuario', `Se creó el usuario ${body.email} con rol ${body.isAdmin ? 'admin' : 'no admin'}.`);

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