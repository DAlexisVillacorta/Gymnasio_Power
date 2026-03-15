import bcrypt from 'bcrypt';
import { AppDataSource } from '../config/database';

// Mock bcrypt para que los tests corran rápido
jest.mock('bcrypt');

const mockCredentialRepo = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockUserRepo = {
  findOne: jest.fn(),
};

(AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
  const name = typeof entity === 'function' ? entity.name : '';
  if (name === 'Credential') return mockCredentialRepo;
  if (name === 'User') return mockUserRepo;
  return {};
});

// Importar DESPUÉS de configurar los mocks
import { CreateCredentials, checkCredentials } from '../services/credentialService';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CreateCredentials', () => {
  it('crea credenciales correctamente cuando el username no existe', async () => {
    mockCredentialRepo.findOne.mockResolvedValue(null);
    mockCredentialRepo.create.mockReturnValue({ id: 1, username: 'usuario1', password: 'hash' });
    mockCredentialRepo.save.mockResolvedValue(undefined);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hash_seguro');

    const id = await CreateCredentials('usuario1', 'password123');

    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(mockCredentialRepo.save).toHaveBeenCalled();
    expect(id).toBe(1);
  });

  it('lanza error si el username ya existe', async () => {
    mockCredentialRepo.findOne.mockResolvedValue({ id: 1, username: 'usuario1' });

    await expect(CreateCredentials('usuario1', 'password123')).rejects.toThrow(
      'ya existe'
    );
  });
});

describe('checkCredentials', () => {
  it('retorna userId y username con credenciales correctas', async () => {
    mockCredentialRepo.findOne.mockResolvedValue({ id: 1, username: 'usuario1', password: 'hash' });
    mockUserRepo.findOne.mockResolvedValue({ id: 42, name: 'Juan' });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await checkCredentials('usuario1', 'password123');

    expect(result).toEqual({ userId: 42, username: 'usuario1' });
  });

  it('lanza error si el username no existe', async () => {
    mockCredentialRepo.findOne.mockResolvedValue(null);

    await expect(checkCredentials('noexiste', 'pass')).rejects.toThrow(
      'Credenciales incorrectas'
    );
  });

  it('lanza error si la contraseña es incorrecta', async () => {
    mockCredentialRepo.findOne.mockResolvedValue({ id: 1, username: 'usuario1', password: 'hash' });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(checkCredentials('usuario1', 'wrong')).rejects.toThrow(
      'Credenciales incorrectas'
    );
  });
});
