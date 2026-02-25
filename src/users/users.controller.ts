import { Body, Controller, Get, Param, Post, Req, UseGuards, Patch, ForbiddenException } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
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

  @Get('doctors/:id')
  async getDoctorById(@Param('id') id:string) {
    return this.usersService.getDoctorById(id);
  }

  // Create appointment
  @UseGuards(FirebaseAuthGuard)
  @Post('appointments')
  async createAppointment(
    @Req() req,
    @Body() body: { doctorId: string; date: string; time: string,paymentId?: string },
  ) {
    const user = await this.usersService.findOrCreate(req.user);

   
    const doctor = await this.prisma.doctorProfile.findUnique({
      where: { id: body.doctorId },
    });
    if (!doctor) throw new Error('Doctor not found');

    return this.prisma.appointment.create({
      data: {
        userId: user.id,
        doctorId: body.doctorId,
        date: new Date(body.date),
        time: body.time,
        status: body.paymentId ? 'CONFIRMED' : 'PENDING',
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

  
  @UseGuards(FirebaseAuthGuard)
  @Patch('appointments/:id/confirm')
  async confirmAppointment(@Req() req, @Param('id') id: string) {
    const user = await this.usersService.findOrCreate(req.user);

    const appt = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: { include: { user: true } },
      },
    });

    if (!appt || appt.userId !== user.id) {
      throw new ForbiddenException('Not your appointment');
    }

    const updated = await this.prisma.appointment.update({
      where: { id },
      data: { status: 'CONFIRMED' },
    });

    //  Auto notify user
    await this.notificationsService.create(
      user.id,
      'Appointment confirmed',
      `Your appointment with Dr. ${appt.doctor.user.fullName} has been confirmed.`
    );

    return updated;
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch('me')
  async updateMe(@Req() req, @Body() body: {
    fullName?: string;
    email?: string;
    phone?: string;
  }) {
    const user = await this.usersService.findOrCreate(req.user);

    return this.prisma.user.update({
      where: { id: user.id },
      data: body,
    });
  }

}

