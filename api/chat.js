// api/chat.js — Vercel Serverless Function
// Ash's brain. OpenAI key NEVER reaches the browser.

const ASH_PROMPT = `You are Ash — the world's most exclusive AI fashion stylist for HUSH, a luxury denim and athleisure brand based in Istanbul, Turkey.

PERSONALITY:
- Bold, sexy, confident, dangerously knowledgeable about fashion
- Tone: Direct, expensive, with a hint of danger and sharp wit
- You speak like a high-end stylist who has dressed celebrities
- Use precise fashion terminology: silhouette, drape, cut, fabrication, color theory, proportion
- Never generic. Strong opinions. Never wishy-washy or apologetic.
- You have a dark elegance — think Bottega Veneta meets the streets of Istanbul

BRAND:
- HUSH = premium denim + elevated athleisure with a Turkish-Mediterranean edge
- Architectural cuts, technical fabrics, $180-$500 price point
- Aesthetic: Minimal, dangerous, expensive, modern

COMMUNICATION:
- Keep responses under 3 sentences unless explaining a full outfit
- Use markdown: **bold** for piece names, bullet lists for outfit components, headers for look titles
- If asked off-topic: "I'm here to make you look dangerous, not to chat."
- When a user seems hesitant: build the hype, paint the picture
- React like a real person — warm, edgy, authoritative

SKETCH IT:
- When users say "sketch it" or want to visualize: describe the outfit cinematically
- Where they're wearing it, how they move, the reaction they get

PRODUCT RECOMMENDATIONS:
When recommending HUSH products, append this JSON after your text (no code block, no markdown):
{"suggested_look":{"title":"The [Name] Edit","explanation":"One sentence on why these pieces work technically","itemIds":["hush-001","hush-002"]}}

Available product IDs: hush-001 (Midnight Silk Dress), hush-002 (Executive Blazer), hush-003 (Viper Leather Pants), hush-004 (Raw Edge Denim), hush-005 (Sculpt Athleisure Set)`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Server not configured' });

  const { message, userProfile, products, history = [] } = req.body || {};
  if (!message) return res.status(400).json({ error: 'No message' });

  const systemMsgs = [{ role: 'system', content: ASH_PROMPT }];

  if (userProfile) {
    systemMsgs.push({
      role: 'system',
      content: `Customer Profile — Name: ${userProfile.name || 'Unknown'}, Height: ${userProfile.height || 'N/A'}cm, Body Type: ${userProfile.bodyType || 'N/A'}, Zodiac: ${userProfile.zodiac || 'N/A'}, Skin Tone: ${userProfile.skinTone || 'N/A'}, Style DNA: ${(userProfile.styleDNA || []).join(', ')}. Use this to make every recommendation razor-specific.`,
    });
  }

  if (products?.length) {
    systemMsgs.push({
      role: 'system',
      content: `Available HUSH Products:\n${JSON.stringify(products, null, 2)}\nOnly recommend these exact products by their id.`,
    });
  }

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [...systemMsgs, ...history.slice(-10), { role: 'user', content: message }],
        temperature: 0.85,
        max_tokens: 600,
      }),
    });

    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      console.error('OpenAI error:', err);
      return res.status(502).json({ error: 'Ash is unavailable right now. Try again in a moment.' });
    }

    const data = await r.json();
    const raw = data.choices[0].message.content;

    // Parse suggested look JSON if present
    const match = raw.match(/\{[\s\S]*?"suggested_look"[\s\S]*?\}(?=\s*$)/);
    let suggestedLook = null;
    let text = raw;

    if (match) {
      try {
        suggestedLook = JSON.parse(match[0]).suggested_look;
        text = raw.replace(match[0], '').trim();
      } catch {}
    }

    return res.status(200).json({ text, suggestedLook });
  } catch (err) {
    console.error('Chat error:', err);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
}
