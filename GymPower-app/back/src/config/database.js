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
exports.initializeDatabase = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
require("dotenv/config");
const isProduction = process.env.NODE_ENV === "production";
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // En producción usamos migraciones; en desarrollo sincroniza automáticamente
    synchronize: !isProduction,
    logging: !isProduction,
    entities: isProduction
        ? ["dist/entities/**/*.js"]
        : ["src/entities/**/*.ts"],
    migrations: isProduction
        ? ["dist/migrations/**/*.js"]
        : ["src/migrations/**/*.ts"],
    subscribers: []
});
const initializeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.AppDataSource.initialize();
        console.log("Base de datos conectada exitosamente");
    }
    catch (error) {
        console.error("Error al conectar la base de datos:", error);
        throw error;
    }
});
exports.initializeDatabase = initializeDatabase;
