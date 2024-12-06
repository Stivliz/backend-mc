import { Router } from "express";
import { NewsController } from "../controllers/news.controller";

const router = Router();

router.get("/scrape", NewsController.scrapeNews); // Inicia scraping manual
router.get("/", NewsController.getAllNews); // Devuelve todas las noticias

export default router;