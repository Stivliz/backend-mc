import { Router } from'express';
import songControllers from '../controllers/song.controllers'

const router = Router();
 
router.get('/songs', songControllers.getItems)
      .get('/song/:id', songControllers.getItemById)
      .post('/song', songControllers.postItem)
      .put('/song/:id', songControllers.updateItem)
      .delete('/song/:id', songControllers.deleteItem)


export default router;