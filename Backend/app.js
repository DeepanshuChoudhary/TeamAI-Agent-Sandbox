import express from 'express';
import morgan from 'morgan';
import connectdb from './db/db.js';
import userRoutes from './routes/user.routes.js';

connectdb();

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);

app.get('/', (req,res) => {
    res.send('Hello world')
})

export default app;