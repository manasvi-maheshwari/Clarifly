require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.json());
app.use(express.static('public')); 

app.post('/generate-email', async (req, res) => {
    try {
        const { experience } = req.body;
        
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are a professional assistant that writes firm but polite complaint emails.
      
      User's Experience: "${experience}"
      
      Instructions:
      - Write a professional subject line.
      - Use a formal greeting.
      - Clearly state the issue based on the experience above.
      - Ask for a reasonable resolution (e.g., a refund or replacement).
      - Keep the tone professional, not angry.`;
        
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        res.json({ email: text });
    } catch (error) {
        console.error("AI Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});

