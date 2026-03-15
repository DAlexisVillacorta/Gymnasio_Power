import express, { Application } from "express"
import router from "./routes/routes";
import cors from "cors"
import { CORS_ORIGIN } from "./config/envs";

const server: Application = express();

server.use(cors({ origin: CORS_ORIGIN }));
server.use(express.json());
server.use(router);

export default server;