import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Hospital } from "../hospital/entities/hospital.entity";
import { Habitacion } from "./entities/habitacion.entity";
import { HabitacionController } from "./habitacion.controller";
import { HabitacionService } from "./habitacion.service";

@Module({
  imports: [TypeOrmModule.forFeature([Hospital, Habitacion])],
  controllers: [HabitacionController],
  providers: [HabitacionService],
})
export class HabitacionModule {}