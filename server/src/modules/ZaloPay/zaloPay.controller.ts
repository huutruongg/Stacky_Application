import { Request, Response } from 'express';
import { ZaloPayService } from './zaloPay.service';

export const ZaloPayController = {
  createOrder: async (req: Request, res: Response) => {
    try {
      const data = await ZaloPayService.createOrder();
      return res.status(200).json(data);
    } catch (error : any) {
      return res.status(500).json({ error: error.message });
    }
  },

  handleCallback: (req: Request, res: Response) => {
    try {
      const isValid = ZaloPayService.verifyCallback(req.body);
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid callback data' });
      }

      console.log("Update order status as success based on app_trans_id");
      return res.status(200).json({ return_code: 1, return_message: 'success' });
    } catch (error: any) {
      return res.status(500).json({ return_code: 0, return_message: error.message });
    }
  },

  checkOrderStatus: async (req: Request, res: Response) => {
    const { app_trans_id } = req.body;

    try {
      const data = await ZaloPayService.checkOrderStatus(app_trans_id);
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
};
