// Mock del DataSource — los tests no necesitan una base de datos real
export const AppDataSource = {
  getRepository: jest.fn(),
  initialize: jest.fn(),
};
