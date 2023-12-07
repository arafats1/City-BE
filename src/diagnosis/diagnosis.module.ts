import { Module } from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { DiagnosisController } from './diagnosis.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [DiagnosisController],
  providers: [DiagnosisService],
  imports: [PrismaModule],
})
export class DiagnosisModule {}
