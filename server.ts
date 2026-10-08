import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the server environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// 1. Generate full structured recipe & SEO payload
app.post('/api/generate-recipe', async (req, res) => {
  try {
    const { topic, niche, dietary, targetAudience } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Recipe topic is required' });
    }

    const ai = getGeminiClient();
    const prompt = `You are the core programmatic SEO culinary intelligence of PinRecipe Scale Engine (Scale v4.0).
Generate an exhaustive, high-converting, Google-compliant Recipe structure for:
Topic: "${topic}"
Niche/Category: "${niche || 'General Dinners'}"
Dietary Requirements: "${dietary || 'None specified'}"
Target Audience: "${targetAudience || 'Food lovers seeking fast, delicious meals'}"

Return ONLY valid JSON matching this schema without markdown code blocks:
{
  "title": "Full Catchy SEO Recipe Title",
  "slug": "url-friendly-slug",
  "metaDescription": "Engaging 140-160 character meta description for Google Search.",
  "focusKeyword": "primary focus keyword",
  "prepTime": "15 mins",
  "cookTime": "25 mins",
  "totalTime": "40 mins",
  "servings": "4 servings",
  "calories": 420,
  "difficulty": "Easy",
  "macros": {
    "protein": "32g",
    "carbs": "28g",
    "fat": "14g",
    "fiber": "5g"
  },
  "ingredients": [
    { "item": "ingredient name", "amount": "quantity with units", "notes": "optional prep detail" }
  ],
  "instructions": [
    { "step": 1, "title": "Step summary", "text": "Detailed action-oriented instruction", "timerMinutes": 5 }
  ],
  "chefTips": [
    "Expert culinary tip 1",
    "Expert culinary tip 2"
  ],
  "macroPhotoPrompt": "Macro close-up food photography prompt describing steam, glistening textures, rustic props, studio lighting, Pinterest 2:3 vertical aspect",
  "pinterestPin": {
    "title": "High-CTR Pinterest Pin Title (e.g. The Crispiest 20-Min Garlic Butter Salmon)",
    "description": "Engaging Pinterest description with rich sensory words, hook, and call to action.",
    "hashtags": ["#easyrecipes", "#dinnerideas", "#quickmeals"],
    "overlayHeadline": "3-5 word headline for vertical pin overlay image"
  },
  "schemaJsonLd": {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": "Recipe Title",
    "description": "Recipe summary",
    "prepTime": "PT15M",
    "cookTime": "PT25M",
    "totalTime": "PT40M",
    "recipeYield": "4 servings",
    "recipeCategory": "${niche || 'Dinner'}",
    "recipeCuisine": "American",
    "keywords": "recipe, dinner, easy"
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ text: prompt }],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error generating recipe:', error);
    res.status(500).json({
      error: error.message || 'Failed to synthesize recipe with Gemini AI',
    });
  }
});

// 2. Generate programmatic keyword batches for a niche
app.post('/api/generate-keywords', async (req, res) => {
  try {
    const { niche, count = 5 } = req.body;
    const ai = getGeminiClient();

    const prompt = `Generate ${count} high-intent, trending programmatic recipe search keywords for the niche: "${niche || 'Healthy Air Fryer'}".
For each item, provide:
- topic: recipe name
- targetNiche: categorization
- estimatedVolume: monthly search volume estimate (e.g. 18.5k/mo)
- difficultyScore: percentage difficulty (e.g. 24%)
- pinPotential: "High" | "Viral" | "Evergreen"
- dietary: relevant tag

Return ONLY a valid JSON array of objects without markdown wrappers.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ text: prompt }],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    res.json({ success: true, keywords: parsed });
  } catch (error: any) {
    console.error('Error generating keywords:', error);
    res.status(500).json({ error: error.message || 'Failed to generate keywords' });
  }
});

