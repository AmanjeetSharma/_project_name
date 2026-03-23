// emailTemplates.js
const registerEmail = (url) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email - CollegeFinder</title>
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
                    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                    padding: 40px 30px;
                    text-align: center;
                }
                
                .logo {
                    font-size: 28px;
                    font-weight: bold;
                    color: #ffffff;
                    margin-bottom: 10px;
                }
                
                .logo span {
                    font-weight: normal;
                    color: #ffd966;
                }
                
                .tagline {
                    color: rgba(255,255,255,0.9);
                    font-size: 14px;
                    margin-top: 8px;
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
                    margin-bottom: 20px;
                    font-size: 16px;
                }
                
                .button-container {
                    text-align: center;
                    margin: 35px 0;
                }
                
                .verify-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
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
                    box-shadow: 0 4px 12px rgba(30, 60, 114, 0.4);
                }
                
                .alt-link {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 14px;
                    color: #6b7280;
                }
                
                .alt-link a {
                    color: #1e3c72;
                    text-decoration: none;
                    word-break: break-all;
                }
                
                .alt-link a:hover {
                    text-decoration: underline;
                }
                
                .steps-container {
                    background-color: #f9fafb;
                    padding: 20px;
                    margin: 25px 0;
                    border-radius: 12px;
                }
                
                .step-item {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 16px;
                    color: #4b5563;
                    font-size: 14px;
                }
                
                .step-number {
                    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                    color: white;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: bold;
                    margin-right: 12px;
                    flex-shrink: 0;
                }
                
                .step-text {
                    flex: 1;
                }
                
                .info-box {
                    background-color: #e8f0fe;
                    border-left: 4px solid #1e3c72;
                    padding: 15px 20px;
                    margin: 25px 0;
                    border-radius: 8px;
                }
                
                .info-text {
                    color: #1e3c72;
                    font-size: 14px;
                    margin: 0;
                    font-weight: 500;
                }
                
                .benefits {
                    background-color: #f0fdf4;
                    border-radius: 8px;
                    padding: 15px 20px;
                    margin: 20px 0;
                }
                
                .benefits-title {
                    font-weight: 600;
                    color: #166534;
                    margin-bottom: 10px;
                    font-size: 14px;
                }
                
                .benefits-list {
                    margin: 0;
                    padding-left: 20px;
                    color: #166534;
                    font-size: 13px;
                }
                
                .benefits-list li {
                    margin-bottom: 6px;
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
                            College<span>Finder</span>
                        </div>
                        <div class="tagline">
                            Your Journey to the Right College Begins Here
                        </div>
                    </div>
                    
                    <div class="content">
                        <div class="greeting">
                            Welcome to CollegeFinder! 🎓
                        </div>
                        
                        <div class="message">
                            You're just one step away from discovering your ideal college and career path. 
                            Click the button below to verify your email and complete your registration.
                        </div>
                        
                        <div class="button-container">
                            <a href="${url}" class="verify-button">
                                Verify Email & Complete Registration
                            </a>
                        </div>
                        
                        <div class="alt-link">
                            Or copy and paste this link into your browser:<br>
                            <a href="${url}">${url}</a>
                        </div>
                        
                        <div class="steps-container">
                            <div class="step-item">
                                <span class="step-number">1</span>
                                <span class="step-text"><strong>Verify Your Email</strong> - Click the button above to confirm your email address</span>
                            </div>
                            <div class="step-item">
                                <span class="step-number">2</span>
                                <span class="step-text"><strong>Complete Your Profile</strong> - Tell us about your academic background and interests</span>
                            </div>
                            <div class="step-item">
                                <span class="step-number">3</span>
                                <span class="step-text"><strong>Get Personalized Recommendations</strong> - Receive AI-powered college and career suggestions</span>
                            </div>
                        </div>
                        
                        <div class="benefits">
                            <div class="benefits-title">✨ What You'll Get After Verification:</div>
                            <ul class="benefits-list">
                                <li>Personalized college recommendations based on your profile</li>
                                <li>Access to entrance exam eligibility checker</li>
                                <li>Scholarship opportunities tailored to your needs</li>
                                <li>Real-time updates on admissions and results</li>
                                <li>Save and compare colleges of your choice</li>
                            </ul>
                        </div>
                        
                        <div class="info-box">
                            <p class="info-text">
                                ⏰ <strong>Verification Link Expires in 24 Hours</strong><br>
                                Complete your registration within 24 hours to secure your account.
                            </p>
                        </div>
                        
                        <div class="message" style="font-size: 14px; margin-top: 20px; background-color: #fff3e0; padding: 12px; border-radius: 8px;">
                            🔒 <strong>Didn't sign up for CollegeFinder?</strong><br>
                            If you didn't request this email, you can safely ignore it. No account will be created until you verify.
                        </div>
                    </div>
                    
                    <div class="footer">
                        <div class="social-links">
                            <a href="#">About Us</a> •
                            <a href="#">Privacy Policy</a> •
                            <a href="#">Terms of Service</a> •
                            <a href="#">Contact Support</a>
                        </div>
                        <p class="footer-text">
                            © 2024 CollegeFinder. All rights reserved.<br>
                            Helping students find their perfect college match
                        </p>
                        <p class="footer-text" style="font-size: 11px;">
                            This is an automated verification email. Please do not reply.<br>
                            For assistance, contact us at support@collegefinder.com
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
};

export default registerEmail;