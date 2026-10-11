import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { ApiError } from "../utils/api-error";

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

// Express recognises error handlers by their 4-argument signature.
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err instanceof Error && err.message === "Only image files are allowed!") {
    return res.status(400).json({ success: false, message: err.message });
  }

  console.error("[UNHANDLED ERROR]", err);
  return res.status(500).json({
    success: false,
    message: "Sorry, something went wrong on our side.",
  });
};
