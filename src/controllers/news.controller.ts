import { Request, Response } from "express";
import { NewsService } from "../services/news.service";

export class NewsController {
  // Endpoint para iniciar el scraping manualmente
  static async scrapeNews(req: Request, res: Response): Promise<void> {
    try {
      const news = await NewsService.scrapeNews();
      res.status(200).json({
        message: "Noticias scrapeadas exitosamente",
        data: news,
      });
    } catch (error) {
      res.status(500).json({ message: "Error al scrapeear noticias", error });
    }
  }

  // Endpoint para obtener todas las noticias
  static async getAllNews(req: Request, res: Response): Promise<void> {
    try {
      const news = await NewsService.getAllNews();
      res.status(200).json(news);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener noticias", error });
    }
  }
}