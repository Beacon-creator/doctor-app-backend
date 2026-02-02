import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import axios from 'axios';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  // 1️⃣ Initialize payment
  async initializePayment(userId: string, amount: number, email: string) {
    const response = await axios.post(
      `${process.env.PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: amount * 100, // kobo
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    return response.data;
  }

  // 2️⃣ Verify payment
  async verifyPayment(reference: string, userId: string) {
    const response = await axios.get(
      `${process.env.PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    interface PaystackVerifyResponse {
      status: string;
      amount: number;
      currency: string;
      // add other fields as needed
    }

    const data = response.data as PaystackVerifyResponse;

    if (data.status !== 'success') {
      throw new ForbiddenException('Payment not successful');
    }

    const payment = await this.prisma.payment.create({
      data: {
        userId,
        appointmentId: '', // TODO: Provide the correct appointmentId here
        amount: data.amount / 100,
        currency: data.currency,
        provider: 'PAYSTACK',
        reference,
        status: 'SUCCESS',
      },
    });

    await this.notifications.create(
      userId,
      'Payment Successful',
      'Your payment was completed successfully.',
    );

    return payment;
  }
}
