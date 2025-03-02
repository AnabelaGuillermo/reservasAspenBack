import mongoose from 'mongoose';

const motoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const Moto = mongoose.model('Moto', motoSchema);
export default Moto;
