import { Injectable } from "@nestjs/common";
// Make sure the path below matches the actual location of prisma.service.ts
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOrCreate(firebaseUser: any) {
    return this.prisma.user.upsert({
      where: { firebaseId: firebaseUser.uid },
      update: {
        lastSeenAt: new Date(),
      },
      create: {
        firebaseId: firebaseUser.uid,
        email: firebaseUser.email,
        fullName: firebaseUser.name ?? 'New User',
      },
    });
  }
}
