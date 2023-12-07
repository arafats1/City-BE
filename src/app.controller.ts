import { Controller, Request, Post, UseGuards, Get, Body, ValidationPipe, ClassSerializerInterceptor, UseInterceptors, UploadedFile, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { Delete, Param } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

import * as twilio from 'twilio';



@ApiTags('auth')
@Controller('auth')
export class AppController {
  jwtService: any;
  getHello: any;
  constructor(private authService: AuthService,
    private readonly prisma: PrismaService,
    private appService: AppService
  ) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Logs user into system' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'username@gmail.com',
          description: 'Phone of the user',
        },
        password: {
          type: 'string',
          example: 'User@1232450',
          description: 'Password of the user',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successful',
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async login(@Body('email') email: string, @Body('password') password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (user) {
      const { accessToken, refreshToken, id} = await this.authService.login(user);
      const message = 'Login successful';
      return { message, accessToken, refreshToken, id};
    } else {
      // Handle authentication failure
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Post('signup')
  async signUp(
    @Body('role') role: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    try {
      const user = await this.prisma.createSignUp({
        role,
        email,
        password,
      });
  
      const { accessToken, refreshToken } = await this.authService.login(user);
      const message = 'Signup successful';
  
      return { message, accessToken, refreshToken };
    } catch (error) {
      // Check if the error is due to an existing email
      if (error.message === 'Email already exists') {
        return { error: 'Email already exists' };
      }
  
      // Handle other errors here
      return { error: 'Failed to sign up' };
    }
  }
  

  @Get('signup/:phone')
  async findOneByPhone(@Param('phone') phone: string): Promise<any> {
    const user = await this.prisma.findOneByEmail(phone);
    if (user) {
      return user;
    } else {
      throw new NotFoundException('User not found');
    }
  }

 

  @Get('signup')
  async findAll(): Promise<any> {
    const users = await this.prisma.findAll();
    return users;
  }

  @Delete('signup/:id')
  async deleteUser(@Param('id') id: string): Promise<any> {
    const user = await this.prisma.deleteUser(id );
    if (user) {
      return { message: 'User deleted successfully' };
    } else {
      throw new NotFoundException('User not found');
    }
  }

  @Post('forgot-password')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phone: {
          type: 'string',
          example: '+256784528445',
          description: 'Phone of the user',
        },
      },
    },
  })
  async forgotPassword(@Body() { email }: { email: string }) {
    try {
      // Check if the phone number exists in your user database
      const user = await this.authService.findUserByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Generate a one-time token for password reset
      const resetToken = await this.authService.generateResetToken(user);

      // Send the reset token to the user's phone number via SMS
      await this.sendResetTokenViaSMS(user.email, resetToken);

      // Return a success response
      return { message: 'Password reset initiated successfully. Please check your SMS for instructions.' };
    } catch (error) {
      // Handle errors gracefully and return an appropriate response
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new BadRequestException('Failed to initiate password reset');
      }
    }
  }

  // Implement a function to send the reset token via SMS
  async sendResetTokenViaSMS(phone: string, resetToken: number) {
    try {
      const twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
  
      // Send the reset token via SMS
      await twilioClient.messages.create({
        body: `Your password reset token is: ${resetToken}`,
        from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
        to: phone, // User's phone number
      });
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw new BadRequestException('Failed to send SMS');
    }
  }

  @Post('reset-password')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        resetToken: {
          type: 'string',
          example: '765378',
          description: 'Phone of the user',
        },
        newPassword: {
          type: 'string',
          example: 'User@1232450',
          description: 'Password of the user',
        },
      },
    },
  })
async resetPassword(
  @Body('resetToken') resetToken: string,
  @Body('newPassword') newPassword: string,
): Promise<any> {
  try {
    // Verify if the reset token is valid (e.g., check if it exists in the database)
    const user = await this.authService.findUserByResetToken(resetToken);

    if (!user) {
      throw new NotFoundException('Invalid reset token');
    }

    // Reset the user's password
    await this.authService.resetPassword(user, newPassword);

    // Optionally, you can delete or mark the reset token as used

    return { message: 'Password reset successfully' };
  } catch (error) {
    // Handle errors gracefully and return an appropriate response
    if (error instanceof NotFoundException) {
      throw error;
    } else {
      throw new BadRequestException('Failed to reset password');
    }
  }
}



  
}
