import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./User.entity"

export enum Status {
  active = "active",
  cancelled = "cancelled"
}

@Entity("appointments") 
export class Appointment {
  @PrimaryGeneratedColumn()
  id!: number

@Column({ type: "timestamp" })
date!: Date


  @Column({ type: "varchar", length: 10 })
  time!: string

  @Column({
    type: "enum",
    enum: Status,
    default: Status.active
  })
  status!: Status

  @Column({ type: "int" })
  userId!: number

  @Column({ type: "jsonb", nullable: true })
  service!: {
    name: string
    instructor: string
    duration: string
  }

@ManyToOne(() => User, (user) => user.appointments)
@JoinColumn({ name: "userId" })
user!: User;
}