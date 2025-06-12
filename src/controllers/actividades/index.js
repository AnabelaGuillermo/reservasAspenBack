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
        console.log(`Actividad antigua eliminada: ${actividad._id}`);
      }
      console.log(
        `Se eliminaron ${actividadesAntiguas.length} actividades antiguas para mantener el límite de 50.`,
      );
    }
  } catch (e) {
    console.error('Error al registrar actividad: ', e);
  }
};
