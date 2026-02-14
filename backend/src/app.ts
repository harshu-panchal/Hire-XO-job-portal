import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import path from 'path';
import authRoutes from './routes/auth.routes';
import jobRoutes from './routes/job.routes';
import recruiterRoutes from './routes/recruiter.routes';
import investorRoutes from './routes/investor.routes';
import tenderRoutes from './routes/tender.routes';
import equipmentRoutes from './routes/equipment.routes';
import machineryRoutes from './routes/machinery.routes';
import pmcRoutes from './routes/pmc.routes';
import csmRoutes from './routes/csm.routes';
import logisticsRoutes from './routes/logistics.routes';
import vehicleRoutes from './routes/vehicle.routes';
import uploadRoutes from './routes/upload.routes';
import applicationRoutes from './routes/application.routes';
import subscriptionRoutes from './routes/subscription.routes';
import certificateRoutes from './routes/certificate.routes';
import userRoutes from './routes/user.routes';
import resourceRoutes from './routes/resource.routes';
import adminRoutes from './routes/admin.routes';
import notificationRoutes from './routes/notification.routes';
import postRoutes from './routes/post.routes';
import interviewRoutes from './routes/interview.routes';
import promotionRoutes from './routes/promotion.routes';
import promotionPlanRoutes from './routes/promotion-plan.routes';
import walletRoutes from './routes/wallet.routes';
import { errorHandler } from './middlewares/error.middleware';



const app = express();

// Security Middleware
app.set('trust proxy', 1); // Trust first proxy (essential for rate limiting behind proxy)
app.use(helmet());
app.use(cors({
    // origin: https://hire-xo-job-portal.vercel.app/
    //  process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(mongoSanitize());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 1000, // Limit each IP to 1000 requests per `window` (increased for development)
    standardHeaders: 'draft-7', // set `RateLimit` and `RateLimit-Policy` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});



// Apply rate limiter to all API routes
app.use('/api/', limiter);

app.use('/api/promotions', promotionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/interviews', interviewRoutes);
// app.use('/api/', limiter); // Removed: moved up

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/recruiters', recruiterRoutes);
app.use('/api/investors', investorRoutes);
app.use('/api/tenders', tenderRoutes);
app.use('/api/equipments', equipmentRoutes);
app.use('/api/machinery', machineryRoutes);
app.use('/api/pmc', pmcRoutes);
app.use('/api/csm', csmRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/promotion-plans', promotionPlanRoutes);
app.use('/api/wallet', walletRoutes);

// Serve static files from uploads directory


app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
    res.send('Backend API is running');
});

// Global Error Handler (Must be last)
app.use(errorHandler);

export default app;
