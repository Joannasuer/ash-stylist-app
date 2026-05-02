// src/utils/sketch.js

// Generate a fashion sketch via Pollinations.ai (free, no API key)
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

// Save a generated sketch to the user's history
export async function saveSketchToDatabase(userId, prompt, designOptions, imageUrl) {
  const { supabase } = await import('./supabase');

  try {
    const { data, error } = await supabase
      .from('sketches')
      .insert({
        user_id: userId,
        prompt,
        design_options: designOptions,
        image_url: imageUrl,
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

// Load the user's sketch history
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
