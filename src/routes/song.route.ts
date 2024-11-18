import { Router } from "express";
import songControllers from "../controllers/song.controllers";
import { validateToken } from "../middlewares/validateToken";

const router = Router();

router
  .get("/songs", validateToken, songControllers.getItems)
  .get("/song/:id", songControllers.getItemById)
  .post("/song", validateToken, songControllers.postItem)
  .put("/song/:id", songControllers.updateItem)
  .delete("/song/:id", songControllers.deleteItem);

export default router;
