import cron from 'node-cron';
import ReservaEntregadaModel from '../models/reservaEntregadaSchema.js';

cron.schedule('0 3 * * *', async () => {
  try {
    const dosMesesAtras = new Date();
    dosMesesAtras.setMonth(dosMesesAtras.getMonth() - 2);

    const result = await ReservaEntregadaModel.deleteMany({
      fechaEntrega: { $lt: dosMesesAtras },
    });

  } catch (error) {
    console.error('Error al eliminar reservas entregadas antiguas:', error);
  }
});