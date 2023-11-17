import { Controller, Get, Logger, LoggerService } from '@nestjs/common';

import { AppService } from '@/app.service';

@Controller()
export class AppController {
  constructor(private readonly logger: Logger, private readonly appService: AppService) { }

  @Get("/hello")
  getHello(): string {
    this.logger.error('Error');

    return this.appService.getHello();
  }
}
