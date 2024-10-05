import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

type SecretOrPrivateKey = Secret;

interface CustomRequest extends Request {
  decoded?: {
    sub: string;
  };
}

export const validateToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const secretKey: SecretOrPrivateKey = process.env.SECRET as string;

  if (!secretKey) {
    return res.status(500).send({ message: "SECRET key not defined" });
  }

  //De headers en su propiedad Authorization tomamos la posicion 1 que es el token.
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log("* Header - token ---> ", token);
  if (!token) {
    return res.status(401).send({ message: "Token not found" });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as { sub: string };
    console.log("* Decoded.sub --> ", decoded.sub);
    // Extraer el bandId (asumo que está en el `sub` o en algún campo del token)
    if (typeof decoded.sub === "string") {
      (req as CustomRequest).decoded = { sub: decoded.sub }; // Asociar el bandId al request
    } else {
      return res.status(400).send({ message: "Invalid token format" });
    }
    next(); // Continuar con la siguiente función del middleware
  } catch (err) {
    return res.status(401).send({ message: "Invalid or expired token" });
  }
};
