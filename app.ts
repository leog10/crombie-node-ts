import express from 'express';
import cors from 'cors';
import productRouter from './routes/product';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', productRouter);

export default app;
