import Joi from 'joi';

export const post_loginValidationSchema = Joi.object({
  usernameOrEmail: Joi.string().trim().min(3).max(255).required().messages({
    'string.min':
      "El campo 'usernameOrEmail' debe tener como mínimo 3 caracteres",
    'string.max':
      "El campo 'usernameOrEmail' debe tener como máximo 255 caracteres",
    'any.required': "El campo 'usernameOrEmail' es requerido",
    '*': "Revisa el campo 'usernameOrEmail'",
  }),
  password: Joi.string().trim().min(3).required().messages({
    'string.min': "El campo 'password' debe tener al menos 3 caracteres",
    'any.required': "El campo 'password' es requerido",
    '*': "Revisa el campo 'password'",
  }),
});
