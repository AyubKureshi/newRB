import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbConnect } from './database/dbConnection.js';
import authRoutes from './routes/authRouter.js';
import crudRouter from './routes/crudRouter.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

dbConnect();
app.use('/auth', authRoutes);
app.use(crudRouter);

app.listen(PORT, () => {
    console.log(`Server is running on "http://localhost:${PORT}"`);
});