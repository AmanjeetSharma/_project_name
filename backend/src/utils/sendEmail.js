import nodemailer from "nodemailer";

/**
 * Send Email Utility
 * @param {string} to - receiver email
 * @param {string} subject - email subject
 * @param {string} content - text or HTML content
 * @param {boolean} isHtml - true if HTML content
 */

const sendEmail = async (to, subject, content, isHtml = false) => {
    try {
        console.log("SMTP DEBUG 👉", {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS ? "EXISTS" : "MISSING",
        });
        // 1. Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST, // e.g. smtp.gmail.com
            port: process.env.SMTP_PORT, // 587 or 465
            secure: process.env.SMTP_PORT == 465, // true for 465
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // 2. Mail options
        const mailOptions = {
            from: `"CollegeFinder" <${process.env.SMTP_USER}>`,
            to,
            subject,
            ...(isHtml ? { html: content } : { text: content }),
        };

        // 3. Send email
        const info = await transporter.sendMail(mailOptions);

        console.log("✅ Email sent:", info.messageId);

        return info;
    } catch (error) {
        console.error("❌ Email error:", error);
        throw new Error("Email could not be sent");
    }
};

export default sendEmail;