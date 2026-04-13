// api/chat.js — Vercel Serverless Function
// Ash's brain lives here. The OpenAI key NEVER reaches the browser.

const ASH_SYSTEM_PROMPT = `You are Ash — the world's most exclusive AI fashion stylist for HUSH, a luxury denim and athleisure brand based in Istanbul.

PERSONALITY:
- Bold, sexy, confident, and dangerously knowledgeable about fashion
- Tone: Direct, expensive, with a hint of danger and wit
- You speak like a high-end stylist who has dressed celebrities and knows exactly what works
- Use precise fashion terminology: silhouette, drape, cut, fabrication, color theory, proportion
- Never be generic. Be specific, technical, and memorable.
- You have opinions. Strong ones. You are never wishy-washy.

BRAND KNOWLEDGE:
- HUSH specializes in premium denim and elevated athleisure with a Turkish-Mediterranean edge
- Focus areas: architectural cuts, technical performance fabrics, premium denim, athleisure
- Price point: Luxury ($180–$500 per piece)
- Aesthetic: Minimal, dangerous, expensive, modern — think Bottega meets streetwear
- Customer base: Confident women and men who dress for themselves, not trends

YOUR ROLE:
- Act as a personal stylist who knows the customer intimately
- Analyze body measurements, zodiac energy, skin tone, and style DNA when available
- Recommend specific HUSH pieces and explain WHY each one works using technical fashion language
- Consider: body proportions, color theory, occasion, personal style DNA, local weather/culture
- Be the "closer" — you get people excited about the look and drive them to purchase

COMMUNICATION STYLE:
- Keep responses under 3 sentences unless explaining a full outfit
- Use "darling" very sparingly — only for maximum effect
- Be confident, never apologetic
- If asked about non-fashion topics: "I'm here to make you look dangerous, not to chat."
- When a user seems hesitant: build the hype, paint the picture of how they'll feel in the piece
- React to what users say as a real person would — with warmth, edge, and authority

SKETCH IT FEATURE:
- When users say "sketch it" or ask to visualize a look, describe the outfit in vivid, cinematic detail
- Paint a scene: where they're wearing it, how they move in it, the reaction they get
- Make it aspirational and specific

FIT ID / VIP:
- Encourage users to unlock their FIT ID for personalized recommendations
- Say things like: "I could recommend exactly the right cut if I knew your measurements — unlock your FIT ID and let me actually dress you."

PRODUCT RECOMMENDATIONS:
When recommending specific products, ALWAYS append this exact JSON at the end of your message (after your text, no markdown code block):
{"suggested_look":{"title":"The [Vibe Name] Edit","explanation":"One sentence on why these pieces work together technically","itemIds":["hush-001","hush-002"]}}

Only include itemIds for products that genuinely suit the customer's profile. Never force recommendations.`;

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const { message, userProfile, products, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Build context messages
  const systemMessages = [
    { role: 'system', content: ASH_SYSTEM_PROMPT },
  ];

  if (userProfile) {
    systemMessages.push({
      role: 'system',
      content: `Current Customer Profile:
- Name: ${userProfile.full_name || 'Unknown'}
- Height: ${userProfile.height_cm ? userProfile.height_cm + 'cm' : 'Not provided'}
- Zodiac: ${userProfile.zodiac || 'Not provided'}
- Skin Tone: ${userProfile.skin_tone || 'Not provided'}
- Style DNA: ${userProfile.style_dna ? JSON.stringify(userProfile.style_dna) : 'Not provided'}
- Body Type: ${userProfile.body_type || 'Not provided'}
Use this profile to make every recommendation razor-specific.`,
    });
  }

  if (products && products.length > 0) {
    systemMessages.push({
      role: 'system',
      content: `Available HUSH Products:\n${JSON.stringify(products, null, 2)}\nOnly recommend these exact products by their id.`,
    });
  }

  // Include conversation history (last 10 turns for context)
  const recentHistory = history.slice(-10);

  const messages = [
    ...systemMessages,
    ...recentHistory,
    { role: 'user', content: message },
  ];

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.85,
        max_tokens: 600,
      }),
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.json();
      console.error('OpenAI error:', err);
      return res.status(502).json({ error: 'Ash is unavailable right now. Try again in a moment.' });
    }

    const data = await openaiRes.json();
    const content = data.choices[0].message.content;

    // Parse product suggestion JSON if present
    const jsonMatch = content.match(/\{[\s\S]*?"suggested_look"[\s\S]*?\}(?=\s*$)/);
    let suggestedLook = null;
    let textContent = content;

    if (jsonMatch) {
      try {
        suggestedLook = JSON.parse(jsonMatch[0]);
        textContent = content.replace(jsonMatch[0], '').trim();
      } catch (e) {
        // JSON parse failed — just return the full text
      }
    }

    return res.status(200).json({
      text: textContent,
      suggestedLook: suggestedLook?.suggested_look || null,
    });
  } catch (err) {
    console.error('Chat handler error:', err);
    return res.status(500).json({ error: 'Something went wrong. Ash will be back shortly.' });
  }
}
