import { Request, Response, NextFunction } from "express";
import { session } from "../routes/auth.routes";

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.sesid
  const user = await session.find((user: any) => user.token === token)
  if (user) {
    return next()
  }

  res.status(400).json({ "message": "error" })
}