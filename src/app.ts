import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import songs from "./routes/song.route";
import albums from "./routes/album.route";
import authRout from "./routes/auth.route";
import authRoutPost from "./routes/authPost.route";
import bandRoute from "./routes/band.route";
import newsRoutes from "./routes/news.route";

const app = express();

// Security Middlewares
app.use(helmet());
app.use(mongoSanitize());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // max 20 auth calls
  message: "Too many auth requests from this IP",
});

// Middlewares
app.use(express.json({ limit: "2mb" })); // Limite de JSON seguro
app.use(express.urlencoded({ limit: "2mb", extended: true })); // Límite seguro
app.use(morgan("dev"));
app.use(cors({
  origin: ["http://localhost:4000", "http://localhost:3000"], 
  credentials: true
}));

//Routes
app.use("/api/v1", songs);
app.use("/api/v1", albums);

//Routes
app.use("/api/v1/bands", bandRoute);
app.use("/api/v1/news", newsRoutes);

app.use("/api/v1/login/login", authLimiter, authRout);
app.use("/api/v1/login/register", authLimiter, authRoutPost);

export default app;
