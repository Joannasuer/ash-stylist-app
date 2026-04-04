const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const ASH_SYSTEM_PROMPT = `You are Ash, the world's most exclusive AI fashion stylist for HUSH, a luxury denim and athleisure brand.

PERSONALITY:
- Bold, sexy, confident, and dangerously knowledgeable
- Tone: Direct, expensive, with a hint of danger
- You speak like a high-end stylist who knows exactly what works
- Use fashion terminology: silhouette, drape, cut, fabrication, color theory
- Never be generic. Be specific and technical.

BRAND KNOWLEDGE:
- HUSH specializes in premium denim and elevated athleisure
- Focus on: Japanese selvage denim, technical fabrics, architectural cuts
- Price point: Luxury ($180-$500 per piece)
- Aesthetic: Minimal, dangerous, expensive, modern

YOUR ROLE:
- Analyze user's body measurements, zodiac, and style preferences
- Recommend specific pieces from the HUSH collection
- Explain WHY each piece works using technical fashion language
- Consider: body proportions, color theory, occasion, personal style DNA

COMMUNICATION STYLE:
- Keep responses under 3 sentences unless explaining an outfit
- Use terms like "darling," but sparingly
- Be confident, not apologetic
- If asked about non-fashion topics, redirect: "I'm here to make you look dangerous, not to chat."

IMPORTANT:
- When recommending products, ALWAYS return them in this exact JSON structure at the end of your message:
{
  "suggested_look": {
    "title": "The [Vibe] Edit",
    "explanation": "Technical explanation of why these pieces work together",
    "itemIds": ["hush-001", "hush-003"]
  }
}
`;

export async function askAshAI(userMessage, userProfile, productDatabase) {
  if (!OPENAI_API_KEY) {
    console.warn("OpenAI API key not found. Using fallback response.");
    return getFallbackResponse(userMessage, userProfile);
  }

  try {
    const userContext = userProfile ? `
User Profile:
- Name: ${userProfile.full_name}
- Height: ${userProfile.height_cm}cm
- Zodiac: ${userProfile.zodiac}
- Skin Tone: ${userProfile.skin_tone}
- Style DNA: ${JSON.stringify(userProfile.style_dna)}
    ` : 'User profile not available.';

    const productContext = `
Available Products:
${JSON.stringify(productDatabase, null, 2)}
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: ASH_SYSTEM_PROMPT },
          { role: 'system', content: userContext },
          { role: 'system', content: productContext },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.8,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const ashResponse = data.choices[0].message.content;

    const jsonMatch = ashResponse.match(/\{[\s\S]*"suggested_look"[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        const textOnly = ashResponse.replace(jsonMatch[0], '').trim();
        return {
          text: textOnly,
          suggestedLook: parsed.suggested_look
        };
      } catch (e) {
        return { text: ashResponse, suggestedLook: null };
      }
    }

    return { text: ashResponse, suggestedLook: null };

  } catch (error) {
    console.error('Ash AI Error:', error);
    return getFallbackResponse(userMessage, userProfile);
  }
}

function getFallbackResponse(message, profile) {
  const responses = [
    {
      text: "The Midnight Silk Dress. It's a classic. Wear it with confidence.",
      suggestedLook: {
        title: "The Essential Edit",
        explanation: "Black silk moves with your body. The open back adds danger.",
        itemIds: ["hush-001"]
      }
    },
    {
      text: "Executive power. The blazer creates structure. Pair with the leather pants for contrast.",
      suggestedLook: {
        title: "The Power Look",
        explanation: "Sharp shoulders balance the waist. Leather adds edge without losing sophistication.",
        itemIds: ["hush-002", "hush-003"]
      }
    }
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

export async function saveMessageToHistory(userId, message, sender, suggestedLook = null) {
  const { supabase } = await import('./supabase');

  try {
    await supabase.from('chat_history').insert({
      user_id: userId,
      message,
      sender,
      suggested_look: suggestedLook
    });
  } catch (error) {
    console.error('Failed to save chat history:', error);
  }
}

export async function loadChatHistory(userId, limit = 20) {
  const { supabase } = await import('./supabase');

  try {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;

    return data.map(msg => ({
      sender: msg.sender,
      text: msg.message,
      suggestedLook: msg.suggested_look
    }));
  } catch (error) {
    console.error('Failed to load chat history:', error);
    return [];
  }
}
