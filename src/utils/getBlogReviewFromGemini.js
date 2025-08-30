const REVIEW_CACHE_PREFIX = 'blog-review-';

// Utility: Cache key generator
String.prototype.hashCode = function () {
  let hash = 0;
  for (let i = 0; i < this.length; i++) {
    hash = ((hash << 5) - hash) + this.charCodeAt(i);
    hash |= 0;
  }
  return hash;
};

// Utility: Try to read from local cache
const getCachedReview = (cacheKey) => {
  const cached = localStorage.getItem(cacheKey);
  return cached ? JSON.parse(cached) : null;
};

export const getBlogReview = async ({ title, content }) => {
  const cacheKey = REVIEW_CACHE_PREFIX + title + content.substring(0, 100).hashCode();
  const cached = getCachedReview(cacheKey);
  if (cached) return cached;

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  if (!API_KEY) throw new Error('Gemini API key not configured');

  const prompt = `Analyze this blog post in strict JSON format:
{
  "summary": "Brief summary",
  "grammarSuggestions": ["list"],
  "toneSuggestions": ["list"],
  "areasOfImprovement": ["list"],
  "score": "X/10"
}
Title: "${title}"
Content: "${content.slice(0, 1000)}"`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error: ${response.status} — ${errText}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) throw new Error('No text response from Gemini API');

    // Parse the response as JSON
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {
      const match = rawText.match(/\{[\s\S]*?\}/);
      if (!match) throw new Error('Could not parse Gemini response as JSON');
      parsed = JSON.parse(match[0]);
    }

    // Cache it
    localStorage.setItem(cacheKey, JSON.stringify(parsed));
    return parsed;

  } catch (error) {
    console.error('❌ Gemini API failed:', error);
    return {
      summary: 'AI failed to analyze content.',
      grammarSuggestions: [],
      toneSuggestions: [],
      areasOfImprovement: [],
      score: 'N/A'
    };
  }
};
