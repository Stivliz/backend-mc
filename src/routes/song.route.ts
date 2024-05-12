import { Router } from'express';
import songControllers from '../controllers/song.controllers'

const router = Router();
 
router.get('/songs', songControllers.getSongs)
      .get('/song', songControllers.getSong)
      .post('/song', songControllers.postSong)
      .put('/song/:id', songControllers.updateSong)
      .delete('/song/:id', songControllers.deleteSong)


export default router;