import { Router } from 'express';
import { 
    recordAttendance,
    getAttendance,
} from "../controllers/attendance.controller.js"

const router = Router();

router.route('/record-attendance').post(recordAttendance);
router.route('/get-attendance/:dateHash').get(getAttendance);

export default router