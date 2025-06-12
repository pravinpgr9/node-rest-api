const router = require("express").Router();
const Contact = require("../models/Contact");
const SibApiV3Sdk = require("sib-api-v3-sdk");

// Configure Brevo API Key globally
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

// Function to send a transactional email to the admin with table formatting
async function sendContactEmailToAdmin(contactData) {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.sender = {
        name: "VibelyArt Contact Form",
        email: process.env.BREVO_VERIFIED_SENDER // Must be a verified sender in Brevo
    };
    sendSmtpEmail.to = [{
        email: process.env.ADMIN_EMAIL, // Admin's email address to receive notifications
        name: "VibelyArt Admin"
    }];
    sendSmtpEmail.subject = "New Contact Form Submission from VibelyArt!";
    sendSmtpEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h1 style="color: #0056b3;">New Contact Form Message</h1>
            <p>You have received a new submission from the VibelyArt contact form. Here are the details:</p>

            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2; font-weight: bold; width: 150px;">Full Name:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${contactData.fullName}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2; font-weight: bold;">Email Address:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${contactData.emailAddress}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2; font-weight: bold;">Phone Number:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${contactData.phoneNumber}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2; font-weight: bold;">Event Type:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${contactData.eventType}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2; font-weight: bold; vertical-align: top;">Message:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${contactData.message}</td>
                </tr>
            </table>

            <p style="margin-top: 30px; font-size: 0.9em; color: #777;">This email was sent automatically from your website contact form.</p>
        </div>
    `;

    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("Transactional email sent successfully:", response);
        return response;
    } catch (error) {
        console.error("Error sending transactional email:", error.response?.text || error.message);
        throw error;
    }
}

// POST - Submit contact form (remains the same)
router.post("/", async (req, res) => {
    try {
        const { fullName, emailAddress, phoneNumber, eventType, message } = req.body;

        // Basic validation
        if (!fullName || !emailAddress || !phoneNumber || !eventType || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        const newContact = new Contact({ fullName, emailAddress, phoneNumber, eventType, message });
        const savedContact = await newContact.save();

        try {
            // Call the function to send the transactional email to the admin
            await sendContactEmailToAdmin({ fullName, emailAddress, phoneNumber, eventType, message });
        } catch (emailError) {
            console.error("Brevo Email Error:", emailError);
            return res.status(500).json({
                success: false,
                message: "Contact saved, but failed to send email notification to admin.",
                error: emailError.message,
                data: savedContact,
            });
        }

        res.status(201).json({
            success: true,
            message: "Contact form submitted successfully and admin notified.",
            data: savedContact,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to process contact form.",
            error: err.message,
        });
    }
});

module.exports = router;    