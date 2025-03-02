import Joi from 'joi';

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;

export const post_userValidationSchema = Joi.object({
  firstname: Joi.string().trim().min(3).max(30).required().messages({
    'string.min': "El campo 'firstname' debe tener como mínimo 3 caracteres",
    'string.max': "El campo 'firstname' debe tener como mucho 30 caracteres",
    'any.required': "El campo 'firstname' es requerido",
    '*': "Revisa el campo 'firstname'",
  }),
  lastname: Joi.string().trim().min(3).max(30).required().messages({
    'string.min': "El campo 'lastname' debe tener como mínimo 3 caracteres",
    'string.max': "El campo 'lastname' debe tener como mucho 30 caracteres",
    'any.required': "El campo 'lastname' es requerido",
    '*': "Revisa el campo 'lastname'",
  }),
  username: Joi.string().trim().min(3).max(20).required().messages({
    'string.min': "El campo 'username' debe tener como mínimo 3 caracteres",
    'string.max': "El campo 'username' debe tener como mucho 20 caracteres",
    'any.required': "El campo 'username' es requerido",
    '*': "Revisa el campo 'username'",
  }),
  // Es lo mismo usar .pattern()
  password: Joi.string().trim().regex(passwordRegex).required().messages({
    'string.pattern.base':
      "El campo 'password' debe tener una minúscula, una mayúscula, un dígito, y un caracter especial, entre 8 y 15 caracteres",
    'any.required': "El campo 'password' es requerido",
    '*': "Revisa el campo 'password'",
  }),
});
