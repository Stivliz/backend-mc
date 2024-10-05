import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      bandId?: string | JwtPayload; // Aquí defines la propiedad bandId
    }
  }
}
