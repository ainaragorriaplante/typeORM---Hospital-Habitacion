import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { HabitacionService } from "./habitacion.service";
import { Habitacion } from "./entities/habitacion.entity";

@Controller("habitaciones")
export class HabitacionController {
  constructor(private readonly habitacionService: HabitacionService) {}

  @Get()
  findAll() {
    return this.habitacionService.findAll();
  }

  @Get("hospital/:principalId")
  findByHospital(@Param("principalId") principalId: string) {
    return this.habitacionService.findByHospital(Number(principalId));
  }

  @Get("buscar")
  searchByName(@Query("texto") text: string) {
    return this.habitacionService.searchByName(text);
  }

  @Get("hospital/:principalId/minimo/:minimum")
  findByHospitalAndMinimum(
    @Param("principalId") principalId: string,
    @Param("minimum") minimum: string,
  ) {
    return this.habitacionService.findByHospitalAndMinimum(Number(principalId), Number(minimum));
  }

  @Get("resumen/hospital")
  countByHospital() {
    return this.habitacionService.countByHospital();
  }

  @Post()
  create(@Body() datos: Partial<Habitacion>) {
    return this.habitacionService.create(datos);
  }

  @Get(":id")
  getHabitacionById(@Param("id") id: string) {
    return this.habitacionService.getHabitacionById(Number(id));
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.habitacionService.delete(Number(id));
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() datos: Partial<Habitacion>) {
    return this.habitacionService.update(Number(id), datos);
  }

  @Patch(":id/hospital/:hospitalId")
  updateHospital(
    @Param("id") id: string,
    @Param("hospitalId") hospitalId: string,
  ) {
    return this.habitacionService.updateHospital(Number(id), Number(hospitalId));
  }
}