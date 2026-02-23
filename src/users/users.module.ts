import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule, FirebaseModule, 
   forwardRef(() => NotificationsModule),],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService], 
})
export class UsersModule {}
