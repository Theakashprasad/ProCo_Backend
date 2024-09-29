import nodemailer, { Transporter } from 'nodemailer';

interface EmailOptions {
    email: string;
    subject: string;
    text: string;
}

class MailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.USER,
                pass: "quuv atrp tguy xchw",
            },
        });
    }

    

    public async sendMail({ email, subject, text }: EmailOptions): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: 'ProCo@gmail.com',
                to: email,
                subject: subject,
                text: text,
                
            });
            console.log("Email sent successfully");
        } catch (error) {
            console.log("Email not sent!");
            console.log(error);
            throw error;
        }
    }
}

export default MailService;


