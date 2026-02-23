import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('notifications')
@UseGuards(FirebaseAuthGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ) {}

  // List notifications
  @Get()
  async getNotifications(@Req() req) {
    const user = await this.usersService.findOrCreate(req.user);
    return this.notificationsService.findAll(user.id);
  }

  // Mark as read
  @Patch(':id/read')
  async markAsRead(@Req() req, @Param('id') id: string) {
    const user = await this.usersService.findOrCreate(req.user);
    return this.notificationsService.markAsRead(user.id, id);
  }

  // Delete notification
  @Delete(':id')
  async delete(@Req() req, @Param('id') id: string) {
    const user = await this.usersService.findOrCreate(req.user);
    return this.notificationsService.delete(user.id, id);
  }
}
