import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [FirebaseModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
