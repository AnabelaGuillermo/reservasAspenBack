import mongoose from 'mongoose';

const reservaEntregadaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  motoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Moto',
    required: true,
  },
  cliente: {
    type: String,
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
  },
  hora: {
    type: String,
    required: true,
  },
  recibo: {
    type: String,
    required: true,
  },
  numeroComanda: {
    type: String,
    required: true,
  },
  observaciones: {
    type: String,
    required: false,
  },
  fechaEntregaDefinitiva: {
    type: Date,
    default: Date.now,
  },
  modifications: [
    {
      modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
      },
      modificationDate: {
        type: Date,
        default: Date.now,
      },
      modificationType: {
        type: String,
      },
    },
  ],
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  modificationDate: {
    type: Date,
    default: Date.now,
  },
});

const ReservaEntregada = mongoose.model('ReservaEntregada', reservaEntregadaSchema);
export default ReservaEntregada;