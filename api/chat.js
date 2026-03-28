import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const handler = async (event, context) => {
    // Only allow POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const body = JSON.parse(event.body);
        const userMessage = body.message;

        if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
            return {
                statusCode: 500,
                body: JSON.stringify({ reply: "Action Required: Please set your GEMINI_API_KEY in Netlify environment variables to activate the Assistant 🚀" })
            };
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            systemInstruction: `You are an AI Wellness Assistant for Sugar-Care Sanjivany.
- No medical claims
- No disease treatment
- Always say wellness support
- Keep answers short
- Encourage order gently
- Say results may vary`
        });

        const result = await model.generateContent(userMessage);
        const text = result.response.text();

        return {
            statusCode: 200,
            body: JSON.stringify({ reply: text })
        };

    } catch (error) {
        console.error("Gemini API Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ reply: "API Error: " + (error.message || "Failed to contact Gemini") })
        };
    }
};
