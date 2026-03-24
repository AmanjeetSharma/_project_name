// import nodemailer from "nodemailer";

// /**
//  * Send Email Utility
//  * @param {string} to - receiver email
//  * @param {string} subject - email subject
//  * @param {string} content - text or HTML content
//  * @param {boolean} isHtml - true if HTML content
//  */

// const sendEmail = async (to, subject, content, isHtml = false) => {
//     try {
//         // 1. Create transporter
//         const transporter = nodemailer.createTransport({
//             host: process.env.SMTP_HOST, // e.g. smtp.gmail.com
//             port: process.env.SMTP_PORT, // 587 or 465
//             secure: process.env.SMTP_PORT == 465, // true for 465
//             auth: {
//                 user: process.env.SMTP_USER,
//                 pass: process.env.SMTP_PASS,
//             },
//         });

//         // 2. Mail options
//         const mailOptions = {
//             from: `"CollegeFinder" <${process.env.SMTP_USER}>`,
//             to,
//             subject,
//             ...(isHtml ? { html: content } : { text: content }),
//         };

//         // 3. Send email
//         const info = await transporter.sendMail(mailOptions);

//         console.log(`📧  Email sent to ${to} | Subject: ${subject} | Message ID: ${info.messageId}`);

//         return info;
//     } catch (error) {
//         console.error("Email error:", error);
//         throw new Error("Email could not be sent");
//     }
// };

// export default sendEmail;
























import axios from "axios";

//send email using Brevo API

const sendEmail = async (to, subject, content, isHtml = false) => {
    try {
        // console.log(process.env.BREVO_API_KEY ? "Brevo API key is set" : "Brevo API key is NOT set");
        // console.log(process.env.EMAIL_SENDER_ADDRESS ? "Email sender address is set" : "Email sender address is NOT set");
        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: {
                    name: process.env.EMAIL_SENDER_NAME || "QueueINDIA",
                    email: process.env.EMAIL_SENDER_ADDRESS,
                },
                to: [{ email: to }],
                subject: subject,
                htmlContent: isHtml ? content : undefined,
                textContent: !isHtml ? content : undefined,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "api-key": process.env.BREVO_API_KEY,
                },
            }
        );

        console.log(`[sendEmail] Email sent to ${to}| Sub: ${subject}| Message ID: ${response.data.messageId}`);

        return response.data;

    } catch (error) {
        console.error(
            "Brevo API Error:",
            error.response?.data || error.message
        );

        throw new Error(
            error.response?.data?.message || "Email sending failed."
        );
    }
};

export default sendEmail;