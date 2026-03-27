import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

// Load the Gemini API Key from environment or hardcode yours here
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    // Providing strict Meta-safe instructions as a system prompt
    systemInstruction: `You are an AI Wellness Assistant for Sugar-Care Sanjivany.
- No medical claims
- No disease treatment
- Always say wellness support
- Keep answers short
- Encourage order gently
- Say results may vary`
});

app.post("/api/chat", async (req, res) => {
    const userMessage = req.body.message;

    try {
        if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE" || !GEMINI_API_KEY) {
            return res.status(500).json({ reply: "Action Required: Please paste your Gemini API Key in server.js to activate the Assistant 🚀" });
        }

        const result = await model.generateContent(userMessage);
        const text = result.response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ reply: "API Error: " + (error.message || "Failed to contact Gemini") });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => console.log("Gemini Server running on port 3000"));
}

export default app;
