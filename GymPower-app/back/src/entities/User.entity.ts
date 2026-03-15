import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm"
import { Appointment } from "./Appointment.entity"
import { Credential } from "./Credential.entity"

@Entity("users") 
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: "varchar", length: 100 })
  name!: string

  @Column({ type: "varchar", length: 100, unique: true })
  email!: string

  @Column({ type: "varchar", length: 20 })
  nDni!: string

  @Column({ type: "date" })
  birthdate!: Date

@ManyToOne(() => Credential, { eager: true })
@JoinColumn({ name: "credentialId" })
credential!: Credential


@OneToMany(() => Appointment, (appointment) => appointment.user)
appointments!: Appointment[];

}
