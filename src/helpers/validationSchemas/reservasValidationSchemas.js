import Joi from 'joi';

export const post_put_reservasValidationSchema = Joi.object({
  motoId: Joi.string().trim().required().messages({
    'any.required': "El campo 'motoId' es requerido",
  }),
  fecha: Joi.date().required().messages({
    'any.required': "El campo 'fecha' es requerido",
  }),
  hora: Joi.string().trim().required().messages({
    'any.required': "El campo 'hora' es requerido",
  }),
  recibo: Joi.string().trim().required().messages({
    'any.required': "El campo 'recibo' es requerido",
  }),
  numeroComanda: Joi.string().trim().required().messages({
    'any.required': "El campo 'numeroComanda' es requerido",
  }),
  observaciones: Joi.string().trim().optional(),
});
