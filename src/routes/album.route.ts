import { Router } from "express";
import albumControllers from "../controllers/album.controlers";
import { validateToken } from "../middlewares/validateToken";

const router = Router();

router
  .get("/albums", albumControllers.getItems)
  .get("/album/:id", albumControllers.getItemById)
  .post("/album", validateToken, albumControllers.postItem)
  .put("/album/:id", albumControllers.updateItem)
  .delete("/album/:id", albumControllers.deleteItem);

export default router;
