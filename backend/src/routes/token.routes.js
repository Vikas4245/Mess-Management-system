import { Router } from "express";
import {
    purchaseToken,
    redeemToken,
} from "../controllers/token.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route('/purchase-token').post(purchaseToken);
router.route('/redeem-token').post(redeemToken);

export default router