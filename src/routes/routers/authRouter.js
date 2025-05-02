import express from 'express';

import { Auth } from '../../controllers/auth/index.js';
import { validateBody } from '../../middlewares/validateBody.js';
import {
  post_loginValidationSchema,
  post_forgotPasswordValidationSchema,
  post_resetPasswordValidationSchema,
} from '../../helpers/validationSchemas/authValidationSchemas.js';

export const authRouter = express.Router();

authRouter.post(
  '/login',
  (req, res, next) => validateBody(req, res, next, post_loginValidationSchema),
  Auth.PostController.postLogin,
);

authRouter.post(
  '/forgot-password',
  (req, res, next) =>
    validateBody(req, res, next, post_forgotPasswordValidationSchema),
  Auth.PostController.forgotPassword,
);

authRouter.post(
  '/reset-password/:token',
  (req, res, next) =>
    validateBody(req, res, next, post_resetPasswordValidationSchema),
  Auth.PostController.resetPassword,
);

authRouter.post('/refresh-token', Auth.PostController.postRefreshToken);
