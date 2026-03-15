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
exports.deleteAppointmentService = exports.cancelAppointmentService = exports.scheduleAppointmentService = exports.getAppointmentsByUserIdService = exports.getAppointmentByIdService = exports.getAppointmentsService = void 0;
const database_1 = require("../config/database");
const Appointment_entity_1 = require("../entities/Appointment.entity");
const userService_1 = require("./userService");
const appointmentRepository = database_1.AppDataSource.getRepository(Appointment_entity_1.Appointment);
const getAppointmentsService = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield appointmentRepository.find();
});
exports.getAppointmentsService = getAppointmentsService;
const getAppointmentByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield appointmentRepository.findOne({ where: { id } });
    if (!appointment)
        throw new Error(`La cita con id: ${id} no fue encontrada.`);
    return appointment;
});
exports.getAppointmentByIdService = getAppointmentByIdService;
const getAppointmentsByUserIdService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, userService_1.getUserByIdService)(userId);
    return yield appointmentRepository.find({
        where: { userId },
        order: { date: "ASC", time: "ASC" }
    });
});
exports.getAppointmentsByUserIdService = getAppointmentsByUserIdService;
const scheduleAppointmentService = (appointmentData) => __awaiter(void 0, void 0, void 0, function* () {
    let fecha;
    if (typeof appointmentData.date === "string") {
        const [year, month, day] = appointmentData.date.split("-");
        fecha = new Date(Number(year), Number(month) - 1, Number(day));
    }
    else if (appointmentData.date instanceof Date) {
        fecha = appointmentData.date;
    }
    else {
        throw new Error("Formato de fecha inválido");
    }
    const diaSemana = fecha.getDay();
    if (diaSemana === 0 || diaSemana === 6) {
        throw new Error("No se pueden agendar turnos los fines de semana.");
    }
    if (typeof appointmentData.time !== "string") {
        throw new Error("Formato de hora inválido");
    }
    const [hora, minutos] = appointmentData.time.split(":").map(Number);
    const horaEnDecimal = hora + minutos / 60;
    if (horaEnDecimal < 10 || horaEnDecimal >= 20) {
        throw new Error("Los turnos solo pueden reservarse entre las 10:00 y las 20:00 horas.");
    }
    const userFound = yield (0, userService_1.getUserByIdService)(appointmentData.userId);
    if (!userFound) {
        throw new Error("Usuario no encontrado.");
    }
    const newAppointment = appointmentRepository.create({
        date: fecha,
        time: appointmentData.time,
        status: Appointment_entity_1.Status.active,
        userId: userFound.id,
        service: appointmentData.service
    });
    yield appointmentRepository.save(newAppointment);
    return newAppointment;
});
exports.scheduleAppointmentService = scheduleAppointmentService;
const cancelAppointmentService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield appointmentRepository.findOne({ where: { id } });
    if (!appointment)
        throw new Error(`Turno con id ${id} no encontrado.`);
    if (appointment.status === Appointment_entity_1.Status.cancelled)
        throw new Error("El turno ya está cancelado.");
    appointment.status = Appointment_entity_1.Status.cancelled;
    yield appointmentRepository.save(appointment);
    return appointment;
});
exports.cancelAppointmentService = cancelAppointmentService;
const deleteAppointmentService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield appointmentRepository.findOne({ where: { id } });
    if (!appointment) {
        throw new Error(`El turno con id ${id} no fue encontrado.`);
    }
    if (appointment.status !== Appointment_entity_1.Status.cancelled) {
        throw new Error("Solo se pueden eliminar turnos cancelados.");
    }
    yield appointmentRepository.remove(appointment);
    return appointment;
});
exports.deleteAppointmentService = deleteAppointmentService;
