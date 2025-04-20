import express from 'express';

import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import userRoutes from './routes/user.routes.js';
import categoryRoute from './routes/category.route.js';
import uploadRouter from './routes/upload.router.js';
import subCategoryRoute from './routes/subCategory.route.js';
import productRouter from './routes/product.route.js';
import cartRouter from './routes/cart.router.js';
import addressRouter from './routes/address.route.js';
import orderRouter from './routes/order.route.js';
import connectDB from './config/connectDB.js';

dotenv.config();

const app = express();
const DATABASE_URL = process.env.DATABASE_URL;

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Database Connection
connectDB(DATABASE_URL);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());



// Routes
app.get('/', (req, res) => {
  res.send('Backend is running');
});


app.use('/api/user', userRoutes);
app.use('/api/category', categoryRoute);
app.use('/api/file', uploadRouter);
app.use('/api/subcategory', subCategoryRoute);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

export default app;
