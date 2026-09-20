// -Path: "src/mail/mail.module.ts"
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
    exports: [MailService],
    providers: [MailService],
})
export class MailModule {}
