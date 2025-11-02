import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): {
        message: string;
        version: string;
        timestamp: string;
    };
    health(): {
        status: string;
    };
}
