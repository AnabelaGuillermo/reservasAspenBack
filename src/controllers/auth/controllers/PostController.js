import HttpCodes from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

import UserModel from '../../../models/userSchema.js';
import { internalError } from '../../../helpers/helpers.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USUARIO,
    pass: process.env.EMAIL_CONTRASENA,
  },
});

export class PostController {
  static async postLogin(req, res) {
    const { email, password } = req.body;

    try {
      const user = await UserModel.findOne({ email, isActive: true });

      if (!user || !bcryptjs.compareSync(password, user.password)) {
        return res.status(HttpCodes.UNAUTHORIZED).json({
          data: null,
          message: 'Email y/o contraseña incorrectos',
        });
      }

      const userInfo = {
        user: {
          id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      };

      const token = jwt.sign(userInfo, process.env.SECRET_KEY, {
        expiresIn: '1h',
      });

      res.json({
        data: token,
        message: 'Inicio de sesión exitoso',
      });
    } catch (e) {
      internalError(res, e, 'Error al iniciar sesión');
    }
  }

  static async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(HttpCodes.NOT_FOUND).json({ message: 'No existe un usuario con ese email' });
      }

      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetTokenExpiry = Date.now() + 3600000;

      user.resetToken = resetToken;
      user.resetTokenExpiry = resetTokenExpiry;
      await user.save();

      const mailOptions = {
        to: email,
        subject: 'Recuperación de Contraseña',
        html: `<p>Haz clic <a href="http://tu_dominio/reset-password/${resetToken}">aquí</a> para recuperar tu contraseña.</p>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error al enviar el correo de recuperación' });
        }
        console.log('Correo enviado: ' + info.response);
        res.json({ message: 'Se ha enviado un correo con las instrucciones para recuperar la contraseña' });
      });
    } catch (error) {
      internalError(res, error, 'Error al procesar la solicitud de recuperación de contraseña');
    }
  }

  static async resetPassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;

    try {
      const user = await UserModel.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(HttpCodes.BAD_REQUEST).json({ message: 'Token de recuperación inválido o expirado' });
      }

      const hashedPassword = bcryptjs.hashSync(password, 10);
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiry = null;
      await user.save();

      res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      internalError(res, error, 'Error al actualizar la contraseña');
    }
  }
}