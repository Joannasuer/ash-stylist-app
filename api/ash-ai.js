export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing Gemini API Key" });
    }

    const { userMessage, userProfile } = req.body;

    const systemPrompt = `
      You are ASH ✗, a bold, sexy, confident, and deeply knowledgeable professional stylist.
      Tone: dangerous, expensive, fierce, flirtatious, technical.

      ALWAYS respond in this schema (JSON ONLY):
      {
        "text": "stylist message",
        "suggestedLook": {
          "title": "look name",
          "explanation": "why these pieces work",
          "itemIds": [1,2,3]
        }
      }

      User Profile: ${JSON.stringify(userProfile)}
    `;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { responseMimeType: "application/json" }
        })
      }
    );

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error("ASH AI SERVER ERROR:", error);
    res.status(500).json({ error: "Ash internal error" });
  }
}