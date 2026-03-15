import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserLoginDTO, UserRegisterDTO } from "../../DOTs/UserDOTs";
import { getUserByIdService, getUsersService, registerUserService } from "../services/userService";
import { checkCredentials } from "../services/credentialService";
import { JWT_SECRET } from "../config/envs";

export const getUsersController = async (req: Request, res: Response) => {
    try {
        const users = await getUsersService();
        res.status(200).json({
            message: "Listado de todos los usuarios",
            data: users
        });
    } catch (err) {
        res.status(400).json({
            message: `Error en la obtención de usuarios.`,
            error: err instanceof Error ? err.message : 'Error desconocido'
        });
    }
}

export const getUserByIdController = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);
        
        if (isNaN(userId)) {
            return res.status(400).json({
                message: "ID inválido",
                error: "El ID debe ser un número"
            });
        }
        
        const user = await getUserByIdService(userId);
        
        const response = {
            id: user.id,
            name: user.name,
            email: user.email,
            birthdate: user.birthdate,
            nDni: user.nDni,
            username: user.credential?.username,
            turns: user.appointments || []
        };
        
        res.status(200).json(response);
    } catch (err) {
        res.status(404).json({
            message: `Usuario no encontrado`,
            error: err instanceof Error ? err.message : 'Error desconocido'
        })
    }
}

export const registerUserController = async (
    req: Request<unknown, unknown, UserRegisterDTO>, 
    res: Response
): Promise<void> => {
    try {
        const newUser = await registerUserService(req.body)
        res.status(201).json({
            message: `Usuario registrado exitosamente`,
            data: newUser
        })
    } catch (err) {
        res.status(400).json({
            message: `Error en el registro del usuario.`,
            error: err instanceof Error ? err.message : 'Error desconocido'
        })
    }
}

export const loginUserController = async (
    req: Request<unknown, unknown, UserLoginDTO>,
    res: Response
) => {
    try {
        const { username, password } = req.body;

        const { userId, username: validatedUsername } = await checkCredentials(username, password);
        const user = await getUserByIdService(userId);

        const token = jwt.sign(
            { id: userId, username: validatedUsername },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            message: `Login exitoso`,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                username: validatedUsername
            }
        });
    } catch (err) {
        res.status(400).json({
            message: `Error en el login`,
            error: err instanceof Error ? err.message : 'Error desconocido'
        });
    }
}