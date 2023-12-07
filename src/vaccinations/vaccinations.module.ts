import { Module } from '@nestjs/common';
import { VaccinationsService } from './vaccinations.service';
import { VaccinationsController } from './vaccinations.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [VaccinationsController],
  providers: [VaccinationsService],
  imports: [PrismaModule]
})
export class VaccinationsModule {}
