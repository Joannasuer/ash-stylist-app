import { PRODUCT_DATABASE } from './constants';

// 🔒 SECURE API CONNECTION
const apiKey = ""; 

export async function askAshAI(userMessage, userProfile) {
  if (!apiKey) {
     if (userProfile) {
       const isTall = parseInt(userProfile.height) > 170;
       let advice = `Okay ${userProfile.name}, let's get technical. `;
       if (isTall) advice += `At ${userProfile.height}cm, you can carry volume. `;
       else advice += `We need to elongate the vertical line. `;
       advice += `Since you asked about "${userMessage}", I've pulled the Midnight Slip.`;
       return {
          text: advice,
          suggestedLook: {
             title: "The " + userProfile.zodiac + " Edit",
             explanation: "Curated specifically for your measurements and color palette.",
             itemIds: [1, 4, 3]
          }
       };
     }
     return {
        text: "I'm running in demo mode right now, darling. But I'd recommend the Midnight Slip. It's a classic.",
        suggestedLook: { title: "Demo Look", explanation: "Classic staples.", itemIds: [1, 4] }
     };
  }

  const systemPrompt = `
    You are Ash, a bold, sexy, direct, and highly professional fashion stylist for the brand HUSH.
    Tone: "Fire", confident, flirtatious, knowledgeable.
    User Profile: ${userProfile ? JSON.stringify(userProfile) : "Unknown"}
    Products: ${JSON.stringify(PRODUCT_DATABASE)}
    Instructions: Analyze request. Select 2-4 items. Explain WHY using technical terms. Return JSON ONLY.
    Response Schema: { "text": "string", "suggestedLook": { "title": "string", "explanation": "string", "itemIds": [numbers] } }
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userMessage }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!response.ok) throw new Error('Gemini API failed');
    const data = await response.json();
    let rawText = data.candidates[0].content.parts[0].text;
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(rawText);
  } catch (error) {
    console.error("Ash AI Error:", error);
    return {
      text: "Darling, the fashion signal is weak. But I know you'd look good in black. Try asking again?",
      suggestedLook: null
    };
  }
}

export async function generateFashionSketch(prompt, fabric, silhouette) {
  if (!apiKey) return null;
  const fullPrompt = `Fashion design sketch, professional technical drawing. ${prompt}. Fabric: ${fabric}. Silhouette: ${silhouette}. High fashion illustration style, white background, clean lines.`;
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt: fullPrompt }],
        parameters: { sampleCount: 1 }
      })
    });
    if (!response.ok) throw new Error('Imagen API failed');
    const data = await response.json();
    return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
  } catch (error) {
    console.error("Imagen Error:", error);
    return null;
  }
}