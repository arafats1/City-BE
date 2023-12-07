import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AntenantalsService } from './antenantals.service';
import { CreateAntenantalDto } from './dto/create-antenantal.dto';
import { UpdateAntenantalDto } from './dto/update-antenantal.dto';
import { ApiTags, ApiOperation, ApiBody} from '@nestjs/swagger';


@Controller('')
@ApiTags('antenantals')
export class AntenantalsController {
  constructor(private readonly antenantalsService: AntenantalsService) {}

  @Post(':patientId/antenantals')
  @ApiOperation({ summary: 'Create Antenantal' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        pregnancyStatus : {
          type: 'string',
          example: 'Pregnant',
        },
        expectedDateOfDelivery: {
          type: 'string',
          example: '2021-08-01',
          description: 'Expected date of delivery',
        },
        routineVisitDate : {
          type: 'string',
          example: '2021-08-01',
          description: 'Routine visit date',
        },
        prescriptions : {
          type: 'string',
          example: 'Paracetamol',
        },
        drugNotes : {
          type: 'string',
          example: 'Received 2 tablets of Paracetamol, did not receive tetanus toxoid',
        },
        bloodGroup : {
          type: 'string',
          example: 'O+',
        },
        weight : {
          type: 'string',
          example: '60kg',
        },
        nextOfKin : {
          type: 'string',
          example: 'John Doe',
        },
        nextOfKinContact : {  
          type: 'string',
          example: '08012345678',
        },

      }
    }
  })
  async createAntenantal(@Param('patientId') patientId: string, @Body() antenantalData: any) {
    const antenantal = await this.antenantalsService.createAntenantal(patientId, antenantalData);
    return antenantal;
  }

  @Get('antenantals/all')
  findAll() {
    return this.antenantalsService.findAll();
  }

  @Get('antenantals/:reviewedBy')
  findOneUserName(@Param('reviewedBy') reviewedBy: string) {
    return this.antenantalsService.findOneUserName(reviewedBy);
  }

  @Get('antenantals/:id')
  findOne(@Param('id') id: string) {
    return this.antenantalsService.findOne(id);
  }

 

  @Delete('antenantals/:id')
  remove(@Param('id') id: string) {
    return this.antenantalsService.remove(id);
  }
}