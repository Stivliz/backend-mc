import { Router } from'express';
import songControllers from '../controllers/song.controllers'

const router = Router();
 
router.get('/albums', songControllers.getItems)
      .get('/album/:id', songControllers.getItemById)
      .post('/album', songControllers.postItem)
      .put('/album/:id', songControllers.updateItem)
      .delete('/album/:id', songControllers.deleteItem)


export default router;