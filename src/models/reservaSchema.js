import mongoose from 'mongoose';

const reservaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  motoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Moto',
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
  isActive: {
    type: Boolean,
    default: true,
  },
  modifications: [
    {
      modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    ref: 'User',
    required: true,
  },
  modificationDate: {
    type: Date,
    default: Date.now,
  },
});

const Reserva = mongoose.model('Reserva', reservaSchema);
export default Reserva;
