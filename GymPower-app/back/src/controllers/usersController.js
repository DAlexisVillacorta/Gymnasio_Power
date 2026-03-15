"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserController = exports.registerUserController = exports.getUserByIdController = exports.getUsersController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService_1 = require("../services/userService");
const credentialService_1 = require("../services/credentialService");
const envs_1 = require("../config/envs");
const getUsersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, userService_1.getUsersService)();
        res.status(200).json({
            message: "Listado de todos los usuarios",
            data: users
        });
    }
    catch (err) {
        res.status(400).json({
            message: `Error en la obtención de usuarios.`,
            error: err instanceof Error ? err.message : 'Error desconocido'
        });
    }
});
exports.getUsersController = getUsersController;
const getUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({
                message: "ID inválido",
                error: "El ID debe ser un número"
            });
        }
        const user = yield (0, userService_1.getUserByIdService)(userId);
        const response = {
            id: user.id,
            name: user.name,
            email: user.email,
            birthdate: user.birthdate,
            nDni: user.nDni,
            username: (_a = user.credential) === null || _a === void 0 ? void 0 : _a.username,
            turns: user.appointments || []
        };
        res.status(200).json(response);
    }
    catch (err) {
        res.status(404).json({
            message: `Usuario no encontrado`,
            error: err instanceof Error ? err.message : 'Error desconocido'
        });
    }
});
exports.getUserByIdController = getUserByIdController;
const registerUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = yield (0, userService_1.registerUserService)(req.body);
        res.status(201).json({
            message: `Usuario registrado exitosamente`,
            data: newUser
        });
    }
    catch (err) {
        res.status(400).json({
            message: `Error en el registro del usuario.`,
            error: err instanceof Error ? err.message : 'Error desconocido'
        });
    }
});
exports.registerUserController = registerUserController;
const loginUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const { userId, username: validatedUsername } = yield (0, credentialService_1.checkCredentials)(username, password);
        const user = yield (0, userService_1.getUserByIdService)(userId);
        const token = jsonwebtoken_1.default.sign({ id: userId, username: validatedUsername }, envs_1.JWT_SECRET, { expiresIn: "24h" });
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
    }
    catch (err) {
        res.status(400).json({
            message: `Error en el login`,
            error: err instanceof Error ? err.message : 'Error desconocido'
        });
    }
});
exports.loginUserController = loginUserController;
