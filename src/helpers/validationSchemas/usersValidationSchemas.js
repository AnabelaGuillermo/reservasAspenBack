import Joi from 'joi';

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;

export const post_userValidationSchema = Joi.object({
  fullname: Joi.string().trim().min(3).max(50).required().messages({
    'string.min': "El campo 'fullname' debe tener como mínimo 3 caracteres",
    'string.max': "El campo 'fullname' debe tener como mucho 50 caracteres",
    'any.required': "El campo 'fullname' es requerido",
    '*': "Revisa el campo 'fullname'",
  }),
  email: Joi.string().trim().email().required().messages({
    'string.email': "El campo 'email' debe ser un correo válido",
    'any.required': "El campo 'email' es requerido",
    '*': "Revisa el campo 'email'",
  }),
  password: Joi.string().trim().regex(passwordRegex).required().messages({
    'string.pattern.base':
      "El campo 'password' debe tener una minúscula, una mayúscula, un dígito y un caracter especial, entre 8 y 15 caracteres",
    'any.required': "El campo 'password' es requerido",
    '*': "Revisa el campo 'password'",
  }),
  isAdmin: Joi.boolean().optional(),
});

export const forgotPasswordValidationSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.email': "El campo 'email' debe ser un correo válido",
    'any.required': "El campo 'email' es requerido",
    '*': "Revisa el campo 'email'",
  }),
});

export const resetPasswordValidationSchema = Joi.object({
  password: Joi.string().trim().regex(passwordRegex).required().messages({
    'string.pattern.base':
      "La nueva contraseña debe tener una minúscula, una mayúscula, un dígito y un caracter especial, entre 8 y 15 caracteres",
    'any.required': "El campo 'password' es requerido",
    '*': "Revisa la nueva contraseña",
  }),
});