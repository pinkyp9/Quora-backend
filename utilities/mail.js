import nodemailer from "nodemailer";
const mailing = async(sender,receiver,subject,text)=>{
        
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
        });

        const mailOption = {
        from: sender,
        to: receiver,
        subject: subject,
        text: text,
        };

   
        transporter.sendMail(mailOption, (error, info) => {
        if (error) {
          console.error("Email sending failed:", error);
        } 
        else {
          console.log("Email sent:", info.response);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
      });
    }

    export {mailing};