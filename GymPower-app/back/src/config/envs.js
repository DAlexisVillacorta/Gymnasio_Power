"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORS_ORIGIN = exports.JWT_SECRET = exports.PORT = void 0;
require("dotenv/config");
exports.PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3030;
if (!process.env.JWT_SECRET) {
    throw new Error("La variable de entorno JWT_SECRET es requerida");
}
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
