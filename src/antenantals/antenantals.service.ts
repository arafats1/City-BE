import { Injectable } from '@nestjs/common';
import { CreateAntenantalDto } from './dto/create-antenantal.dto';
import { UpdateAntenantalDto } from './dto/update-antenantal.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AntenantalsService {
  constructor(private readonly prisma: PrismaService) {}
  async createAntenantal( patientId: string, antenantalData: any) {
    const { pregnancyStatus, expectedDateOfDelivery, routineVisitDate, prescriptions,drugNotes , bloodGroup, weight, nextOfKin, nextOfKinContact, reviewedBy} = antenantalData;
    return this.prisma.antenantal.create({
      data: {
        pregnancyStatus,
        expectedDateOfDelivery,
        routineVisitDate,
        prescriptions,
        drugNotes,
        bloodGroup,
        weight,
        nextOfKin,
        nextOfKinContact,
        reviewedBy,
        patient: {
          connect: { id: patientId },
        },
      },
    });
  }

  findAll() {
    return this.prisma.antenantal.findMany();
  }

  findOne(id: string) {
    return this .prisma.antenantal.findUnique({ where: { id } });
  }

  findOneUserName(reviewedBy: string) {
    return this.prisma.antenantal.findMany({ where: { reviewedBy }});
  }

  remove(id: string) {
    return this.prisma.antenantal.delete({ where: { id } });
  }
}
