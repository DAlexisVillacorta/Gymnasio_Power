import { AppDataSource } from '../config/database';

const mockAppointmentRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};

const mockUserRepo = {
  findOne: jest.fn(),
};

(AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
  const name = typeof entity === 'function' ? entity.name : '';
  if (name === 'Appointment') return mockAppointmentRepo;
  if (name === 'User') return mockUserRepo;
  return {};
});

import {
  scheduleAppointmentService,
  cancelAppointmentService,
  deleteAppointmentService,
} from '../services/appointmentService';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('scheduleAppointmentService', () => {
  const baseData = {
    date: '2025-03-17', // lunes
    time: '10:00',
    userId: 1,
    service: { name: 'CrossFit', instructor: 'Juan', duration: '60 min' },
  };

  it('crea un turno correctamente en día hábil y horario válido', async () => {
    mockUserRepo.findOne.mockResolvedValue({ id: 1, name: 'Test' });
    const mockAppt = { id: 10, ...baseData, status: 'active' };
    mockAppointmentRepo.create.mockReturnValue(mockAppt);
    mockAppointmentRepo.save.mockResolvedValue(mockAppt);

    const result = await scheduleAppointmentService(baseData);

    expect(mockAppointmentRepo.create).toHaveBeenCalled();
    expect(mockAppointmentRepo.save).toHaveBeenCalled();
    expect(result).toMatchObject({ status: 'active' });
  });

  it('lanza error si el turno es en fin de semana', async () => {
    await expect(
      scheduleAppointmentService({ ...baseData, date: '2025-03-15' }) // sábado
    ).rejects.toThrow('fines de semana');
  });

  it('lanza error si el horario está fuera del rango permitido', async () => {
    await expect(
      scheduleAppointmentService({ ...baseData, time: '08:00' })
    ).rejects.toThrow('10:00');
  });

  it('lanza error si el horario es después de las 20:00', async () => {
    await expect(
      scheduleAppointmentService({ ...baseData, time: '21:00' })
    ).rejects.toThrow('20:00');
  });
});

describe('cancelAppointmentService', () => {
  it('cancela un turno activo correctamente', async () => {
    const appt = { id: 1, status: 'active' };
    mockAppointmentRepo.findOne.mockResolvedValue(appt);
    mockAppointmentRepo.save.mockResolvedValue({ ...appt, status: 'cancelled' });

    const result = await cancelAppointmentService(1);

    expect(result.status).toBe('cancelled');
    expect(mockAppointmentRepo.save).toHaveBeenCalled();
  });

  it('lanza error si el turno no existe', async () => {
    mockAppointmentRepo.findOne.mockResolvedValue(null);

    await expect(cancelAppointmentService(999)).rejects.toThrow('no encontrado');
  });
});

describe('deleteAppointmentService', () => {
  it('elimina un turno existente', async () => {
    const appt = { id: 1, status: 'cancelled' };
    mockAppointmentRepo.findOne.mockResolvedValue(appt);
    mockAppointmentRepo.remove.mockResolvedValue(undefined);

    await expect(deleteAppointmentService(1)).resolves.not.toThrow();
    expect(mockAppointmentRepo.remove).toHaveBeenCalledWith(appt);
  });

  it('lanza error si el turno no existe', async () => {
    mockAppointmentRepo.findOne.mockResolvedValue(null);

    await expect(deleteAppointmentService(999)).rejects.toThrow('no fue encontrado');
  });
});
