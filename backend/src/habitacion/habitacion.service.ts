import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Hospital } from "../hospital/entities/hospital.entity";
import { Habitacion } from "./entities/habitacion.entity";

@Injectable()
export class HabitacionService {
  constructor(
    @InjectRepository(Habitacion)
    private readonly habitacionRepository: Repository<Habitacion>,
    @InjectRepository(Hospital)
    private readonly hospitalRepository: Repository<Hospital>,
  ) {}

  findAll() {
    return this.habitacionRepository
      .createQueryBuilder("registro")
      .innerJoinAndSelect("registro.hospital", "principal")
      .orderBy("registro.id", "ASC")
      .getMany();
  }

  findByHospital(principalId: number) {
    return this.habitacionRepository
      .createQueryBuilder("registro")
      .innerJoinAndSelect("registro.hospital", "principal")
      .where("principal.id = :principalId", { principalId })
      .orderBy("registro.id", "ASC")
      .getMany();
  }

  searchByName(text: string) {
    return this.habitacionRepository
      .createQueryBuilder("registro")
      .innerJoinAndSelect("registro.hospital", "principal")
      .where("registro.nombre ILIKE :pattern", { pattern: `%${text}%` })
      .orderBy("registro.id", "ASC")
      .getMany();
  }

  findByHospitalAndMinimum(principalId: number, minimum: number) {
    return this.habitacionRepository
      .createQueryBuilder("registro")
      .innerJoinAndSelect("registro.hospital", "principal")
      .where("principal.id = :principalId", { principalId })
      .andWhere("registro.camas >= :minimum", { minimum })
      .orderBy("registro.camas", "DESC")
      .getMany();
  }

  countByHospital() {
    return this.hospitalRepository
      .createQueryBuilder("principal")
      .leftJoin("principal.habitaciones", "registro")
      .select("principal.id", "id")
      .addSelect("principal.nombre", "nombre")
      .addSelect("COUNT(registro.id)", "total")
      .groupBy("principal.id")
      .addGroupBy("principal.nombre")
      .orderBy("principal.id", "ASC")
      .getRawMany();
  }

  create(datos: Partial<Habitacion>) {
    const habitacion = this.habitacionRepository.create(datos);
    return this.habitacionRepository.save(habitacion);
  }

  getHabitacionById(id: number) {
    return this.habitacionRepository.findOne({ where: { id } });
  }

  delete(id: number) {
    return this.habitacionRepository.delete(id);
  }

  update(id: number, datos: Partial<Habitacion>) {
    return this.habitacionRepository.update(id, datos);
  }

  updateHospital(id: number, hospitalId: number) {
    return this.habitacionRepository.update(id, { hospital: { id: hospitalId } });
  }
}