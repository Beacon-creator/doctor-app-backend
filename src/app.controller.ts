import { Controller, Get, Param, Patch } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Patch(":id/confirm")
  confirm(@Param("id") id: string) {
    return this.appService.confirm(id);
  }
}
