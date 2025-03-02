import mongoose from 'mongoose';

const reservaSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  motoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Moto', required: true },
  fecha: { type: Date, required: true },
  hora: { type: String, required: true },
  recibo: { type: String, required: true },
  numeroComanda: { type: String, required: true },
  observaciones: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  historial: [
    {
      fecha: { type: Date, default: Date.now },
      usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      accion: { type: String, enum: ['Creación', 'Modificación', 'Eliminación'], required: true }
    }
  ],
});

const ReservaModel = mongoose.model('Reserva', reservaSchema);

export default ReservaModel;
