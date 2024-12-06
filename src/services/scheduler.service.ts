import schedule from "node-schedule";
import { NewsService } from "./news.service"

// Programa el scraping diario a las 8:00 AM
export function scheduleScraping() {
  schedule.scheduleJob("0 8 * * *", async () => {
    console.log("Iniciando scraping diario...");
    await NewsService.scrapeNews();
  });
}