import express from 'express';
import authController from '../controllers/auth.controller';

const router = express.Router();

router.route('/').post(authController.singUp)

export default router