import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail } from 'class-validator';
export class AuthDto {
    @ApiProperty()
    phone: string;
    @ApiProperty()
    password: string;
}