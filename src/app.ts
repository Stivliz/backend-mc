import express from "express";
import cors from "cors";
import morgan from "morgan";
import songs from "./routes/song.route";
import albums from "./routes/album.route";
import authRout from "./routes/auth.route";
import authRoutPost from "./routes/authPost.route";
import bandRoute from "./routes/band.route";

const app = express();

//Middlewares
app.use(express.json({ limit: "50mb" })); // Aumenta el límite de tamaño para el JSON
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Aumenta el límite de tamaño para datos URL-encoded
app.use(morgan("dev"));
app.use(cors());

//Routes
app.use("/api/v1", songs);
app.use("/api/v1", albums);

//Routes
app.use("/api/v1/bands", bandRoute);

app.use("/api/v1/login/login", authRout);
app.use("/api/v1/login/register", authRoutPost);

export default app;
