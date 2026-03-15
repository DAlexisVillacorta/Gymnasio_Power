import { Request, Response } from "express";
import { ScheduleAppointmentDTO } from "../../DOTs/appointmentDTO";
import { 
    cancelAppointmentService, 
    getAppointmentByIdService, 
    getAppointmentsService, 
    scheduleAppointmentService,
    getAppointmentsByUserIdService,
    deleteAppointmentService
} from "../services/appointmentService";

export const getAppointmentsController = async (req: Request, res: Response) => {
    try {
        const data = await getAppointmentsService();
        res.status(200).json({ message: "Obtener el listado de todos los turnos", data });
    } catch (err) {
        res.status(400).json({
            message: "Error al procesar la solicitud",
            error: err instanceof Error ? err.message : "Error desconocido",
        });
    }
};

export const getAppointmentByIdController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const data = await getAppointmentByIdService(parseInt(req.params.id));
        res.status(200).json({ message: "Obtener el detalle de un turno específico", data });
    } catch (err) {
        res.status(400).json({
            message: "Error al procesar la solicitud",
            error: err instanceof Error ? err.message : "Error desconocido",
        });
    }
};

export const getAppointmentsByUserIdController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const userId = parseInt(req.params.id);
        const appointments = await getAppointmentsByUserIdService(userId);
        res.status(200).json(appointments);
    } catch (err) {
        res.status(400).json({
            message: "Error al obtener turnos del usuario",
            error: err instanceof Error ? err.message : "Error desconocido",
        });
    }
};

export const scheduleAppointmentController = async (req: Request<unknown, unknown, ScheduleAppointmentDTO>, res: Response) => {
    try {
        const data = await scheduleAppointmentService(req.body);
        res.status(201).json({ message: "Turno agendado exitosamente", data });
    } catch (err) {
        res.status(400).json({
            message: "Error al agendar turno",
            error: err instanceof Error ? err.message : "Error desconocido",
        });
    }
};

export const cancelAppointmentController = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const appt = await getAppointmentByIdService(id);
    if (appt.userId !== req.user!.id) {
      return res.status(403).json({ message: "No tenés permiso para cancelar este turno" });
    }

    const updated = await cancelAppointmentService(id);
    return res.status(200).json({ message: "Turno cancelado exitosamente", data: updated });
  } catch (err) {
    return res.status(400).json({
      message: "Error al cancelar turno",
      error: err instanceof Error ? err.message : "Error desconocido",
    });
  }
};

export const deleteAppointmentController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)

    const appt = await getAppointmentByIdService(id)
    if (appt.userId !== req.user!.id) {
      res.status(403).json({ message: "No tenés permiso para eliminar este turno" })
      return
    }

    const deleted = await deleteAppointmentService(id)
    res.status(200).json({ message: 'Turno eliminado definitivamente', deleted })
  } catch (error) {
    res.status(400).json({ message: (error as Error).message })
  }
}