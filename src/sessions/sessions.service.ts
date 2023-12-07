import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}
  async createSession(signUpId: string, sessionData: any) {
    const { startTime, endTime, deviceInfo } = sessionData;
    
    // Convert the string representations of start time and end time into Date objects
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
  
    // Calculate the duration in milliseconds
    const durationInMs = endDate.getTime() - startDate.getTime();
  
    // Convert the duration to a formatted string representation (e.g., "2 hours 30 minutes")
    const formattedDuration = formatDuration(durationInMs);
  
    return this.prisma.session.create({
      data: {
        startTime,
        endTime,
        duration: formattedDuration,
        deviceInfo,
        signUp: {
          connect: { id: signUpId },
        },
      },
    });
  }
  
  findUserSessions(signUpId: string) {
    return this.prisma.session.findMany({ where: { signUpId } });
  }

  findOne(id: string) {
    return this.prisma.session.findUnique({ where: { id } });
  }

  remove(id: string) {
    return this.prisma.session.delete({ where: { id } });
  }
}

// Helper function to format the duration
function formatDuration(durationInMs) {
  const hours = Math.floor(durationInMs / 3600000);
  const minutes = Math.floor((durationInMs % 3600000) / 60000);
  
  return `${hours} hours ${minutes} minutes`;
}
