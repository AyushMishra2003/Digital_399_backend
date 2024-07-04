import express from 'express';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import morgan from 'morgan';
import basicRoute from './routes/basic.route.js';
import serviceRoute from './routes/service.routes.js';
import smsRouter from './routes/sms.route.js';
import productRoute from './routes/product.routes.js';
import errorMiddleware from './middleware/error.middleware.js';
import userRoute from './routes/user.route.js';
import enquiryRouter from './routes/enquiry.route.js';
import feedbackRouter from './routes/feedback.route.js';


config()

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging requests to the console

// CORS configuration (for handling cross-origin requests)
app.use((req, res, next) => {
  // Allow any origin when credentials are not present
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials like cookies
  next();
});


app.use('/api/v1/user',userRoute)
app.use('/api/v1/basicInfo',basicRoute)
app.use('/api/v1/service',serviceRoute)
app.use('/api/v1/sms',smsRouter)
app.use('/api/v1/product',productRoute)
app.use("/api/v1/inquiry",enquiryRouter)
app.use("/api/v1/feedback",feedbackRouter)

app.use(errorMiddleware)


// Default route for testing server
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Server is running and ready.',
  });
});

// Error handling middleware (must be defined after routes)
// app.use(errorMiddleware);

// Catch-all route for undefined endpoints
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: 'Oops! Not Found',
  });
});

// Export the Express app instance
export default app;
