import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { ApiTags, ApiOperation, ApiBody} from '@nestjs/swagger';

@Controller('')
@ApiTags('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post(':signUpId/patients')
  @ApiOperation({ summary: 'Create patient' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          example: 'John',
          description: 'First name of the patient',
        },
        lastName: {
          type: 'string',
          example: 'Doe',
          description: 'Last name of the patient',
        },
        sex : {
          type: 'string',
          example: 'Female',
        },
        ageGroup : {
          type: 'string',
          example: '20-25',
        },
        phoneNumber : {
          type: 'string',
          example: '0784528444',
        },
        weight : {
          type: 'string',
          example: 60,
        },
        height : {
          type: 'string',
          example: '5.5'
        },
        district : {
          type: 'string',
          example: 'Kampala',
        },
        country : {
          type: 'string',
          example: 'Uganda',
        },
        primaryLanguage : {
          type: 'string',
          example: 'English',
        },
        simprintsGui : {
          type: 'string',
          example: '123456789',
        },

      },
    },
  })
  async createPatient(@Param('signUpId') signUpId: string, @Body() patientData: any) {
    const patient = await this.patientsService.createPatient(signUpId, patientData);
    return patient;
  }

  @Get('patients')
  findAll() {
    return this.patientsService.findAll();
  }

  @Get(':signUpId/patients')
  async findAllBySignUpId(@Param('signUpId') signUpId: string) {
    const patients = await this.patientsService.findAllBySignUpId(signUpId);
    if (!patients) {
      throw new NotFoundException('Patients not found');
    }
    return patients;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Delete('patients/:id')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(id);
  }

  

}
