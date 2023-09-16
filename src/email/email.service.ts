import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { EmailPurpose } from 'src/common/constants/email-purpose';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, purpose: EmailPurpose, data?: { token?: string }) {
    const emailData = EmailPurpose[purpose];

    this.mailerService
      .sendMail({
        to,
        from: 'noreply@sera.com',
        subject: emailData.subject,
        template: emailData.template,
        context: data,
      })
      .then(() => {
        this.logger.log(
          `Successfully sent '${purpose}' email to user with email ${to}`,
        );
      })
      .catch((err) => {
        this.logger.warn(
          `Could not send '${purpose}' email to user with email '${to}'`,
        );
        console.log(err);
      });
  }
}
