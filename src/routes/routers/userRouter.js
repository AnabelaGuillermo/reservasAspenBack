import express from 'express';

import { Users } from '../../controllers/users/index.js';
import { validateBody } from '../../middlewares/validateBody.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { isAdmin } from '../../middlewares/isAdmin.js';

import { post_userValidationSchema } from '../../helpers/validationSchemas/usersValidationSchemas.js';

export const userRouter = express.Router();

userRouter.get('/', isAuthenticated, isAdmin, Users.GetController.getUsers);

userRouter.post(
  '/',
  isAuthenticated,
  (req, res, next) => validateBody(req, res, next, post_userValidationSchema),
  Users.PostController.postUser,
);

userRouter.put('/:id', isAuthenticated, isAdmin, Users.PutController.updateUser);

userRouter.delete('/:id', isAuthenticated, isAdmin, Users.DeleteController.deleteUser);