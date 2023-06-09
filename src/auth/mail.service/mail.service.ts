import * as nodemailer from 'nodemailer';



export class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure:false,
            auth:{
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    async sendActivationLink(email,link){
        console.log(process.env.SMTP_HOST, process.env.SMTP_PORT, process.env.SMTP_USER)
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Activation Link'+process.env.API_URL,
            text:'Hello User',
            html: `<p>Для активации перейдите по ссылке: ${link}</p>`,
        });
    }
}
