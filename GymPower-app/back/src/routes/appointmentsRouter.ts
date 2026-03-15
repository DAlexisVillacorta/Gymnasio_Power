import { Router, Request, Response } from 'express';
import {
    getAppointmentsController,
    getAppointmentByIdController,
    getAppointmentsByUserIdController,
    scheduleAppointmentController,
    cancelAppointmentController,
    deleteAppointmentController
} from '../controllers/appointmentsController';
import { ScheduleAppointmentDTO } from '../../DOTs/appointmentDTO';
import { authMiddleware } from '../middleware/authMiddleware';

const appointmentsRouter: Router = Router();

// Todas las rutas de turnos requieren autenticación
appointmentsRouter.use(authMiddleware);

appointmentsRouter.get("/", getAppointmentsController);

appointmentsRouter.get("/user/:id", (req: Request<{ id: string }>, res: Response) =>
    getAppointmentsByUserIdController(req, res)
);

appointmentsRouter.get("/:id", (req: Request<{ id: string }>, res: Response) =>
    getAppointmentByIdController(req, res)
);

appointmentsRouter.post("/schedule", (req: Request<unknown, unknown, ScheduleAppointmentDTO>, res: Response) =>
    scheduleAppointmentController(req, res)
);

appointmentsRouter.put("/cancel/:id", (req: Request<{ id: string }>, res: Response) =>
    cancelAppointmentController(req, res)
);

appointmentsRouter.delete("/:id", (req: Request<{ id: string }>, res: Response) =>
    deleteAppointmentController(req, res)
);

export default appointmentsRouter;