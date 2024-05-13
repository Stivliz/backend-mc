import { Router } from'express';
import songControllers from '../controllers/song.controllers'

const router = Router();
 
router.get('/songs', songControllers.getSong)
      .get('/song:id', songControllers.getSong)
      .post('/song', songControllers.postSong)
      .put('/song/:id', songControllers.updateSong)
      .delete('/song/:id', songControllers.deleteSong)


export default router;