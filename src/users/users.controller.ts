import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
  ) {}

  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  async me(@Req() req) {
  return this.usersService.findOrCreate(req.user);
}


@Get('doctors')
async getDoctors() {
  return this.prisma.doctorProfile.findMany({
    include: {
      user: {
        select: {
          fullName: true,
          avatarUrl: true,
        },
      },
    },
  });
}


@UseGuards(FirebaseAuthGuard)
@Post('appointments')
async createAppointment(
  @Req() req,
  @Body() body: { doctorId: string; date: string; paymentId: string },
) {
  return this.prisma.appointment.create({
    data: {
      userId: req.user.uid,
      doctorId: body.doctorId,
      date: new Date(body.date),
      status: 'CONFIRMED',
      payment: {
        connect: { id: body.paymentId },
      },
    },
  });
}


@UseGuards(FirebaseAuthGuard)
@Get('appointments')
async myAppointments(@Req() req) {
  return this.prisma.appointment.findMany({
    where: { userId: req.user.uid },
    orderBy: { date: 'asc' },
  });
  }
}
