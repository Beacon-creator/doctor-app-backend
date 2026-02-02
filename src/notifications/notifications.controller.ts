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

@Controller('notifications')
@UseGuards(FirebaseAuthGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  // List notifications
  @Get()
  async getNotifications(@Req() req) {
    return this.notificationsService.findAll(req.user.uid);
  }

  // Mark as read
  @Patch(':id/read')
  async markAsRead(
    @Req() req,
    @Param('id') id: string,
  ) {
    return this.notificationsService.markAsRead(
      req.user.uid,
      id,
    );
  }

  // Delete notification
  @Delete(':id')
  async delete(
    @Req() req,
    @Param('id') id: string,
  ) {
    return this.notificationsService.delete(
      req.user.uid,
      id,
    );
  }
}
