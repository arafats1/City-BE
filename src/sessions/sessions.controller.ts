import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { ApiTags, ApiOperation, ApiBody} from '@nestjs/swagger';

@Controller('')
@ApiTags('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post(':signUpId/sessions')
  @ApiOperation({ summary: 'Create session' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        startTime : {
          type: 'string',
          example: '2023-08-01T20:30:00.000Z',
          description: 'Start time',
        },
        endTime : {
          type: 'string',
          example: '2023-08-01T21:34:00.000Z',
          description: 'End time',
        },
        deviceInfo : {
          type: 'string',
          example: 'Google pixel 4a',
        },
      }
    }
  })
  async createSession(@Param('signUpId') signUpId: string, @Body() sessionData: any) {
    const session = await this.sessionsService.createSession(signUpId, sessionData);
    return session;
  }
  

  @Get(':signUpId/sessions')
  @ApiOperation({ summary: 'Get all sessions' })
  async findUserSessions(@Param('signUpId') signUpId: string) {
    const sessions = await this.sessionsService.findUserSessions(signUpId);
    return sessions;
  }
  
  @Delete(':sessions/id')
  @ApiOperation({ summary: 'Delete session' })
  remove(@Param('id') id: string) {
    return this.sessionsService.remove(id);
  }
}
