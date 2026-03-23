// emailTemplates.js
const registerEmail = (url) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
                    background-color: #f4f4f5;
                    line-height: 1.6;
                }
                
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                .email-wrapper {
                    background-color: #ffffff;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                }
                
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 40px 30px;
                    text-align: center;
                }
                
                .logo {
                    font-size: 32px;
                    font-weight: bold;
                    color: #ffffff;
                    margin-bottom: 10px;
                }
                
                .logo span {
                    font-weight: normal;
                    color: #ffd700;
                }
                
                .content {
                    padding: 40px 30px;
                }
                
                .greeting {
                    font-size: 24px;
                    color: #1f2937;
                    margin-bottom: 20px;
                    font-weight: 600;
                }
                
                .message {
                    color: #4b5563;
                    margin-bottom: 30px;
                    font-size: 16px;
                }
                
                .button-container {
                    text-align: center;
                    margin: 35px 0;
                }
                
                .verify-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: #ffffff !important;
                    text-decoration: none;
                    padding: 14px 32px;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 16px;
                    transition: transform 0.2s, box-shadow 0.2s;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                
                .verify-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }
                
                .alt-link {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 14px;
                    color: #6b7280;
                }
                
                .alt-link a {
                    color: #667eea;
                    text-decoration: none;
                    word-break: break-all;
                }
                
                .alt-link a:hover {
                    text-decoration: underline;
                }
                
                .info-box {
                    background-color: #f9fafb;
                    border-left: 4px solid #667eea;
                    padding: 15px 20px;
                    margin: 25px 0;
                    border-radius: 8px;
                }
                
                .info-text {
                    color: #4b5563;
                    font-size: 14px;
                    margin: 0;
                }
                
                .footer {
                    background-color: #f9fafb;
                    padding: 25px 30px;
                    text-align: center;
                    border-top: 1px solid #e5e7eb;
                }
                
                .footer-text {
                    color: #6b7280;
                    font-size: 12px;
                    margin: 5px 0;
                }
                
                .social-links {
                    margin: 15px 0;
                }
                
                .social-links a {
                    color: #9ca3af;
                    text-decoration: none;
                    margin: 0 10px;
                    font-size: 12px;
                }
                
                @media only screen and (max-width: 480px) {
                    .content {
                        padding: 30px 20px;
                    }
                    
                    .header {
                        padding: 30px 20px;
                    }
                    
                    .verify-button {
                        padding: 12px 24px;
                        font-size: 14px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="email-wrapper">
                    <div class="header">
                        <div class="logo">
                            Queue<span>INDIA</span>
                        </div>
                        <div style="color: rgba(255,255,255,0.9); font-size: 14px; margin-top: 8px;">
                            Streamlining Queues, Enhancing Experience
                        </div>
                    </div>
                    
                    <div class="content">
                        <div class="greeting">
                            Welcome to QueueINDIA! 🎉
                        </div>
                        
                        <div class="message">
                            Thank you for choosing QueueINDIA. We're excited to have you on board! 
                            To get started and access all our features, please verify your email address.
                        </div>
                        
                        <div class="button-container">
                            <a href="${url}" class="verify-button">
                                Verify Email Address
                            </a>
                        </div>
                        
                        <div class="alt-link">
                            Or copy and paste this link into your browser:<br>
                            <a href="${url}">${url}</a>
                        </div>
                        
                        <div class="info-box">
                            <p class="info-text">
                                <strong>✨ Why verify?</strong><br>
                                • Secure your account<br>
                                • Get real-time queue updates<br>
                                • Receive priority notifications<br>
                                • Access exclusive features
                            </p>
                        </div>
                        
                        <div class="message" style="font-size: 14px; margin-top: 25px;">
                            This verification link will expire in 24 hours for your security.
                            If you didn't create an account with QueueINDIA, you can safely ignore this email.
                        </div>
                    </div>
                    
                    <div class="footer">
                        <div class="social-links">
                            <a href="#">Help Center</a> •
                            <a href="#">Privacy Policy</a> •
                            <a href="#">Terms of Service</a>
                        </div>
                        <p class="footer-text">
                            © 2024 QueueINDIA. All rights reserved.<br>
                            Making queues smarter, one step at a time.
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

export default registerEmail;