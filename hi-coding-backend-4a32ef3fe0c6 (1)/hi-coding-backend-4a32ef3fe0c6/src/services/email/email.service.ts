import { createTransport } from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
      },
    });
  }

  public async sendEmail(email: string, subject: string, message: string) {
    try {
      this.transporter.sendMail(
        {
          to: email, // sender address
          from: process.env.EMAIL,
          subject: subject, // Subject line
          html: message, // plain text body
          priority: 'high',
        },
        function (error, info) {
          if (error) {
            console.log(error.message);
          } else {
            console.log('Email sent: ' + info.response);
          }
        },
      );
    } catch (err) {
      console.error(err.message);
    }
  }
}
