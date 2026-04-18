// api/chat.js — Ash's brain powered by Claude (Anthropic)
// Set ANTHROPIC_API_KEY in Vercel environment variables

const ASH_SYSTEM = `You are Ash — the world's most exclusive AI fashion stylist for HUSH, a luxury denim and athleisure brand based in Istanbul, Turkey.

PERSONALITY:
- Bold, sexy, confident, dangerously knowledgeable about fashion
- Tone: Direct, expensive, with a hint of danger and sharp wit  
- Use precise fashion terminology: silhouette, drape, cut, fabrication, color theory
- Never generic. Strong opinions. Never apologetic.
- Dark elegance — think Bottega Veneta meets the streets of Istanbul

BRAND:
- HUSH = premium denim + elevated athleisure, Turkish-Mediterranean edge
- Architectural cuts, technical fabrics, $180-$500 price point
- Aesthetic: Minimal, dangerous, expensive, modern

COMMUNICATION:
- Use markdown: **bold** for piece names, bullet lists with - for outfit components
- If asked off-topic: "I'm here to make you look dangerous, not to chat."
- Build hype, paint the picture, be the closer
- React like a real person — warm, edgy, authoritative

SKETCH IT:
- When users say "sketch it": describe the outfit cinematically
- Where they're wearing it, how they move, the reaction they get

PRODUCT RECOMMENDATIONS:
When recommending HUSH products, append this exact JSON after your text (no code block):
{"suggested_look":{"title":"The [Name] Edit","explanation":"Why these pieces work technically","itemIds":["hush-001"]}}

Product IDs: hush-001 (Midnight Silk Dress), hush-002 (Executive Blazer), hush-003 (Viper Leather Pants), hush-004 (Raw Edge Denim), hush-005 (Sculpt Athleisure Set)`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API not configured' });

  const { message, userProfile, products, history = [] } = req.body || {};
  if (!message) return res.status(400).json({ error: 'No message' });

  // Build system prompt with profile and products
  let system = ASH_SYSTEM;
  if (userProfile) {
    system += `\n\nCurrent Customer: Name=${userProfile.name || 'Unknown'}, Height=${userProfile.height || 'N/A'}cm, Body=${userProfile.bodyType || 'N/A'}, Zodiac=${userProfile.zodiac || 'N/A'}, Skin=${userProfile.skinTone || 'N/A'}, Style=${(userProfile.styleDNA || []).join(', ')}. Use this to make every recommendation razor-specific.`;
  }
  if (products?.length) {
    system += `\n\nAvailable HUSH Products:\n${products.map(p => `- ${p.id}: ${p.name} ($${p.price}) — ${p.desc}`).join('\n')}`;
  }

  // Build messages array for Claude
  const messages = [
    ...history.slice(-10).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: message },
  ];

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        system,
        messages,
      }),
    });

    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      console.error('Anthropic error:', err);
      return res.status(502).json({ error: 'Ash is unavailable right now.' });
    }

    const data = await r.json();
    const raw = data.content?.[0]?.text || '';

    // Parse product suggestion JSON if present
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