const resolveImageBase64 = (imgSource: string) => {
  if (!imgSource) return undefined;
  if (imgSource.startsWith('data:') || imgSource.startsWith('http://') || imgSource.startsWith('https://')) {
    return imgSource;
  }
  const cleaned = imgSource.replace(/^\//, '');
  const candidatePath = path.resolve(__dirname, cleaned);
  if (fs.existsSync(candidatePath)) {
    const ext = path.extname(candidatePath).replace('.', '') || 'jpeg';
    const buffer = fs.readFileSync(candidatePath);
    return `data:image/${ext === 'jpg' ? 'jpeg' : ext};base64,${buffer.toString('base64')}`;
  }
  return undefined;
};

// 3. WordPress REST & AutoSync Plugin Verification Endpoint
app.post('/api/test-wordpress', async (req, res) => {
  const { url, apiKey } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'WordPress URL is required' });
  }

  const cleanUrl = url.replace(/\/$/, '');
  const siteName = cleanUrl.replace(/^https?:\/\//, '');

  try {
    const start = Date.now();
    // Test base REST API
    const pingRes = await fetch(`${cleanUrl}/wp-json/`);
    const pingMs = Date.now() - start;

    if (!pingRes.ok) {
      return res.status(502).json({
        error: `Could not reach WordPress at ${cleanUrl}. Server responded with ${pingRes.status}.`,
      });
    }

    let pluginActive = false;
    let authValid = false;
    let authMessage = '';

    // Test AutoSync Plugin endpoint
    const pluginCheck = await fetch(`${cleanUrl}/wp-json/autosync/v1/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'x-sync-key': apiKey.trim() } : {}),
      },
      body: JSON.stringify({}),
    });

    if (pluginCheck.status !== 404) {
      pluginActive = true;
      if (pluginCheck.status === 403) {
        authValid = false;
        authMessage = apiKey
          ? 'API Key rejected. Please re-check the key from WP Admin → AutoSync.'
          : 'Plugin is active! Ready for your API Secret Key.';
      } else if (pluginCheck.status === 400 || pluginCheck.status === 200) {
        // 400 with "Empty JSON payload" means auth succeeded!
        authValid = true;
        authMessage = 'AutoSync Plugin authenticated successfully!';
      }
    }

    // Fetch live categories from WordPress
    let categories: Array<{ id: number; name: string; slug: string; count: number }> = [];
    try {
      const catRes = await fetch(`${cleanUrl}/wp-json/wp/v2/categories?per_page=20`);
      if (catRes.ok) {
        const rawCats = await catRes.json();
        categories = rawCats.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          count: c.count,
        }));
      }
    } catch {
      // ignore taxonomy fetch errors
    }

    res.json({
      connected: true,
      siteName,
      endpoint: `${cleanUrl}/wp-json/autosync/v1/import`,
      pluginActive,
      authValid,
      authMessage,
      pingMs,
      categories: categories.length ? categories : [
        { id: 1, name: 'Recipes', slug: 'recipes', count: 0 },
        { id: 2, name: 'Quick & Easy Dinners', slug: 'quick-dinners', count: 0 },
        { id: 3, name: 'High-Protein & Keto', slug: 'keto-recipes', count: 0 },
        { id: 4, name: 'Moroccan & Tagine Classics', slug: 'moroccan-cuisine', count: 0 },
        { id: 5, name: 'Decadent Desserts', slug: 'desserts', count: 0 },
      ],
    });
  } catch (err: any) {
    console.error('WordPress ping error:', err);
    res.status(500).json({ error: err.message || 'Failed to ping WordPress endpoint' });
  }
});

// 4. AutoSync Plugin Article Publisher Endpoint
app.post('/api/sync-wordpress-plugin', async (req, res) => {
  try {
    const { url, apiKey, articles, defaultStatus } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'WordPress URL is required' });
    }
    if (!apiKey) {
      return res.status(400).json({
        error: 'AutoSync API Key is required. Please copy the API Secret Key from WP Admin → AutoSync (https://foodsprepared.wasmer.app/wp-admin/admin.php?page=autosync-settings).'
      });
    }

    const cleanUrl = url.replace(/\/$/, '');
    const endpoint = `${cleanUrl}/wp-json/autosync/v1/import`;

    // Map recipes to Auto_Sync_API schema
    const formattedArticles = (articles || []).map((item: any) => {
      const featuredImg = resolveImageBase64(item.imageUrl || item.featured_image);
      return {
        title: item.title,
        content: item.content || `<p>${item.metaDescription || `Delicious recipe for ${item.title}`}</p>`,
        external_id: item.id || `recipe-${Date.now()}`,
        status: item.status || defaultStatus || 'publish',
        slug: item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        categories: item.categories || [item.niche || 'Recipes', 'Recipes'],
        tags: item.tags || [item.focusKeyword || 'recipe', ...(item.pinterestPin?.hashtags?.map((h: string) => h.replace('#', '')) || [])],
        recipe: {
          title: item.title,
          prep_time: item.prepTime || '15 mins',
          cook_time: item.cookTime || '20 mins',
          servings: item.servings || '4 servings',
          calories: (item.calories || 450).toString(),
          cuisine: item.schemaJsonLd?.recipeCuisine || 'General',
          ingredients: (item.ingredients || []).map((i: any) => typeof i === 'string' ? i : `${i.amount} ${i.item}${i.notes ? ' (' + i.notes + ')' : ''}`),
          instructions: (item.instructions || []).map((s: any) => typeof s === 'string' ? s : `${s.title ? s.title + ': ' : ''}${s.text}`),
          notes: Array.isArray(item.chefTips) ? item.chefTips.join(' | ') : (item.notes || '')
        },
        ...(featuredImg ? { featured_image: featuredImg } : {})
      };
    });

    const wpRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-sync-key': apiKey.trim(),
      },
      body: JSON.stringify({ articles: formattedArticles }),
    });

    const data = await wpRes.json();
    if (!wpRes.ok) {
      return res.status(wpRes.status).json({
        error: data.message || `WordPress returned status ${wpRes.status}`,
        details: data
      });
    }

    res.json({
      success: true,
      data,
      syncedCount: data.synced || formattedArticles.length,
      results: data.results || []
    });
  } catch (error: any) {
    console.error('AutoSync plugin import error:', error);
    res.status(500).json({ error: error.message || 'Failed to sync with WordPress AutoSync plugin' });
  }
});

// Initialize server with Vite middleware or static serving
const startServer = async () => {
  const isProd = process.env.NODE_ENV === 'production';
  const port = 3000;

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`PinRecipe Scale Engine dev server listening on http://0.0.0.0:${port}`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
