import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

async function main() {

    // const patient = await prisma.patient.create({
    //     data: {
    //         firstName:"Jane",
    //         lastName:"Doe",
    //         sex:"Female",
    //         ageGroup:"Adult",
    //         phoneNumber:"0784528444",
    //         weight: 60,
    //         height: 170,
    //         district: "Kampala",
    //         country: "Uganda",
    //         primaryLanguage: "English",
    //         simprintsGui: "123456789",
    //         userId: "8dbccc53-a62a-4796-b848-43abfba4754c"
    //     }
    // })
//     const signUp = await prisma.signUp.create({
//         data: {
//             firstName:"Jane",
//             lastName:"Doe",
//             email:"jane@gmail.com",
//             phone:"0784528444",
//             password:"password"
        
//     }
//     })
  
    main()
.catch((e) => {
  console.error(e);
  process.exit(1);
})
.finally(async () => {
  // close Prisma Client at the end
  await prisma.$disconnect();
  

});
}