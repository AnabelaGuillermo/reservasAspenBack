import mongoose from 'mongoose';

const actividadSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  accion: {
    type: String,
    required: true,
  },
  fechaHora: {
    type: Date,
    default: Date.now,
  },
  detalles: {
    type: String,
  },
});

export default mongoose.model('Actividad', actividadSchema);
