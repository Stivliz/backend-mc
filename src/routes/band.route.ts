import express from "express";
import bandController from "../controllers/band.controller";
const router = express.Router();

router.route('/').get(bandController.getBand)
router.route('/search').get(bandController.searchBand);
router.route('/band/:id').get(bandController.getItemById)


export default router
