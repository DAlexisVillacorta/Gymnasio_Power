import "dotenv/config"

export const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3030;

if (!process.env.JWT_SECRET) {
  throw new Error("La variable de entorno JWT_SECRET es requerida");
}
export const JWT_SECRET: string = process.env.JWT_SECRET;
export const CORS_ORIGIN: string = process.env.CORS_ORIGIN || "http://localhost:5173";