const router = require("express").Router();
const axios = require("axios");
const Contact = require("../models/Contact");

// Function to send transactional email to the admin via Brevo
async function sendContactEmailToAdmin(contactData) {
    const payload = {
        sender: {
            name: "VibelyArt Contact Form",
            email: process.env.BREVO_VERIFIED_SENDER // Must be a verified sender
        },
        to: [{
            email: process.env.ADMIN_EMAIL,
            name: "VibelyArt Admin"
        }],
        subject: "New Contact Form Submission from VibelyArt!",
        htmlContent: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h1 style="color: #0056b3;">New Contact Form Message</h1>
                <p>You have received a new submission from the VibelyArt contact form. Here are the details:</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Full Name:</td><td style="padding: 10px; border: 1px solid #ddd;">${contactData.fullName}</td></tr>
                    <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email Address:</td><td style="padding: 10px; border: 1px solid #ddd;">${contactData.emailAddress}</td></tr>
                    <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone Number:</td><td style="padding: 10px; border: 1px solid #ddd;">${contactData.phoneNumber}</td></tr>
                    <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Event Type:</td><td style="padding: 10px; border: 1px solid #ddd;">${contactData.eventType}</td></tr>
                    <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Message:</td><td style="padding: 10px; border: 1px solid #ddd;">${contactData.message}</td></tr>
                </table>
                <p style="margin-top: 30px; font-size: 0.9em; color: #777;">This email was sent automatically from your website contact form.</p>
            </div>
        `
    };

    try {
        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            payload,
            {
                headers: {
                    'api-key': process.env.BREVO_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log("Email sent successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending email:", error?.response?.data || error.message);
        throw new Error("Failed to send email notification");
    }
}

// POST - Submit contact form
router.post("/", async (req, res) => {
    try {
        const { fullName, emailAddress, phoneNumber, eventType, message } = req.body;

        if (!fullName || !emailAddress || !phoneNumber || !eventType || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const newContact = new Contact({ fullName, emailAddress, phoneNumber, eventType, message });
        const savedContact = await newContact.save();

        try {
            await sendContactEmailToAdmin({ fullName, emailAddress, phoneNumber, eventType, message });
        } catch (emailError) {
            return res.status(500).json({
                success: false,
                message: "Contact saved, but failed to send email notification.",
                error: emailError.message,
                data: savedContact
            });
        }

        res.status(201).json({
            success: true,
            message: "Contact form submitted successfully and admin notified.",
            data: savedContact
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to process contact form.",
            error: err.message
        });
    }
});

module.exports = router;
