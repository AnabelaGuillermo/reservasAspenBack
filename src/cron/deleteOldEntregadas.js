import cron from 'node-cron';
import ReservaEntregadaModel from '../models/reservaEntregadaSchema.js';

cron.schedule('0 3 * * *', async () => {
  try {
    console.log('Ejecutando tarea para eliminar reservas entregadas antiguas...');
    const dosMesesAtras = new Date();
    dosMesesAtras.setMonth(dosMesesAtras.getMonth() - 2);

    const result = await ReservaEntregadaModel.deleteMany({
      fechaEntrega: { $lt: dosMesesAtras },
    });

    console.log(`Se eliminaron ${result.deletedCount} reservas entregadas.`);
  } catch (error) {
    console.error('Error al eliminar reservas entregadas antiguas:', error);
  }
});

console.log('Tarea programada para eliminar reservas entregadas antiguas iniciada.');