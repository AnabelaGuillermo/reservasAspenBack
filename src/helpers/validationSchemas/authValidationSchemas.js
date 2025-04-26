import Joi from 'joi';

export const post_loginValidationSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.email': 'El campo email debe ser un email válido',
    'any.required': 'El campo email es requerido',
  }),
  password: Joi.string().trim().min(3).required().messages({
    'string.min': 'El campo password debe tener al menos 3 caracteres',
    'any.required': 'El campo password es requerido',
  }),
});

export const post_forgotPasswordValidationSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.email': 'El campo email debe ser un email válido',
    'any.required': 'El campo email es requerido',
  }),
});

export const post_resetPasswordValidationSchema = Joi.object({
  password: Joi.string().trim().min(8).required().messages({
    'string.min': 'La contraseña debe tener al menos 8 caracteres',
    'any.required': 'La contraseña es requerida',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Las contraseñas no coinciden',
    'any.required': 'La confirmación de la contraseña es requerida',
  }),
});
