import express from 'express';
import morgan from 'morgan';
import connectdb from './db/db.js';

connectdb();

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res) => {
    res.send('Hello world')
})

export default app;