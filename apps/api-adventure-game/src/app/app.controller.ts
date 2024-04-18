import { Controller, Get, Post } from '@nestjs/common';

import { AppService } from './app.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping')
  getData() {
    console.log('Ping received');
    return this.appService.getData();
  }

  @Post('command')
  postData(command: string) {
    console.log('Command received:', command);
    return this.appService.postData(command);
  }
}
