import { Router } from 'express';
import { ZaloPayController } from '../modules/ZaloPay/zaloPay.controller';

const router = Router();

router.post('/payment', ZaloPayController.createOrder);
router.post('/callback', ZaloPayController.handleCallback);
router.post('/check-status-order', ZaloPayController.checkOrderStatus);

export default router;
