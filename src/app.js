import express from 'express'
import morgan from 'morgan'
import lorem from '../package.json'

import {createRoles} from './libs/initialSetup'

import productsRoutes from './routes/products.routes'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'

const app = express()
createRoles();

app.set('lorem', lorem);

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) =>{
    res.json({
        name: app.get('lorem').name,
        author: app.get('lorem').author,
        description: app.get('lorem').description,
        version: app.get('lorem').version
    })
})

app.use('/api/products', productsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


export default app;
