import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VaccinationsService } from './vaccinations.service';
import { CreateVaccinationDto } from './dto/create-vaccination.dto';
import { UpdateVaccinationDto } from './dto/update-vaccination.dto';
import { ApiTags, ApiOperation, ApiBody} from '@nestjs/swagger';

@Controller('')
@ApiTags('vaccinations')
export class VaccinationsController {
  constructor(private readonly vaccinationsService: VaccinationsService) {}

  @Post(':patientId/vaccinations')
  @ApiOperation({ summary: 'Create vaccination' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        vaccineName : {
          type: 'string',
          example: 'Pfizer',
        },
        dose : {
          type: 'string',
          example: '1',
        },
        units : {
          type: 'string',
          example: '100 mls',
        },
        dateOfVaccination: {
          type: 'string',
          example: '2021-08-01',
          description: 'Date of vaccination',
        },
        dateForNextDose: {
          type: 'string',
          example: '2021-08-01',
          description: 'Date for next dose',
        },
        siteAdministered : {
          type: 'string',
          example: 'Kampala',
        },
        facility : {
          type: 'string',
          example: 'Buikwe Health Center',
        },
      }
    }
  })
  async createVaccination(@Param('patientId') patientId: string, @Body() vaccinationData: any) {
    const vaccination = await this.vaccinationsService.createVaccination(patientId, vaccinationData);
    return vaccination;
  }

  @Get(':patientId/vaccinations')
  async findAllByPatientId(@Param('patientId') patientId: string) {
    const vaccinations = await this.vaccinationsService.findAllByPatientId(patientId);
    return vaccinations;
  }

  @Get('vaccinations/all') 
  findAll() {
    return this.vaccinationsService.findAll();
  }

  @Get('vaccinations/:vaccinatedBy')
  findOneUserName(@Param('vaccinatedBy') vaccinatedBy: string) {
    return this.vaccinationsService.findOneUserName(vaccinatedBy);
  }

  

  @Patch('vaccinations/:id')
  update(@Param('id') id: string, @Body() updateVaccinationDto: UpdateVaccinationDto) {
    return this.vaccinationsService.update(id, updateVaccinationDto);
  }

  @Delete('vaccinations/:id')
  remove(@Param('id') id: string) {
    return this.vaccinationsService.remove(id);
  }
}