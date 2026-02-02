import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  // Create or return existing chat room
  async getOrCreateChatRoom(userId: string, doctorId: string) {
    const chatRoom = await this.prisma.chatRoom.findFirst({
      where: {
        userId,
        doctorId,
      },
    });

    if (chatRoom) return chatRoom;

    return this.prisma.chatRoom.create({
      data: {
        userId,
        doctorId,
      },
    });
  }

  // Send a message
  async sendMessage(
    senderId: string,
    chatRoomId: string,
    receiverId: string,
    content: string,
  ) {
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
    });

    if (!chatRoom) {
      throw new ForbiddenException('Chat room does not exist');
    }

    return this.prisma.message.create({
      data: {
        chatRoomId,
        senderId,
        receiverId,
        content,
      },
    });
  }

  // Get messages in a chat
  async getMessages(chatRoomId: string) {
    return this.prisma.message.findMany({
      where: { chatRoomId },
      orderBy: { createdAt: 'asc' },
    });
  }

  // Mark messages as read
  async markMessagesAsRead(chatRoomId: string, userId: string) {
    return this.prisma.message.updateMany({
      where: {
        chatRoomId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  // Chat list (Inbox)
  async getChatList(userId: string) {
    return this.prisma.chatRoom.findMany({
      where: {
        OR: [
          { userId },
          { doctorId: userId },
        ],
      },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
