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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAppointmentController = exports.cancelAppointmentController = exports.scheduleAppointmentController = exports.getAppointmentsByUserIdController = exports.getAppointmentByIdController = exports.getAppointmentsController = void 0;
const appointmentService_1 = require("../services/appointmentService");
const getAppointmentsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, appointmentService_1.getAppointmentsService)();
        res.status(200).json({ message: "Obtener el listado de todos los turnos", data });
    }
    catch (err) {
        res.status(400).json({
            message: "Error al procesar la solicitud",
            error: err instanceof Error ? err.message : "Error desconocido",
        });
    }
});
exports.getAppointmentsController = getAppointmentsController;
const getAppointmentByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, appointmentService_1.getAppointmentByIdService)(parseInt(req.params.id));
        res.status(200).json({ message: "Obtener el detalle de un turno específico", data });
    }
    catch (err) {
        res.status(400).json({
            message: "Error al procesar la solicitud",
            error: err instanceof Error ? err.message : "Error desconocido",
        });
    }
});
exports.getAppointmentByIdController = getAppointmentByIdController;
const getAppointmentsByUserIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.id);
        const appointments = yield (0, appointmentService_1.getAppointmentsByUserIdService)(userId);
        res.status(200).json(appointments);
    }
    catch (err) {
        res.status(400).json({
            message: "Error al obtener turnos del usuario",
            error: err instanceof Error ? err.message : "Error desconocido",
        });
    }
});
exports.getAppointmentsByUserIdController = getAppointmentsByUserIdController;
const scheduleAppointmentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, appointmentService_1.scheduleAppointmentService)(req.body);
        res.status(201).json({ message: "Turno agendado exitosamente", data });
    }
    catch (err) {
        res.status(400).json({
            message: "Error al agendar turno",
            error: err instanceof Error ? err.message : "Error desconocido",
        });
    }
});
exports.scheduleAppointmentController = scheduleAppointmentController;
const cancelAppointmentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: "ID inválido" });
        }
        const appt = yield (0, appointmentService_1.getAppointmentByIdService)(id);
        if (appt.userId !== req.user.id) {
            return res.status(403).json({ message: "No tenés permiso para cancelar este turno" });
        }
        const updated = yield (0, appointmentService_1.cancelAppointmentService)(id);
        return res.status(200).json({ message: "Turno cancelado exitosamente", data: updated });
    }
    catch (err) {
        return res.status(400).json({
            message: "Error al cancelar turno",
            error: err instanceof Error ? err.message : "Error desconocido",
        });
    }
});
exports.cancelAppointmentController = cancelAppointmentController;
const deleteAppointmentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const appt = yield (0, appointmentService_1.getAppointmentByIdService)(id);
        if (appt.userId !== req.user.id) {
            res.status(403).json({ message: "No tenés permiso para eliminar este turno" });
            return;
        }
        const deleted = yield (0, appointmentService_1.deleteAppointmentService)(id);
        res.status(200).json({ message: 'Turno eliminado definitivamente', deleted });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.deleteAppointmentController = deleteAppointmentController;
