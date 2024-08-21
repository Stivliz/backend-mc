import { Router } from'express';
import albumControllers from '../controllers/album.controlers'

const router = Router();
 
router.get('/albums', albumControllers.getItems)
      .get('/album/:id', albumControllers.getItemById)
      .post('/album', albumControllers.postItem)
      .put('/album/:id', albumControllers.updateItem)
      .delete('/album/:id', albumControllers.deleteItem)


export default router;