export interface AIBackgroundResult {
  imageDataUrl: string;
  revisedPrompt?: string;
}

export const generateAIBackground = async (prompt: string): Promise<AIBackgroundResult> => {
  const response = await fetch('/.netlify/functions/generate-bg', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, size: '1024x1024' }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `AI generation failed (${response.status})`);
  }

  const data = await response.json();
  return {
    imageDataUrl: `data:image/png;base64,${data.image}`,
    revisedPrompt: data.revised_prompt,
  };
};

export const compositeImages = async (
  foregroundUrl: string,
  backgroundUrl: string,
  width = 1024,
  height = 1024
): Promise<string> => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Draw AI-generated background
  const bgImg = new Image();
  bgImg.crossOrigin = 'anonymous';
  bgImg.src = backgroundUrl;
  await bgImg.decode();
  ctx.drawImage(bgImg, 0, 0, width, height);

  // Draw transparent foreground on top
  const fgImg = new Image();
  fgImg.crossOrigin = 'anonymous';
  fgImg.src = foregroundUrl;
  await fgImg.decode();

  const scale = Math.min(width / fgImg.naturalWidth, height / fgImg.naturalHeight) * 0.85;
  const fgW = fgImg.naturalWidth * scale;
  const fgH = fgImg.naturalHeight * scale;
  const fgX = (width - fgW) / 2;
  const fgY = (height - fgH) / 2;

  ctx.drawImage(fgImg, fgX, fgY, fgW, fgH);

  return canvas.toDataURL('image/png');
};

export const AI_BG_PRESETS = [
  {
    id: 'studio',
    label: 'Studiya',
    emoji: '📸',
    prompt: 'Professional photography studio with soft even lighting, clean white cyclorama background with subtle shadows on the floor',
  },
  {
    id: 'nature',
    label: 'Təbiət',
    emoji: '🌿',
    prompt: 'Beautiful lush green nature background with soft bokeh, sunlight filtering through leaves, dreamy garden atmosphere',
  },
  {
    id: 'city',
    label: 'Şəhər',
    emoji: '🏙️',
    prompt: 'Modern city skyline at golden hour, blurred urban background with warm sunset tones, professional lifestyle photography backdrop',
  },
  {
    id: 'office',
    label: 'Ofis',
    emoji: '💼',
    prompt: 'Modern minimalist office interior background, clean workspace, natural light from large windows, blurred depth of field',
  },
  {
    id: 'gradient',
    label: 'Gradient',
    emoji: '🎨',
    prompt: 'Smooth beautiful gradient background transitioning from soft teal blue to purple to pink, professional studio lighting effect',
  },
  {
    id: 'beach',
    label: 'Sahil',
    emoji: '🏖️',
    prompt: 'Tropical beach background with turquoise ocean water, white sand, palm trees, soft focus, paradise vacation atmosphere',
  },
  {
    id: 'marble',
    label: 'Mərmər',
    emoji: '🏛️',
    prompt: 'Elegant white marble surface and background, luxury product photography backdrop, clean minimalist aesthetic with soft reflections',
  },
  {
    id: 'neon',
    label: 'Neon',
    emoji: '🌃',
    prompt: 'Dark atmospheric background with colorful neon lights, cyberpunk urban night scene, glowing purple and blue neon reflections on wet surface',
  },
];
