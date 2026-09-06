// -Path: "Nest TypeScript/src/app.controller.ts"
import { AppService } from './app.service';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): object {
        return this.appService.getHello();
    }

    @Get('env')
    getAllEnv(): Record<string, string> {
        return this.appService.getAllEnv();
    }
}
