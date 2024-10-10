import { Request, Response, NextFunction } from 'express';
import { requestQueue } from '../config/requestQueue';
import mongoose from 'mongoose';

export const queueRequestMiddleware = (req: Request, res: Response, next?: NextFunction) => {
  const id = new mongoose.Types.ObjectId(); // Generate a unique ID for each request
  console.log(`Adding request to queue with ID: ${id}`);

  // Only extract serializable parts of req and omit circular structures
  const serializableReq = {
    id,
    method: req.method,
    url: req.url,
    body: req.body,
    query: req.query,
    params: req.params,
    headers: req.headers
  };

  // Add the serializable request to the queue
  requestQueue
    .add({ id, req: serializableReq })
    .then(() => {
      console.log('Request added to queue successfully');
      if (next) {
        next(); // Proceed to the next middleware
      }
    })
    .catch((err) => {
      console.error('Error adding request to queue:', err);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Failed to queue request' });
      }
    });

  res.on('finish', () => {
    console.log(`Request with ID ${id} completed.`);
  });
};
