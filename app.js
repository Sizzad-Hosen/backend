import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';                    // Importing CORS
import connectdb from "../backend/config/connectDB.js"
// import userRoutes from './routes/userRoutes.js';  // Importing user routes
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


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;      // Default port if .env is missing
const DATABASE_URL = process.env.DATABASE_URL;

// CORS Policy Setup
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Database Connection
connectdb(DATABASE_URL);

// Middleware
app.use(express.json());

app.use(cookieParser());

// Use Helmet to set secure HTTP headers
app.use(helmet({
    crossOriginResourcePolicy: false
  }));
  

// Use Morgan for logging HTTP requests
app.use(morgan());



// Load Routes
 app.use('/api/user',userRoutes);
 app.use('/api/category',categoryRoute);

 app.use('/api/file',uploadRouter);

app.use("/api/subcategory",subCategoryRoute)

app.use("/api/product",productRouter)

app.use("/api/cart",cartRouter);

app.use("/api/address",addressRouter);

app.use("/api/order",orderRouter);

// Start Server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
