"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const envs_1 = require("./config/envs");
const server_1 = __importDefault(require("./server"));
const database_1 = require("./config/database");
(0, database_1.initializeDatabase)()
    .then(() => {
    server_1.default.listen(envs_1.PORT, () => {
        console.log(`Servidor escuchando en el puerto ${envs_1.PORT}`);
    });
})
    .catch((error) => {
    console.error("No se pudo iniciar el servidor:", error);
    process.exit(1);
});
