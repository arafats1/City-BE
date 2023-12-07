import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import { UpdateDiagnosisDto } from './dto/update-diagnosis.dto';
import { ApiTags, ApiOperation, ApiBody} from '@nestjs/swagger';

@Controller('')
@ApiTags('diagnosis')
export class DiagnosisController {
  constructor(private readonly diagnosisService: DiagnosisService) {}

  @Post(':patientId/diagnosis')
  @ApiOperation({ summary: 'Create diagnosis' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        condition : {
          type: 'string',
          example: 'Malaria',
        },
        dateOfDiagnosis: {
          type: 'string',
          example: '2021-08-01',
          description: 'Date of diagnosis',
        },
        impression : {
          type: 'string',
          example: 'Malaria',
        },
        drugsPrescribed : {
          type: 'string',
          example: 'Paracetamol',
        },
        dosage : {
          type: 'string',
          example: '2 tablets',
        },
        frequency : {
          type: 'string',
          example: '3 times a day',
        },
        duration : {
          type: 'string',
          example: '3 days',
        },
        labTests : {
          type: 'string',
          example: 'Blood test',
        },
        followUpDate : {
          type: 'string',
          example: '2021-08-01',
          description: 'Follow up date',
        },
        isPregnant : {
          type: 'string',
          example: 'Yes',
        },
      }
    }
  })
  async createDiagnosis(@Param('patientId') patientId: string, @Body() diagnosisData: any) {
    const diagnosis = await this.diagnosisService.createDiagnosis(patientId, diagnosisData);
    return diagnosis;
  }

@Get(':patientId/diagnosis')
  async findAllByPatientId(@Param('patientId') patientId: string) {
    const diagnosis = await this.diagnosisService.findAllByPatientId(patientId);
    return diagnosis;
  }

  @Get('diagnosis/all')
  findAll() {
    return this.diagnosisService.findAll();
  }

  @Get('diagnosis/:diagnosedBy')
  findOneUserName(@Param('diagnosedBy') diagnosedBy: string) {
    return this.diagnosisService.findOneUserName(diagnosedBy);
  }

}