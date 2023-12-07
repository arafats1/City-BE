import { Injectable } from '@nestjs/common';
import { PrismaClient, SignUp } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';
import { AES, enc } from 'crypto-js';
import { env } from 'process';


@Injectable()
export class PrismaService {
  private prisma: PrismaClient;
  signUp: typeof PrismaClient.prototype.signUp;

 

  private readonly encryptionKey = env.ENCRYPTION_KEY; 
  private readonly algorithm = 'aes-256-cbc';
  

  constructor() {
    this.prisma = new PrismaClient();
    this.signUp = this.prisma.signUp;
  
    
  }

  private decrypt(encryptedData: string): string {
    const decrypted = AES.decrypt(encryptedData, this.encryptionKey).toString(enc.Utf8);
    return decrypted;
  }

  // private decryptPatient(patient: Patient): Patient {
  //   return {
  //     ...patient,
  //     firstName: this.decrypt(patient.firstName),
  //     lastName: this.decrypt(patient.lastName),
  //     phoneNumber: this.decrypt(patient.phoneNumber),
  //   };
  // }

  async createSignUp(data: {
    email: string;
    password: string;
    role: string;
  }): Promise<SignUp> {
    // Check if the email already exists
    const existingUser = await this.prisma.signUp.findUnique({
      where: { email: data.email },
    });
  
    if (existingUser) {
      throw new Error('Email already exists');
    }
  
    // If the email doesn't exist, proceed with user creation
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newData = { ...data, password: hashedPassword };
  
    try {
      const newUser = await this.prisma.signUp.create({ data: newData });
      return newUser;
    } catch (error) {
      // Handle any other database-related errors here
      throw new Error('Failed to create user');
    }
  }
  
  

  async findOneByEmail(email: string) {
    const signUp = await this.prisma.signUp.findUnique({ where: { email } });

    // if (signUp && signUp.patients) {
    //   signUp.patients = signUp.patients.map(patient => this.decryptPatient(patient));
    // }

    return signUp;
  }

  async findAll(): Promise<SignUp[]> {
    const signUps = await this.prisma.signUp.findMany();

    // if (signUps) {
    //   signUps.forEach(signUp => {
    //     if (signUp.patients) {
    //       signUp.patients = signUp.patients.map(patient => this.decryptPatient(patient));
    //     }
    //   });
    // }

    return signUps;
  }
  
  
  async deleteUser(id: string): Promise<any> {
    const user = await this.prisma.signUp.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // const patients = user.patients;
    // if (patients && patients.length > 0) {
    //   const patientIds = patients.map(patient => patient.id);
    //   await this.prisma.patient.deleteMany({ where: { id: { in: patientIds } } });
    // }
  
    const deletedUser = await this.prisma.signUp.delete({ where: { id } });
    if (!deletedUser) {
      throw new NotFoundException('Failed to delete user');
    }
  
    return { message: 'User deleted successfully' };
  }

  async storeResetToken(userId: string, token: string, expiresAt: Date): Promise<any> {
    // Make sure you use the correct Prisma-generated types
    const resetToken = await this.prisma.resetToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });

    return resetToken;
  }

  async findOneByResetToken(resetToken: string) {
    // Implement logic to find the user by the reset token in your database
    // You should check if the token exists and if it's still valid (e.g., not expired)
  
    const resetTokenEntry = await this.prisma.resetToken.findUnique({
      where: {
        token: resetToken,
      },
      include: {
        user: {
          // include: {
          //   sessions: true,
          // },
        },
      },
    });
  
    if (!resetTokenEntry) {
      // Token not found
      return null;
    }
  
    const user = resetTokenEntry.user;
  
    return user; 
  }
  
  async updateUserPassword(id: string, newPassword: string): Promise<void> {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    // Log the user's information before the update
    const userBeforeUpdate = await this.prisma.signUp.findUnique({
        where: { id },
    });

    console.log('User Before Update:', userBeforeUpdate);

    // Update the user's password in the database based on phone number
    await this.prisma.signUp.updateMany({
        where: { id },
        data: { password: hashedPassword },
    });

    // Log the user's information after the update
    const userAfterUpdate = await this.prisma.signUp.findUnique({
        where: { id },
    });

    console.log('User After Update:', userAfterUpdate);
}
 
}