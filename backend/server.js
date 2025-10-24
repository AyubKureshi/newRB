import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbConnect } from './database/dbConnection.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

dbConnect();




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});