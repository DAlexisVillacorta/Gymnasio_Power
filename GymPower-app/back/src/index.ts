import "reflect-metadata";
import { PORT } from "./config/envs"
import server from "./server"
import { initializeDatabase } from "./config/database"

initializeDatabase()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("No se pudo iniciar el servidor:", error)
    process.exit(1)
  })