
import express from 'express';
import jewelryRoutes from './routes/jewelry.js';

const app = express();

app.use(express.json());

app.use('/api', jewelryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SERVER CORRIENDO EN EL SERVIDOR:  ${PORT}`));
