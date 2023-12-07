import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { APP_PIPE } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';



@Module({
  imports: [PrismaModule,AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService,{
    provide: APP_PIPE,
    useClass: ValidationPipe,
  }],
})
export class AppModule {}
