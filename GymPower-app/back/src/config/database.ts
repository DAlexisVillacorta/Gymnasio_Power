import { DataSource } from "typeorm"
import "dotenv/config"

const isProduction = process.env.NODE_ENV === "production"

export const AppDataSource = new DataSource({
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
})


export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize()
    console.log("Base de datos conectada exitosamente")
  } catch (error) {
    console.error("Error al conectar la base de datos:", error)
    throw error
  }
}