import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { message: string; version: string; timestamp: string } {
    return {
      message: 'Welcome to OmniScholar API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
