import express from 'express';
import cors from 'cors';
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
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json());

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

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
    res.send('Backend API is running');
});

export default app;
