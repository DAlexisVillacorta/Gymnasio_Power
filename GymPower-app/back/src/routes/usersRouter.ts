import { Request, Response, Router } from 'express';
import {
    getUserByIdController,
    getUsersController,
    loginUserController,
    registerUserController
} from '../controllers/usersController';
import { UserLoginDTO, UserRegisterDTO } from '../../DOTs/UserDOTs';
import { authMiddleware } from '../middleware/authMiddleware';

const usersRouter: Router = Router();

// Rutas públicas
usersRouter.post("/users/register", (req: Request<unknown, unknown, UserRegisterDTO>, res: Response) =>
    registerUserController(req, res)
);
usersRouter.post("/users/login", (req: Request<unknown, unknown, UserLoginDTO>, res: Response) =>
    loginUserController(req, res)
);

// Rutas protegidas
usersRouter.get("/users", authMiddleware, getUsersController);
usersRouter.get("/users/:id", authMiddleware, (req: Request<{ id: string }>, res: Response) =>
    getUserByIdController(req, res)
);

export default usersRouter;