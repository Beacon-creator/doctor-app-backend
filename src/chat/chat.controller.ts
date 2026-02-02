import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('chat')
@UseGuards(FirebaseAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  // Create or get chat room
  @Post('room')
  async getOrCreateRoom(
    @Req() req,
    @Body() body: { doctorId: string },
  ) {
    return this.chatService.getOrCreateChatRoom(
      req.user.uid,
      body.doctorId,
    );
  }

  // Send message
  @Post('message')
  async sendMessage(
    @Req() req,
    @Body()
    body: {
      chatRoomId: string;
      receiverId: string;
      content: string;
    },
  ) {
    return this.chatService.sendMessage(
      req.user.uid,
      body.chatRoomId,
      body.receiverId,
      body.content,
    );
  }

  // Get messages in a chat room
  @Get(':chatRoomId/messages')
  async getMessages(
    @Param('chatRoomId') chatRoomId: string,
  ) {
    return this.chatService.getMessages(chatRoomId);
  }

  // Mark messages as read
  @Patch(':chatRoomId/read')
  async markAsRead(
    @Req() req,
    @Param('chatRoomId') chatRoomId: string,
  ) {
    return this.chatService.markMessagesAsRead(
      chatRoomId,
      req.user.uid,
    );
  }

  // Chat list (Inbox)
  @Get()
  async chatList(@Req() req) {
    return this.chatService.getChatList(req.user.uid);
  }
}
