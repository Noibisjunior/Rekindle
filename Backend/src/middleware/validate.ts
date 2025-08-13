import  { ZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';

export function validate(schema: ZodObject<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = ['GET', 'DELETE'].includes(req.method) ? req.query : req.body;
    const result = schema.safeParse(data);
    if (!result.success) {
      return res.status(400).json({ error: 'ValidationError', details: result.error.format() });
    }
    // put parsed data back so controllers can use typed values
    if (['GET', 'DELETE'].includes(req.method)) req.query = result.data as any;
    else req.body = result.data;
    next();
  };
}
