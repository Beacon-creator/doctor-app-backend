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

  // Get current user profile
  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  async me(@Req() req) {
    return this.usersService.findOrCreate(req.user);
  }

  // List all doctors
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

  // Create appointment
  @UseGuards(FirebaseAuthGuard)
  @Post('appointments')
  async createAppointment(
    @Req() req,
    @Body() body: { doctorId: string; date: string; paymentId?: string },
  ) {
    const user = await this.usersService.findOrCreate(req.user);

    // Optional: check doctor exists
    const doctor = await this.prisma.doctorProfile.findUnique({
      where: { id: body.doctorId },
    });
    if (!doctor) throw new Error('Doctor not found');

    return this.prisma.appointment.create({
      data: {
        userId: user.id,
        doctorId: body.doctorId,
        date: new Date(body.date),
        status: 'PENDING', // start as pending, confirm after payment
        ...(body.paymentId && {
          payment: { connect: { id: body.paymentId } },
        }),
      },
    });
  }

  // Get user's appointments
  @UseGuards(FirebaseAuthGuard)
  @Get('appointments')
  async myAppointments(@Req() req) {
    const user = await this.usersService.findOrCreate(req.user);

    return this.prisma.appointment.findMany({
      where: { userId: user.id },
      orderBy: { date: 'asc' },
      include: {
        doctor: {
          include: { user: { select: { fullName: true, avatarUrl: true } } },
        },
        payment: true,
      },
    });
  }
}
