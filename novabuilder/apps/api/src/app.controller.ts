import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
@Controller()
export class AppController {
  private readonly appService: AppService;

  constructor(@Inject(AppService) appService?: AppService) {
    this.appService = appService ?? new AppService();
  }

  @Get()
  health() {
    return this.appService.getStatus();
  }
}
