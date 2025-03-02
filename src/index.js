import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import { mainRouter } from './routes/mainRouter.js';

console.clear();
console.log('Inicializando servidor...');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.use('/api/v1', mainRouter);

app.listen(PORT, () => {
  console.log(`El servidor está arriba y en el puerto ${PORT}`);
});
