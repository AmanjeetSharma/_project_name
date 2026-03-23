// utils/emailTemplates/resetPasswordEmail.js

export const resetPasswordEmail = (resetLink) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Password - CollegeFinder</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
                    background-color: #f4f4f5;
                    line-height: 1.6;
                }
                
                .container {
                    max-width: 500px;
                    margin: 40px auto;
                    padding: 20px;
                }
                
                .email-card {
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                
                .header {
                    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                    padding: 30px;
                    text-align: center;
                }
                
                .logo {
                    font-size: 28px;
                    font-weight: bold;
                    color: #ffffff;
                }
                
                .logo span {
                    color: #ffd966;
                }
                
                .content {
                    padding: 30px;
                }
                
                h2 {
                    color: #1f2937;
                    margin-bottom: 20px;
                    font-size: 24px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .message {
                    color: #4b5563;
                    margin-bottom: 25px;
                    font-size: 16px;
                }
                
                .button-container {
                    text-align: center;
                    margin: 30px 0;
                }
                
                .reset-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                    color: #ffffff !important;
                    text-decoration: none;
                    padding: 12px 28px;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 16px;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                
                .reset-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(30, 60, 114, 0.3);
                }
                
                .alt-link {
                    text-align: center;
                    margin: 20px 0;
                    font-size: 13px;
                    color: #6b7280;
                }
                
                .alt-link a {
                    color: #1e3c72;
                    text-decoration: none;
                    word-break: break-all;
                }
                
                .info-box {
                    background-color: #fef2e0;
                    border-left: 4px solid #f59e0b;
                    padding: 12px 16px;
                    margin: 20px 0;
                    border-radius: 6px;
                }
                
                .info-text {
                    color: #92400e;
                    font-size: 13px;
                    margin: 0;
                }
                
                .footer {
                    background-color: #f9fafb;
                    padding: 20px;
                    text-align: center;
                    border-top: 1px solid #e5e7eb;
                }
                
                .footer-text {
                    color: #6b7280;
                    font-size: 12px;
                    margin: 5px 0;
                }
                
                @media only screen and (max-width: 480px) {
                    .container {
                        padding: 10px;
                    }
                    
                    .content {
                        padding: 20px;
                    }
                    
                    .reset-button {
                        padding: 10px 20px;
                        font-size: 14px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="email-card">
                    <div class="header">
                        <div class="logo">
                            College<span>Finder</span>
                        </div>
                    </div>
                    
                    <div class="content">
                        <h2>
                            🔐 Reset Your Password
                        </h2>
                        
                        <div class="message">
                            We received a request to reset your password for your CollegeFinder account. 
                            Click the button below to create a new password.
                        </div>
                        
                        <div class="button-container">
                            <a href="${resetLink}" class="reset-button">
                                Reset Password
                            </a>
                        </div>
                        
                        <div class="alt-link">
                            Or copy and paste this link into your browser:<br>
                            <a href="${resetLink}">${resetLink}</a>
                        </div>
                        
                        <div class="info-box">
                            <p class="info-text">
                                ⏳ <strong>This link will expire in 10 minutes</strong> for your security.
                                If you didn't request a password reset, you can safely ignore this email.
                            </p>
                        </div>
                        
                        <div class="message" style="font-size: 13px; margin-top: 20px; color: #6b7280;">
                            For security reasons, never share this link with anyone. 
                            CollegeFinder will never ask for your password via email.
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p class="footer-text">
                            © 2024 CollegeFinder. All rights reserved.<br>
                            Your trusted partner in finding the perfect college
                        </p>
                        <p class="footer-text" style="font-size: 11px;">
                            This is an automated message, please do not reply to this email.
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
};