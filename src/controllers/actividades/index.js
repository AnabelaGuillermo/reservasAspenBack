import ActividadModel from '../../models/actividadSchema.js';

export const registrarActividad = async (usuarioId, accion, detalles) => {
  try {
    const nuevaActividad = new ActividadModel({
      usuarioId,
      accion,
      detalles,
    });
    await nuevaActividad.save();
  } catch (e) {
    console.error('Error al registrar actividad: ', e);
  }
};
