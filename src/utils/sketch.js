const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function generateSketch(prompt, designOptions, userProfile) {
  const fabric = designOptions?.fabric || "silk";
  const silhouette = designOptions?.silhouette || "fitted";

  const fullPrompt = [
    "high-fashion couture sketch",
    `${silhouette} silhouette`,
    `${fabric} fabric`,
    prompt,
    "editorial fashion illustration",
    "elegant runway pose",
    "black and white pencil rendering",
    "minimalist white background",
    "professional croquis style",
  ].join(", ");

  const seed = Math.floor(Math.random() * 1_000_000);
  const url =
    "https://image.pollinations.ai/prompt/" +
    encodeURIComponent(fullPrompt) +
    `?width=600&height=800&model=flux&nologo=true&seed=${seed}`;

  // Warm-up request so the image is ready when the <img> tag loads it
  try {
    await fetch(url, { method: "HEAD" });
  } catch {}

  return url;
}

  try {
    const enhancedPrompt = buildSketchPrompt(prompt, designOptions, userProfile);

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        n: 1,
        size: '1024x1792',
        quality: 'standard',
        style: 'natural'
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI Image API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data[0].url;

  } catch (error) {
    console.error('Sketch generation error:', error);
    return getSimulationSketch();
  }
}

function buildSketchPrompt(userPrompt, options, profile) {
  let prompt = `Professional fashion design sketch, technical illustration style. ${userPrompt}. `;
  prompt += `Fabric: ${options.fabric}. Silhouette: ${options.silhouette}. `;
  prompt += `Clean lines, minimalist, haute couture aesthetic. `;
  prompt += `Black and white sketch on white background, like a designer's portfolio piece. `;
  prompt += `High fashion, editorial quality, sophisticated and modern.`;

  if (profile?.zodiac) {
    const zodiacStyles = {
      'Aries': 'bold, angular cuts',
      'Taurus': 'luxurious fabrics, sensual draping',
      'Gemini': 'versatile, layered design',
      'Cancer': 'flowing, protective silhouette',
      'Leo': 'dramatic, statement-making',
      'Virgo': 'precise tailoring, clean lines',
      'Libra': 'balanced, elegant proportions',
      'Scorpio': 'mysterious, powerful structure',
      'Sagittarius': 'adventurous, unconventional',
      'Capricorn': 'structured, timeless',
      'Aquarius': 'avant-garde, futuristic',
      'Pisces': 'ethereal, fluid movement'
    };

    if (zodiacStyles[profile.zodiac]) {
      prompt += ` Design elements inspired by ${profile.zodiac}: ${zodiacStyles[profile.zodiac]}.`;
    }
  }

  return prompt;
}

function getSimulationSketch() {
  const sketches = [
    "https://images.unsplash.com/photo-1576246342838-8e68449c4701?w=800&q=80",
    "https://i.pinimg.com/736x/87/42/1d/87421d01f80f12d2a44d18392109866c.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/5201c184439937.5d5c414995f55.jpg"
  ];
  return sketches[Math.floor(Math.random() * sketches.length)];
}

export async function saveSketchToDatabase(userId, prompt, designOptions, imageUrl) {
  const { supabase } = await import('./supabase');

  try {
    const { data, error } = await supabase
      .from('sketches')
      .insert({
        user_id: userId,
        prompt,
        design_options: designOptions,
        image_url: imageUrl
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to save sketch:', error);
    return null;
  }
}

export async function getUserSketches(userId, limit = 10) {
  const { supabase } = await import('./supabase');

  try {
    const { data, error } = await supabase
      .from('sketches')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to load sketches:', error);
    return [];
  }
}
