import express from 'express';
import morgan from 'morgan';
import connectdb from './db/db.js';
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import cookieParser from 'cookie-parser';
import aiRoutes from './routes/ai.routes.js'
import cors from 'cors'

connectdb();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/ai', aiRoutes)

app.use('/users', userRoutes);
app.use('/projects', projectRoutes);

app.get('/', (req,res) => {
    res.send('Hello world')
})

export default app;