import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Hospital } from "../../hospital/entities/hospital.entity";

@Entity({ name: "HABITACION" })
export class Habitacion {
  @PrimaryGeneratedColumn({ name: "ID" })
  id!: number;

  @Column({ name: "NOMBRE", type: "varchar", length: 120 })
  nombre!: string;

  @Column({ name: "CAMAS", type: "integer" })
  camas!: number;

  @ManyToOne(() => Hospital, (hospital) => hospital.habitaciones, { nullable: false })

  @JoinColumn({ name: "ID_HOSPITAL" })

  hospital!: Hospital;
}