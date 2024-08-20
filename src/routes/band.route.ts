import express from "express";
import bandController from "../controllers/band.controller";
const router = express.Router();

router.route('/').get(bandController.getBand)

export default router
