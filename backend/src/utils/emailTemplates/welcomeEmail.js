// utils/emailTemplates/welcomeEmail.js

export const welcomeEmail = (userName) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to CollegeFinder</title>
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
                
                .greeting span {
                    color: #1e3c72;
                }
                
                .message {
                    color: #4b5563;
                    margin-bottom: 20px;
                    font-size: 16px;
                }
                
                .getting-started {
                    background-color: #f9fafb;
                    padding: 20px;
                    margin: 25px 0;
                    border-radius: 12px;
                }
                
                .section-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .feature-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin: 20px 0;
                }
                
                .feature-card {
                    background: white;
                    padding: 15px;
                    border-radius: 10px;
                    border: 1px solid #e5e7eb;
                }
                
                .feature-icon {
                    font-size: 24px;
                    margin-bottom: 8px;
                }
                
                .feature-title {
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 5px;
                    font-size: 14px;
                }
                
                .feature-desc {
                    color: #6b7280;
                    font-size: 12px;
                }
                
                .button-container {
                    text-align: center;
                    margin: 35px 0;
                }
                
                .action-button {
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
                
                .action-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(30, 60, 114, 0.4);
                }
                
                .tip-box {
                    background-color: #e8f0fe;
                    border-left: 4px solid #1e3c72;
                    padding: 15px 20px;
                    margin: 25px 0;
                    border-radius: 8px;
                }
                
                .tip-text {
                    color: #1e3c72;
                    font-size: 14px;
                    margin: 0;
                }
                
                .stats-box {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 12px;
                    padding: 20px;
                    margin: 25px 0;
                    text-align: center;
                    color: white;
                }
                
                .stats-number {
                    font-size: 32px;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                
                .stats-label {
                    font-size: 12px;
                    opacity: 0.9;
                }
                
                .stats-row {
                    display: flex;
                    justify-content: space-around;
                    margin-top: 15px;
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
                    
                    .feature-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .action-button {
                        padding: 12px 24px;
                        font-size: 14px;
                    }
                    
                    .stats-row {
                        flex-direction: column;
                        gap: 15px;
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
                            Welcome aboard, <span>${userName || "Student"}!</span> 🎉
                        </div>
                        
                        <div class="message">
                            Thank you for joining CollegeFinder! We're thrilled to have you as part of our community. 
                            Your journey to finding the perfect college and career path starts now.
                        </div>
                        
                        <div class="stats-box">
                            <div class="stats-row">
                                <div>
                                    <div class="stats-number">5000+</div>
                                    <div class="stats-label">Colleges Listed</div>
                                </div>
                                <div>
                                    <div class="stats-number">1000+</div>
                                    <div class="stats-label">Scholarships</div>
                                </div>
                                <div>
                                    <div class="stats-number">50,000+</div>
                                    <div class="stats-label">Happy Students</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="getting-started">
                            <div class="section-title">
                                🚀 Get Started in 3 Easy Steps
                            </div>
                            <div class="feature-grid">
                                <div class="feature-card">
                                    <div class="feature-icon">📝</div>
                                    <div class="feature-title">Complete Your Profile</div>
                                    <div class="feature-desc">Tell us about your academic background and interests</div>
                                </div>
                                <div class="feature-card">
                                    <div class="feature-icon">🎯</div>
                                    <div class="feature-title">Take Aptitude Test</div>
                                    <div class="feature-desc">Discover your strengths and career preferences</div>
                                </div>
                                <div class="feature-card">
                                    <div class="feature-icon">🤖</div>
                                    <div class="feature-title">Get AI Recommendations</div>
                                    <div class="feature-desc">Receive personalized college and career suggestions</div>
                                </div>
                                <div class="feature-card">
                                    <div class="feature-icon">📊</div>
                                    <div class="feature-title">Track Progress</div>
                                    <div class="feature-desc">Monitor your applications and exam preparation</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="button-container">
                            <a href="${process.env.CLIENT_URL}/dashboard" class="action-button">
                                Go to Your Dashboard
                            </a>
                        </div>
                        
                        <div class="tip-box">
                            <p class="tip-text">
                                💡 <strong>Pro Tip:</strong> Complete your profile within the next 24 hours to get 
                                personalized college recommendations tailored to your interests and academic profile!
                            </p>
                        </div>
                        
                        <div class="message" style="font-size: 14px; margin-top: 20px;">
                            <strong>What you can do next:</strong>
                        </div>
                        
                        <div style="margin: 15px 0;">
                            <div style="margin-bottom: 12px;">
                                ✅ <strong>Explore Colleges</strong> - Browse through 5000+ colleges across India
                            </div>
                            <div style="margin-bottom: 12px;">
                                ✅ <strong>Check Eligibility</strong> - Find entrance exams you're eligible for
                            </div>
                            <div style="margin-bottom: 12px;">
                                ✅ <strong>Discover Scholarships</strong> - Apply for relevant scholarships
                            </div>
                            <div style="margin-bottom: 12px;">
                                ✅ <strong>Save Favorites</strong> - Create your shortlist of dream colleges
                            </div>
                        </div>
                        
                        <div class="message" style="font-size: 14px; background-color: #fef2e0; padding: 12px; border-radius: 8px; margin-top: 20px;">
                            📞 <strong>Need Help?</strong> Our support team is here to assist you. 
                            Contact us at <a href="mailto:support@collegefinder.com" style="color: #1e3c72;">support@collegefinder.com</a>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <div class="social-links">
                            <a href="#">About Us</a> •
                            <a href="#">Blog</a> •
                            <a href="#">Privacy Policy</a> •
                            <a href="#">Terms of Service</a> •
                            <a href="#">Contact Support</a>
                        </div>
                        <p class="footer-text">
                            © 2024 CollegeFinder. All rights reserved.<br>
                            Helping students find their perfect college match
                        </p>
                        <p class="footer-text" style="font-size: 11px;">
                            You're receiving this email because you registered with CollegeFinder.<br>
                            If you have any questions, feel free to reach out to our support team.
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
};

export default welcomeEmail;