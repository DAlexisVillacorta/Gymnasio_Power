import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity("credentials") // Nombre de la tabla en PostgreSQL
export class Credential {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: "varchar", length: 50, unique: true })
  username!: string

  @Column({ type: "varchar", length: 255 })
  password!: string
}