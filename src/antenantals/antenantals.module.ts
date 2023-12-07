import { Module } from '@nestjs/common';
import { AntenantalsService } from './antenantals.service';
import { AntenantalsController } from './antenantals.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AntenantalsController],
  providers: [AntenantalsService],
  imports: [PrismaModule]
})
export class AntenantalsModule {}
