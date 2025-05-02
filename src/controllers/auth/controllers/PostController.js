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
    console.log('postLogin - Email recibido:', email);

    try {
      const user = await UserModel.findOne({ email, isActive: true });
      console.log('postLogin - Usuario encontrado:', user);

      if (!user) {
        return res.status(HttpCodes.UNAUTHORIZED).json({
          data: null,
          message: 'Email y/o contraseña incorrectos',
        });
      }

      const passwordMatch = bcryptjs.compareSync(password, user.password);
      if (!passwordMatch) {
        return res.status(HttpCodes.UNAUTHORIZED).json({
          data: null,
          message: 'Email y/o contraseña incorrectos',
        });
      }

      const userInfo = {
        user: {
          id: user._id,
          fullname: user.fullname,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      };

      const accessToken = jwt.sign(userInfo, process.env.SECRET_KEY, {
        expiresIn: '15m',
      });

      const refreshToken = jwt.sign(userInfo, process.env.REFRESH_KEY, {
        expiresIn: '7d',
      });

      res.json({
        accessToken,
        refreshToken,
        message: 'Inicio de sesión exitoso',
      });
    } catch (error) {
      console.error('postLogin - Error:', error);
      internalError(res, error, 'Error al iniciar sesión');
    }
  }

  static async postRefreshToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(HttpCodes.UNAUTHORIZED).json({
        message: 'No se proporcionó refresh token',
      });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_KEY);
      const newAccessToken = jwt.sign(
        { user: decoded.user },
        process.env.SECRET_KEY,
        { expiresIn: '15m' },
      );

      res.json({
        accessToken: newAccessToken,
        message: 'Token renovado correctamente',
      });
    } catch (error) {
      console.error('postRefreshToken - Error:', error);
      return res.status(HttpCodes.UNAUTHORIZED).json({
        message: 'Refresh token inválido o expirado',
      });
    }
  }

  static async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      const user = await UserModel.findOne({ email, isActive: true });

      if (!user) {
        return res.status(HttpCodes.NOT_FOUND).json({
          message: 'No existe un usuario activo con ese email',
        });
      }

      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetTokenExpiry = Date.now() + 3600000;

      user.resetToken = resetToken;
      user.resetTokenExpiry = resetTokenExpiry;
      await user.save();

      const mailOptions = {
        to: email,
        subject: 'Recuperación de Contraseña',
        html: `<p>Hola ${user.fullname},</p>
               <p>Haz clic <a href="*${resetToken}">aquí</a> para recuperar tu contraseña.</p>
               <p>Este enlace expirará en 1 hora.</p>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error al enviar correo:', error);
          return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Error al enviar el correo de recuperación',
          });
        }
        console.log('Correo enviado: ' + info.response);
        res.json({
          message:
            'Se ha enviado un correo con las instrucciones para recuperar la contraseña',
        });
      });
    } catch (error) {
      internalError(
        res,
        error,
        'Error al procesar la solicitud de recuperación de contraseña',
      );
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
        return res.status(HttpCodes.BAD_REQUEST).json({
          message: 'Token de recuperación inválido o expirado',
        });
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
