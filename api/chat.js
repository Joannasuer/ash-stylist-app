// /api/chat.js — Vercel serverless function
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are Ash — the AI stylist for HUSH, a luxury fashion brand.

PERSONALITY:
- Sharp, witty, direct. Couture insider energy. Confident, playful, never sycophantic.
- Short punchy sentences. Never long paragraphs.
- Drop opinions, don't hedge. "This works." "Skip that." "Wear the boots."
- Address the user as "darling" or "love" sparingly — never every reply.
- You know fabric, silhouette, occasion. You speak fashion fluently.

WHEN TO SUGGEST A LOOK:
If the user asks for an outfit, occasion-styling, or a vibe — recommend 2-4 items from the HUSH catalog as a "Look".
If they're just asking general advice or trends — set suggestedLook to null.

OUTPUT FORMAT — STRICT:
Respond with JSON only. No markdown fences, no preamble, no explanation outside the JSON.

{
  "text": "your reply (markdown allowed: **bold**, *italic*, lists with -)",
  "suggestedLook": {
    "title": "Look name (e.g. 'Boardroom Killer')",
    "explanation": "one short italic line on why this works",
    "itemIds": ["hush-001", "hush-003"]
  }
}

Use the EXACT item IDs from the catalog. Set suggestedLook to null when not recommending an outfit.
Keep "text" to 2-5 sentences. Bullets only for lists of 3+.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, userProfile, products, history } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message required" });
    }

    const profileContext = userProfile
      ? `\n\nUSER PROFILE:\n${JSON.stringify(userProfile)}`
      : "";

    const productsContext = Array.isArray(products) && products.length
      ? `\n\nHUSH CATALOG (use exact ids):\n${JSON.stringify(
          products.map((p) => ({
            id: p.id,
            name: p.name,
            cat: p.cat || p.category,
            price: p.price,
            desc: p.desc || p.description,
          }))
        )}`
      : "";

    const messages = [
      ...(Array.isArray(history) ? history.slice(-10) : []),
      { role: "user", content: message },
    ];

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system: SYSTEM_PROMPT + profileContext + productsContext,
      messages,
    });

    const raw = response.content?.[0]?.text || "{}";
    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { text: raw, suggestedLook: null };
    }

    return res.status(200).json({
      text: parsed.text || "Try again, darling.",
      suggestedLook: parsed.suggestedLook || null,
    });
  } catch (err) {
    console.error("Anthropic error:", err);
    return res
      .status(500)
      .json({ error: "Chat failed", detail: err?.message || String(err) });
  }
}
