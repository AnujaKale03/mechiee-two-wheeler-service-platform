const express = require("express");

const router = express.Router();

const SYSTEM_PROMPT = `
You are Mechiee Assistant, a helpful support bot for the Mechiee doorstep two-wheeler service platform.

You help customers with:
- booking services
- service pricing
- booking history
- bike maintenance tips

You help mechanics with:
- assignments
- booking updates
- platform usage

Available services:
- Standard Service ₹499
- Premium Service ₹999
- Engine Repair ₹1999

Keep responses concise, friendly and relevant to bikes.
`;

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }
console.log("Gemini Key:", process.env.GEMINI_API_KEY);
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${SYSTEM_PROMPT}\n\nUser: ${message}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("Gemini Response:", JSON.stringify(data, null, 2));

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Chat Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate response",
    });
  }
});

module.exports = router;