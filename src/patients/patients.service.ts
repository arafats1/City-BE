import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AES, enc } from 'crypto-js';
import { env } from 'process';

@Injectable()
export class PatientsService {
  private readonly encryptionKey = env.ENCRYPTION_KEY; 
  private readonly algorithm = 'aes-256-cbc';

  constructor(private readonly prisma: PrismaService) {}

  private encrypt(data: string): string {
    const encrypted = AES.encrypt(data, this.encryptionKey).toString();
    return encrypted;
  }

  private decrypt(encryptedData: string): string {
    const decrypted = AES.decrypt(encryptedData, this.encryptionKey).toString(enc.Utf8);
    return decrypted;
  }
  
  private decryptPatient(patient: any): any {
    return {
      ...patient,
      firstName: this.decrypt(patient.firstName),
      lastName: this.decrypt(patient.lastName),
      phoneNumber: this.decrypt(patient.phoneNumber),
    };
  }

  async createPatient(signUpId: string, patientData: any) {
    const { firstName, sex, ageGroup, phoneNumber, lastName, weight, height, district, country, primaryLanguage, simprintsGui} = patientData;

     // Encrypt the first and last names before storing in the database
     const encryptedFirstName = this.encrypt(firstName);
     const encryptedLastName = this.encrypt(lastName);
     const encryptedPhoneNumber = this.encrypt(phoneNumber);

     const createdPatient = await this.prisma.patient.create({
      data: {
        firstName: encryptedFirstName,
        lastName: encryptedLastName,
        sex,
        ageGroup,
        phoneNumber: encryptedPhoneNumber,
        weight,
        height,
        district,
        country,
        primaryLanguage,
        simprintsGui,
        signUp: {
          connect: { id: signUpId },
        },
      },
    });

    return this.decryptPatient(createdPatient);
  }


  async findAll() {
    const patients = await this.prisma.patient.findMany({ include: { vaccinations: {select: {dateOfVaccination: true, dateForNextDose: true, vaccineName: true, units: true, dose:true, siteAdministered: true, facility: true, vaccinatedBy:true}}, diagnoses: {select: {condition:true, dateOfDiagnosis: true, impression: true, drugsPrescribed:true, dosage:true, frequency:true, duration:true, labTests:true, followUpDate:true, isPregnant:true, diagnosedBy:true}}, antenantals: {select: {pregnancyStatus:true, expectedDateOfDelivery: true, routineVisitDate: true, prescriptions:true, drugNotes:true ,bloodGroup:true, weight:true, nextOfKin:true, nextOfKinContact:true, reviewedBy:true}}}});

    return patients.map((patient) => this.decryptPatient(patient));
  }

  async findOne(id: string) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    return this.decryptPatient(patient);
  }

  async findOneBySimprintsGui(simprintsGui: string) {
    const patient = await this.prisma.patient.findFirst({ where: { simprintsGui }, include: { vaccinations: {select: {dateOfVaccination: true, dateForNextDose: true, vaccineName: true, units: true, dose:true, siteAdministered: true, facility: true, vaccinatedBy:true}}, diagnoses: {select: {condition:true, dateOfDiagnosis: true, impression: true, drugsPrescribed:true, dosage:true, frequency:true, duration:true, labTests:true, followUpDate:true, isPregnant:true, diagnosedBy:true}}, antenantals: {select: {pregnancyStatus:true, expectedDateOfDelivery: true, routineVisitDate: true, prescriptions:true, drugNotes:true ,bloodGroup:true, weight:true, nextOfKin:true, nextOfKinContact:true, reviewedBy:true}}}});
    return this.decryptPatient(patient);
  }

  async findAllBySignUpId(signUpId: string) {
    const patients = await this.prisma.patient.findMany({ where: { signUpId }, include: { vaccinations: {select: {dateOfVaccination: true, dateForNextDose: true, vaccineName: true, units: true, siteAdministered: true, facility: true, vaccinatedBy:true}}, diagnoses: {select: {condition:true, dateOfDiagnosis: true, impression: true, drugsPrescribed:true, dosage:true, frequency:true, duration:true, labTests:true, followUpDate:true, isPregnant:true, diagnosedBy:true}}, antenantals: {select: {pregnancyStatus:true, expectedDateOfDelivery: true, routineVisitDate: true, prescriptions:true, drugNotes:true, bloodGroup:true, weight:true, nextOfKin:true, nextOfKinContact:true, reviewedBy:true}}}});
    return patients.map((patient) => this.decryptPatient(patient));
  }
  
  remove(id: string) {
    return this.prisma.patient.delete({ where: { id } });
  }


}
