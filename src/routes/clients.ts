// Importaciones
import { Router } from "express";
import { clientsController } from '../controllers';

// Controllers
const {getClients, getClient, postClient, updateClient, deleteClient} = clientsController;

// Router
const router:Router = Router();

router.get('/', getClients);

router.get('/:id', [], getClient);

router.post('/',[], postClient);

router.patch('/:id', [], updateClient);

router.delete('/:id', [], deleteClient);

export default router;
