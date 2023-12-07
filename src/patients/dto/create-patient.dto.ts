import { ApiProperty } from "@nestjs/swagger";
export class CreatePatientDto {
    @ApiProperty()
    firstName: string;
    @ApiProperty()
    lastName: string;
    @ApiProperty()
    sex: string;
    @ApiProperty()
    ageGroup: string;
    @ApiProperty()
    phoneNumber: string;
    @ApiProperty()
    weight: number;
    @ApiProperty()
    height: number;
    @ApiProperty()
    district: string;
    @ApiProperty()
    country: string;
    @ApiProperty()
    dateOfBirth: string;
    @ApiProperty()
    primaryLanguage: string;
    @ApiProperty()
    simprintsGui: string;
    @ApiProperty()
    userId: string;
}
