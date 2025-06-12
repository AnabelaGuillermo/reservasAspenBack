import ActividadModel from '../../models/actividadSchema.js';

export const registrarActividad = async (usuarioId, accion, detalles) => {
  try {
    const nuevaActividad = new ActividadModel({
      usuarioId,
      accion,
      detalles,
    });
    await nuevaActividad.save();

    const count = await ActividadModel.countDocuments();

    if (count > 50) {
      const actividadesAntiguas = await ActividadModel.find()
        .sort({ fechaHora: 1 })
        .limit(count - 50);

      for (const actividad of actividadesAntiguas) {
        await ActividadModel.findByIdAndDelete(actividad._id);
      }
    }
  } catch (e) {
    console.error('Error al registrar actividad: ', e);
  }
};
