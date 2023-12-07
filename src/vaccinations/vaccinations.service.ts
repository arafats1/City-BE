import { Injectable } from '@nestjs/common';
import { CreateVaccinationDto } from './dto/create-vaccination.dto';
import { UpdateVaccinationDto } from './dto/update-vaccination.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class VaccinationsService {
  constructor(private readonly prisma: PrismaService) {}
  async createVaccination(patientId: string, vaccinationData: any) {
    const { dateOfVaccination, dateForNextDose, vaccineName,dose, units, siteAdministered, facility, vaccinatedBy } = vaccinationData;

    return this.prisma.vaccination.create({
      data: {
        dateOfVaccination,
        dateForNextDose,
        vaccineName,
        dose,
        units,
        siteAdministered,
        facility,
        patient: {
          connect: { id: patientId },
        },
        vaccinatedBy
      }
    });
  }



  findAllByPatientId(patientId: string) {
    return this.prisma.vaccination.findMany({ where: { patientId } });
  }

  findAll() {
    return this.prisma.vaccination.findMany();
  }

  findOneUserName(vaccinatedBy: string) {
    return this.prisma.vaccination.findMany({ where: { vaccinatedBy }});
  }

 


  findOne(id: number) {
    return `This action returns a #${id} vaccination`;
  }

  update(id: string, updateVaccinationDto: UpdateVaccinationDto) {
    return this.prisma.vaccination.update({
      where: { id },
      data: updateVaccinationDto,
    });
  }

  remove(id: string) {
    return this.prisma.vaccination.delete({ where: { id } });
  }
}
