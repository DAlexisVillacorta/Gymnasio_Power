"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
// Mock del DataSource — los tests no necesitan una base de datos real
exports.AppDataSource = {
    getRepository: jest.fn(),
    initialize: jest.fn(),
};
