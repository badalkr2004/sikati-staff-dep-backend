import { z } from "zod";
import { type Request, type Response, type NextFunction } from "express";
export const validateBody = (schema: z.ZodSchema) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const result = schema.parse(req.body);
      req.body = result;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.issues,
        });
      }
    }
  };
};
export function validateQuery(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse(req.query);
      req.query = result as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Query validation failed",
          details: error.issues,
        });
      }
      next(error);
    }
  };
}
