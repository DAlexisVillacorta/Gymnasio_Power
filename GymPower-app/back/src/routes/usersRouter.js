"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersController_1 = require("../controllers/usersController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const usersRouter = (0, express_1.Router)();
// Rutas públicas
usersRouter.post("/users/register", (req, res) => (0, usersController_1.registerUserController)(req, res));
usersRouter.post("/users/login", (req, res) => (0, usersController_1.loginUserController)(req, res));
// Rutas protegidas
usersRouter.get("/users", authMiddleware_1.authMiddleware, usersController_1.getUsersController);
usersRouter.get("/users/:id", authMiddleware_1.authMiddleware, (req, res) => (0, usersController_1.getUserByIdController)(req, res));
exports.default = usersRouter;
