/**
 * Neon Writers Backend Server
 * Handles email sending and support ticket management
 */

import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'neonwriters3@gmail.com',
        pass: process.env.EMAIL_PASSWORD // Use app-specific password for Gmail
    }
});

/**
 * POST /api/send-email
 * Send email to support inbox
 * 
 * Expected body:
 * {
 *   to: "neonwriters3@gmail.com",
 *   from: "user@example.com",
 *   subject: "[Support Ticket TKT-xxxxx] Issue Title",
 *   category: "bidding|payments|tasks|technical|account|other",
 *   message: "Full ticket message",
 *   userEmail: "user@example.com",
 *   userName: "User Name"
 * }
 */
app.post('/api/send-email', async (req, res) => {
    try {
        const { to, from, subject, category, message, userEmail, userName } = req.body;

        // Validate required fields
        if (!to || !from || !subject || !message) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: to, from, subject, message'
            });
        }

        // Prepare email content
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1e3c72; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
        .content { background-color: #f5f7fa; padding: 20px; border-radius: 0 0 5px 5px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #1e3c72; }
        .value { color: #5a6c7d; margin-top: 5px; }
        .message-box { background-color: white; padding: 15px; border-left: 4px solid #4dabf7; margin-top: 15px; }
        .footer { margin-top: 20px; font-size: 12px; color: #adb5bd; border-top: 1px solid #e9ecef; padding-top: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin: 0;">New Support Ticket Received</h2>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">Ticket ID:</div>
                <div class="value">${subject.match(/TKT-\d+/)?.[0] || 'N/A'}</div>
            </div>
            <div class="field">
                <div class="label">From:</div>
                <div class="value">${userName} (${userEmail})</div>
            </div>
            <div class="field">
                <div class="label">Category:</div>
                <div class="value">${category || 'N/A'}</div>
            </div>
            <div class="field">
                <div class="label">Subject:</div>
                <div class="value">${subject}</div>
            </div>
            <div class="field">
                <div class="label">Submitted:</div>
                <div class="value">${new Date().toLocaleString()}</div>
            </div>
            
            <div class="message-box">
                <div class="label">Message:</div>
                <div class="value" style="white-space: pre-wrap; margin-top: 10px;">
${message}
                </div>
            </div>
            
            <div class="footer">
                <p>Please respond to this ticket by replying to this email or through the admin dashboard.</p>
                <p>Do not reply to this automated message.</p>
            </div>
        </div>
    </div>
</body>
</html>
        `;

        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER || 'neonwriters3@gmail.com',
            to: to || 'neonwriters3@gmail.com',
            replyTo: from,
            subject: subject,
            html: htmlContent,
            text: message
        };

        const info = await transporter.sendMail(mailOptions);

        // Log successful send
        console.log('Email sent successfully:', {
            messageId: info.messageId,
            response: info.response,
            from: from,
            timestamp: new Date().toLocaleString()
        });

        // Return success response
        res.json({
            success: true,
            message: 'Email sent successfully',
            messageId: info.messageId,
            timestamp: new Date().toISOString(),
            recipient: to,
            senderEmail: from
        });

    } catch (error) {
        console.error('Error sending email:', error);

        res.status(500).json({
            success: false,
            error: 'Failed to send email',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * POST /api/send-response
 * Send response email to user
 * 
 * Expected body:
 * {
 *   userEmail: "user@example.com",
 *   ticketId: "TKT-xxxxx",
 *   subject: "Response to your ticket",
 *   message: "Response message"
 * }
 */
app.post('/api/send-response', async (req, res) => {
    try {
        const { userEmail, ticketId, subject, message } = req.body;

        if (!userEmail || !ticketId || !message) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: userEmail, ticketId, message'
            });
        }

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #40c057; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
        .content { background-color: #f5f7fa; padding: 20px; border-radius: 0 0 5px 5px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #1e3c72; }
        .value { color: #5a6c7d; margin-top: 5px; }
        .message-box { background-color: white; padding: 15px; border-left: 4px solid #40c057; margin-top: 15px; }
        .footer { margin-top: 20px; font-size: 12px; color: #adb5bd; border-top: 1px solid #e9ecef; padding-top: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin: 0;">Response to Your Support Ticket</h2>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">Ticket ID:</div>
                <div class="value">${ticketId}</div>
            </div>
            <div class="field">
                <div class="label">Subject:</div>
                <div class="value">${subject}</div>
            </div>
            
            <div class="message-box">
                <div class="label">Response:</div>
                <div class="value" style="white-space: pre-wrap; margin-top: 10px;">
${message}
                </div>
            </div>
            
            <div class="footer">
                <p>Thank you for your patience. If you have any further questions, please reply to this email.</p>
                <p>Neon Writers Support Team</p>
            </div>
        </div>
    </div>
</body>
</html>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER || 'neonwriters3@gmail.com',
            to: userEmail,
            subject: `[${ticketId}] ${subject}`,
            html: htmlContent,
            text: message
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('Response email sent:', {
            messageId: info.messageId,
            to: userEmail,
            ticketId: ticketId,
            timestamp: new Date().toLocaleString()
        });

        res.json({
            success: true,
            message: 'Response email sent successfully',
            messageId: info.messageId,
            timestamp: new Date().toISOString(),
            recipient: userEmail
        });

    } catch (error) {
        console.error('Error sending response email:', error);

        res.status(500).json({
            success: false,
            error: 'Failed to send response email',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
    });
});

/**
 * Start server
 */
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║    Neon Writers Backend Server         ║
║    Running on port ${PORT}              ║
║    Email: ${process.env.EMAIL_USER || 'neonwriters3@gmail.com'}        ║
╚════════════════════════════════════════╝
    `);
    console.log(`API available at: http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});

export default app;
