"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointmentsController_1 = require("../controllers/appointmentsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const appointmentsRouter = (0, express_1.Router)();
// Todas las rutas de turnos requieren autenticación
appointmentsRouter.use(authMiddleware_1.authMiddleware);
appointmentsRouter.get("/", appointmentsController_1.getAppointmentsController);
appointmentsRouter.get("/user/:id", (req, res) => (0, appointmentsController_1.getAppointmentsByUserIdController)(req, res));
appointmentsRouter.get("/:id", (req, res) => (0, appointmentsController_1.getAppointmentByIdController)(req, res));
appointmentsRouter.post("/schedule", (req, res) => (0, appointmentsController_1.scheduleAppointmentController)(req, res));
appointmentsRouter.put("/cancel/:id", (req, res) => (0, appointmentsController_1.cancelAppointmentController)(req, res));
appointmentsRouter.delete("/:id", (req, res) => (0, appointmentsController_1.deleteAppointmentController)(req, res));
exports.default = appointmentsRouter;
