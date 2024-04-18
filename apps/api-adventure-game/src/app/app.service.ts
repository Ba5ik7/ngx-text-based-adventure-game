import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  postData(command: string): { message: string } {
    return { message: `Command received: ${command}` };
  }
}
