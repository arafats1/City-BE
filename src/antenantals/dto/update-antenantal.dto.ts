import { PartialType } from '@nestjs/swagger';
import { CreateAntenantalDto } from './create-antenantal.dto';

export class UpdateAntenantalDto extends PartialType(CreateAntenantalDto) {}
