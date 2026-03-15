"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes/routes"));
const cors_1 = __importDefault(require("cors"));
const envs_1 = require("./config/envs");
const server = (0, express_1.default)();
server.use((0, cors_1.default)({ origin: envs_1.CORS_ORIGIN }));
server.use(express_1.default.json());
server.use(routes_1.default);
exports.default = server;
