const router = require("express").Router();
const Emailverify = require("../models/Emailverify");
const https = require('https'); // Import the 'https' module

// REGISTER
router.post("/verify-email", async (req, res) => {
  try {
    const email = req.body.email; // Get email from request body

    const options = {
      hostname: "api.listclean.xyz",
      port: 443,
      path: "/v1/verify/email/" + email,
      method: "GET", // Use GET as per API documentation
      headers: {
        "X-AUTH-TOKEN": process.env.API_KEY,
      },
    };

    

    const apiRequest = https.request(options, async (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", async () => {
        try {
          const parsedResponse = JSON.parse(data);
          // console.log(parsedResponse)
          // return false;
          // Save verification data to the database
          const newVerification = new Emailverify({
            email: email,
            verified_at: new Date(),
            status: parsedResponse.data.status,
            remarks: parsedResponse.data.remarks,
            error: parsedResponse.error_code,
            error_code: parsedResponse.error_code,
          });

          await newVerification.save();

          res.status(200).json(parsedResponse); // Send parsed response
        } catch (error) {
            console.log(error);
          res.status(500).json({ error: "Failed to parse response" });
        }
      });
    });

    apiRequest.on("error", async (error) => {
      // Save error data to the database for failed verification
      const newVerification = new Emailverify({
        email: email,
        verified_at: new Date(),
        status: "failed",
        remarks: "Verification failed",
        error: error.message,
      });

      await newVerification.save();

      res.status(500).json({ error: "Failed to verify email" });
    });

    apiRequest.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
