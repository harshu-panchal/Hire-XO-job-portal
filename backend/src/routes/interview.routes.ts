import { Router } from 'express';
import { InterviewController } from '../controllers/interview.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const interviewController = new InterviewController();

router.post('/schedule', authenticateToken, interviewController.scheduleInterview);
router.get('/my', authenticateToken, interviewController.getMyInterviews);
router.patch('/:interviewId/status', authenticateToken, interviewController.updateStatus);
router.delete('/:interviewId', authenticateToken, interviewController.cancelInterview);

export default router;
