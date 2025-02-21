import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/dbConfig.js';
import userRoute from './routes/userRoute.js';
import productRoute from './routes/productRoute.js';
import cartRoute from './routes/cartRoute.js';
import wishlistRoute from './routes/wishlistRoute.js'
import cookieParser from 'cookie-parser';
import orderRoute from './routes/orderRoute.js';
import errorHandler from './middlewares/errorHandler.js'
import adminRoute from './routes/adminRoute.js'
// import paymentRoutes from './routes/paymentRoutes.js'

dotenv.config();

const app = express();
connectDB();


const corsOptions = {
  // origin: process.env.CLIENT_URL || "http://localhost:5173", // Add frontend URL here,
  origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed methods
    credentials: true, // Allow credentials (cookies, HTTP authentication)
  };


// Middleware
// app.use(cors());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());                                   //  parse cookies into req.cookies

console.log("asdfghjkl;,in serv")

app.use('/api', userRoute);
app.use('/api/users', productRoute);
app.use('/api/users', cartRoute);
app.use('/api/users', wishlistRoute);
app.use('/api/users', orderRoute);
// app.use('/api/payment',paymentRoutes);
app.use('/api/admin',adminRoute);

// app.use(errorHandler)

// app.get('/', (req, res) => {
//     res.send('E-commerce Backend is up and running!');
// });




const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// mongoose.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })     //ensure that it can successfully connect to the database
//     .then(() => {
//         console.log('MongoDB Connected');
//         app.listen(PORT, () => console.log(`Server running on port ${PORT}`));                // starts the Express server to handle incoming requests and routes
//     })
//     .catch(err => console.error(err));
