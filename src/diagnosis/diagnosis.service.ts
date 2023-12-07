import { Injectable } from '@nestjs/common';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import { UpdateDiagnosisDto } from './dto/update-diagnosis.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DiagnosisService {
  constructor(private readonly prisma: PrismaService) {}
  async createDiagnosis( patientId: string, diagnosisData: any) {
    const { condition, dateOfDiagnosis, impression, drugsPrescribed, dosage, frequency, duration, followUpDate, isPregnant, labTests, diagnosedBy} = diagnosisData;
    return this.prisma.diagnosis.create({
      data: {
        condition,
        dateOfDiagnosis,
        impression,
        drugsPrescribed,
        dosage,
        frequency,
        duration,
        followUpDate,
        isPregnant,
        labTests,
        diagnosedBy,
        patient: {
          connect: { id: patientId },
        },
      },
    });
  }

  findAll() {
    return this.prisma.diagnosis.findMany();
  }

  findAllByPatientId(patientId: string) {
    return this.prisma.diagnosis.findMany({ where: { patientId } });
  }

  findOneUserName(diagnosedBy: string) {
    return this.prisma.diagnosis.findMany({ where: { diagnosedBy }});
  }

  findOne(id: string) {
    return this.prisma.diagnosis.findUnique({ where: { id } });
  }

  remove(id: string) {
    return this.prisma.diagnosis.delete({ where: { id } });
  }
}
