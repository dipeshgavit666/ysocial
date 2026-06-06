import {
  type Request,
  type Response,
  type NextFunction,
  type RequestHandler,
} from "express";

export const asyncHander = (requestHandler: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
