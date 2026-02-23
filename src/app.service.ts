import { Injectable } from '@nestjs/common';



@Injectable()
export class AppService {
  [x: string]: any;
  getHello(): string {
    return 'Hello World!';
  }

  async confirm(id: string) {
  return this.prisma.appointment.update({
    where: { id },
    data: { status: "CONFIRMED" },
  });
}
}

