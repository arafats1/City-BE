import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import twilio from 'twilio';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.findOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user; 
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
    return {
      accessToken,
      refreshToken,
      id: user.id
    };
  }

  async findUserByEmail(email: string) {
    const user = await this.prisma.findOneByEmail(email);
    return user; // Return the user object if found or null if not found
  }

  async generateResetToken(user: any) {
    // Generate a one-time reset token
    const resetToken = await this.generateRandomToken(user);
  
    // Store the token in your database with an expiration time (e.g., 24 hours)
    await this.prisma.storeResetToken(user.id, resetToken.toString(), new Date(Date.now() + 24 * 60 * 60 * 1000));
  
    return resetToken;
  }
  
  async generateRandomToken(user: any, length: number = 6): Promise<number> {
    // Generate a random number with the specified number of digits
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    const token = Math.floor(Math.random() * (max - min + 1)) + min;
  
    return token;
  }

  async sendResetTokenViaSMS(phone: string, resetToken: string) {
    try {
      const twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      // Send the reset token via SMS
      await twilioClient.messages.create({
        body: `Your password reset token is: ${resetToken}`,
        from: process.env.TWILIO_PHONE_NUMBER, 
        to: phone, // User's phone number
      });
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw new BadRequestException('Failed to send SMS');
    }
  }

  async findUserByResetToken(resetToken: string) {
   
  
    const user = await this.prisma.findOneByResetToken(resetToken); 
  
    return user; 
  }
  
  
  async resetPassword(user: any, newPassword: string) {
   
  
    await this.prisma.updateUserPassword(user.id,newPassword ); 
  }
 
}
