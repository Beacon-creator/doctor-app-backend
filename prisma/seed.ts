import { PrismaClient, Role } from "@prisma/client";
import crypto from "crypto";
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';


const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});


async function main() {
  console.log(" Seeding database...");
  console.log("DB URL", process.env.DATABASE_URL);

  
  const doctors = [
    {
      fullName: "Dr. Aisha Bello",
      email: "aisha.bello@clinic.com",
      specialty: "Cardiology",
      about: "Senior cardiologist with 10+ years experience.",
      price: 15000,
      pictureUrl: "https://i.pravatar.cc/300?img=47",
    },
    {
      fullName: "Dr. Michael Okafor",
      email: "michael.okafor@clinic.com",
      specialty: "Neurology",
      about: "Expert in brain and nervous system disorders.",
      price: 20000,
      pictureUrl: "https://i.pravatar.cc/300?img=12",
    },
  ];

  for (const doc of doctors) {
    const user = await prisma.user.create({
      data: {
        firebaseId: crypto.randomUUID(),
        fullName: doc.fullName,
        email: doc.email,
        role: Role.DOCTOR,
      },
    });

    await prisma.doctorProfile.create({
      data: {
        userId: user.id,
        specialty: doc.specialty,
        about: doc.about,
        price: doc.price,
        rating: 4.5,
        totalReviews: 10,
        pictureUrl: doc.pictureUrl,
      },
    });
  }

  console.log("✅ Seed complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
