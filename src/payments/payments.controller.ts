import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('payments')
@UseGuards(FirebaseAuthGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  // Initialize payment
  @Post('initialize')
  async initialize(
    @Req() req,
    @Body() body: { amount: number; email: string },
  ) {
    return this.paymentsService.initializePayment(
      req.user.uid,
      body.amount,
      body.email,
    );
  }

  // Verify payment
  @Get('verify')
  async verify(
    @Req() req,
    @Query('reference') reference: string,
  ) {
    return this.paymentsService.verifyPayment(
      reference,
      req.user.uid,
    );
  }
}
