import axios from "axios";
import * as cheerio from "cheerio";
import { News, INews } from "../models/news.model";

export class NewsService {
  // Función para realizar el scraping
  static async scrapeNews(): Promise<INews[]> {
    try {
      // Realiza la solicitud con cabeceras para evitar ser bloqueado
      const { data } = await axios.get("https://mariskalrock.com", {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });

      // Verifica que la respuesta no esté vacía
      if (!data || typeof data !== "string") {
        throw new Error("No se obtuvo HTML válido del sitio web");
      }

      // Carga el HTML en cheerio
      const $ = cheerio.load(data);

      // Encuentra los elementos que contienen las noticias
      const divElements = $('div.actualidad').find('div.crpw-item.row');

      if (!divElements || divElements.length === 0) {
        console.warn("No se encontraron elementos de noticias en el sitio");
        return [];
      }

      const newsList: Partial<INews>[] = [];

      // Itera sobre cada elemento encontrado
      divElements.each((i, div) => {
        const title = $(div).find("h4").text().trim();
        const description = $(div).find("p").text().trim();
        const link = $(div).find("a").attr("href");
        // const img = $(div).find("img").attr("src");

        const img =
        $(div).find("img").attr("nitro-lazy-src") || 
        $(div).find("img").attr("src") ||           
        "";

        console.log("img",img);
        

        if (title && link) {
          newsList.push({ title, description, link, img });
        }
      });

      // Valida si se encontró contenido
      if (newsList.length === 0) {
        console.warn("No se encontraron noticias válidas para guardar");
        return [];
      }

      // Guarda en la base de datos y retorna las noticias guardadas
      const savedNews = await News.insertMany(newsList, { ordered: false });
      console.log(`Se guardaron ${savedNews.length} noticias`);
      return savedNews;
    } catch (error:any) {
      console.error("Error scraping news:", error.message);
      throw new Error("Error al realizar el scraping de noticias");
    }
  }

  // Función para obtener todas las noticias desde la base de datos
  static async getAllNews(): Promise<INews[]> {
    return await News.find().sort({ createdAt: -1 });
  }
}
