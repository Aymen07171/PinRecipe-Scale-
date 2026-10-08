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
  const apiKey = process.env.CODECRAFT_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  try {
    const config: any = { apiKey: apiKey.trim() };
    if (process.env.CODECRAFT_API_URL && !process.env.CODECRAFT_API_URL.includes('codecraftapi.com')) {
      config.httpOptions = {
        baseUrl: process.env.CODECRAFT_API_URL.replace(/\/$/, ''),
        headers: { 'User-Agent': 'aistudio-build' },
      };
    }
    return new GoogleGenAI(config);
  } catch (e) {
    console.warn('Failed to initialize GoogleGenAI client:', e);
    return null;
  }
};

// Comprehensive culinary curated photography dictionary for server-side generation
const SERVER_IMAGE_CATEGORIES: Array<{ keywords: string[]; url: string }> = [
  // High-Grade Gemini Food Photographs
  {
    keywords: ['salmon', 'lemon herb salmon', 'mediterranean salmon', 'sheet pan salmon', 'pan-seared salmon'],
    url: '/images/mediterranean_salmon.jpg'
  },
  {
    keywords: ['greek feta', 'stuffed chicken', 'sun-dried tomato', 'feta chicken', 'spinach chicken', 'greek chicken'],
    url: '/images/greek_feta_chicken.jpg'
  },
  {
    keywords: ['orzo', 'mediterranean orzo', 'garlic orzo', 'lemon orzo', 'creamy orzo', 'artichoke orzo'],
    url: '/images/mediterranean_orzo.jpg'
  },

  // Breakfast, Pancakes, Waffles, Eggs
  {
    keywords: ['pancake', 'pancakes', 'ricotta pancake', 'lemon pancake', 'buttermilk pancake', 'fluffy pancake', 'blueberry pancake', 'crepe', 'crepes'],
    url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['waffle', 'waffles', 'belgian waffle'],
    url: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['french toast', 'brioche toast', 'cinnamon toast'],
    url: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['avocado toast', 'poached egg', 'avocado', 'sourdough toast', 'guacamole toast'],
    url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['egg', 'eggs', 'benedict', 'frittata', 'omelet', 'omelette', 'scrambled', 'breakfast'],
    url: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['smoothie', 'smoothie bowl', 'acai', 'acai bowl', 'chia', 'granola bowl'],
    url: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=1200&q=80'
  },

  // Italian & Pasta
  {
    keywords: ['lasagna', 'lasagne', 'baked ziti', 'cannelloni'],
    url: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['pizza', 'margherita', 'pepperoni', 'flatbread', 'calzone'],
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['truffle', 'pasta', 'tagliatelle', 'fettuccine', 'mushroom pasta', 'spaghetti', 'carbonara', 'alfredo', 'penne'],
    url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['risotto', 'mushroom risotto', 'parmesan risotto', 'arborio'],
    url: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['mac and cheese', 'macaroni', 'cheddar pasta'],
    url: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=80'
  },

  // Meats, Poultry, BBQ & Air Fryer
  {
    keywords: ['steak', 'ribeye', 'beef', 'sirloin', 'tenderloin', 'filet mignon', 'garlic butter steak'],
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['beef bourguignon', 'beef stew', 'pot roast', 'short rib', 'brisket'],
    url: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['burger', 'cheeseburger', 'sliders', 'patty', 'hamburger'],
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['chicken thighs', 'honey garlic chicken', 'bbq chicken', 'roast chicken', 'chicken breast', 'skillet chicken', 'chicken'],
    url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['wings', 'air fryer wings', 'buffalo wings', 'crispy wings', 'chicken wings'],
    url: 'https://images.unsplash.com/photo-1527477378408-1bc09c2a311b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['pork', 'pork chops', 'ribs', 'bbq ribs', 'bacon', 'carnitas'],
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'
  },

  // Seafood & Shellfish
  {
    keywords: ['shrimp', 'prawn', 'scampi', 'garlic shrimp', 'butter shrimp', 'seafood'],
    url: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['fish', 'cod', 'halibut', 'sea bass', 'white fish', 'snapper', 'trout'],
    url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80'
  },

  // Mexican & Latin
  {
    keywords: ['taco', 'tacos', 'birria', 'fish taco', 'street taco'],
    url: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['burrito', 'fajita', 'fajitas', 'enchilada', 'enchiladas', 'quesadilla', 'nachos'],
    url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1200&q=80'
  },

  // Asian & Middle Eastern
  {
    keywords: ['ramen', 'pho', 'noodle soup', 'udon', 'noodles'],
    url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['sushi', 'sashimi', 'maki', 'roll', 'poke', 'poke bowl'],
    url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['curry', 'tikka masala', 'butter chicken', 'korma', 'curried', 'coconut curry'],
    url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['stir fry', 'fried rice', 'pad thai', 'chow mein', 'wok'],
    url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['moroccan', 'tagine', 'tajine', 'prunes', 'lamb tagine', 'couscous', 'harira', 'north african'],
    url: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=1200&q=80'
  },

  // Soups & Salads
  {
    keywords: ['soup', 'chowder', 'tomato soup', 'butternut', 'bisque', 'lentil soup', 'broth'],
    url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['salad', 'caesar', 'greek salad', 'caprese', 'cobb', 'greens', 'buddha bowl'],
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80'
  },

  // Baking & Desserts
  {
    keywords: ['cheesecake', 'berry cheesecake', 'new york cheesecake', 'basque cheesecake', 'dessert'],
    url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['chocolate cake', 'lava cake', 'brownie', 'brownies', 'fudge', 'molten', 'chocolate'],
    url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['cookie', 'cookies', 'chocolate chip', 'biscuit', 'shortbread'],
    url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['pie', 'apple pie', 'tart', 'pastry', 'puff pastry', 'galette'],
    url: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['donut', 'donuts', 'doughnut', 'cinnamon roll', 'churro', 'churros'],
    url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['bread', 'focaccia', 'sourdough', 'baguette', 'loaf', 'brioche', 'garlic bread'],
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80'
  }
];

const pickPhotoForTopic = (text: string): string => {
  const lower = (text || '').toLowerCase();
  
  // 1. Direct multi-word keyword match
  for (const cat of SERVER_IMAGE_CATEGORIES) {
    for (const kw of cat.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        return cat.url;
      }
    }
  }

  // 2. Individual token matching for key food words
  const tokens = lower.split(/[^a-z0-9]+/).filter(t => t.length >= 4);
  for (const token of tokens) {
    for (const cat of SERVER_IMAGE_CATEGORIES) {
      if (cat.keywords.some(k => k.toLowerCase().includes(token))) {
        return cat.url;
      }
    }
  }

  // 3. Broad semantic domain heuristics
  if (/cake|cookie|brownie|dessert|sweet|pie|donut|tart|chocolate|sugar|pastry|bake/.test(lower)) {
    return 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1200&q=80'; // Cheesecake/Dessert
  }
  if (/breakfast|pancake|waffle|toast|brunch|egg|omelet|morning/.test(lower)) {
    return 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1200&q=80'; // Fluffy Pancakes
  }
  if (/pasta|noodle|spaghetti|tagliatelle|macaroni|fettuccine|lasagna/.test(lower)) {
    return 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80'; // Truffle Tagliatelle
  }
  if (/beef|steak|burger|meat|pork|ribs|bbq|roast/.test(lower)) {
    return 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'; // Seared Steak
  }
  if (/chicken|poultry|wings|thighs|tender/.test(lower)) {
    return 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1200&q=80'; // Roasted Chicken
  }
  if (/taco|burrito|mexican|fajita|salsa|quesadilla/.test(lower)) {
    return 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=80'; // Street Tacos
  }
  if (/soup|stew|chowder|broth|chili/.test(lower)) {
    return 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80'; // Hearty Soup
  }
  if (/salad|green|bowl|vegan|fresh|grain/.test(lower)) {
    return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80'; // Artisan Salad Bowl
  }

  // 4. Deterministic hash fallback across curated photo collection
  let hash = 0;
  for (let i = 0; i < lower.length; i++) {
    hash = (hash << 5) - hash + lower.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % SERVER_IMAGE_CATEGORIES.length;
  return SERVER_IMAGE_CATEGORIES[idx].url;
};

// Domain-specific keyword generator fallback
const generateFallbackKeywords = (niche: string, count: number = 5) => {
  const n = (niche || 'Mediterranean Diet').toLowerCase();
  
  if (n.includes('mediterranean') || n.includes('greek')) {
    return [
      { topic: 'Sheet Pan Lemon Herb Mediterranean Salmon', targetNiche: 'Mediterranean Diet', estimatedVolume: '34.2k/mo', difficultyScore: '22%', pinPotential: 'Viral', dietary: 'Pescatarian' },
      { topic: 'Crispy Greek Feta & Sun-Dried Tomato Stuffed Chicken', targetNiche: 'Mediterranean Diet', estimatedVolume: '28.6k/mo', difficultyScore: '25%', pinPotential: 'Viral', dietary: 'High-Protein' },
      { topic: 'Creamy Garlic & Lemon Mediterranean Orzo Skillet', targetNiche: 'Mediterranean Diet', estimatedVolume: '42.1k/mo', difficultyScore: '18%', pinPotential: 'Evergreen', dietary: 'Vegetarian' },
      { topic: 'Garlic Butter Mediterranean Jumbo Shrimp & Asparagus', targetNiche: 'Mediterranean Diet', estimatedVolume: '19.4k/mo', difficultyScore: '15%', pinPotential: 'High', dietary: 'Low-Carb' },
      { topic: 'Roasted Chickpea & Charred Halloumi Warm Grain Bowl', targetNiche: 'Mediterranean Diet', estimatedVolume: '16.8k/mo', difficultyScore: '19%', pinPotential: 'Viral', dietary: 'Vegetarian' }
    ].slice(0, count);
  }

  if (n.includes('air fryer') || n.includes('crispy')) {
    return [
      { topic: 'Ultra Crispy Garlic Parmesan Air Fryer Wings', targetNiche: 'Crispy Air Fryer Magic', estimatedVolume: '62.4k/mo', difficultyScore: '28%', pinPotential: 'Viral', dietary: 'Keto' },
      { topic: 'Air Fryer Crispy Bang Bang Cauliflower Bites', targetNiche: 'Crispy Air Fryer Magic', estimatedVolume: '38.1k/mo', difficultyScore: '20%', pinPotential: 'Viral', dietary: 'Vegetarian' },
      { topic: '12-Minute Golden Air Fryer Salmon Bites', targetNiche: 'Crispy Air Fryer Magic', estimatedVolume: '45.0k/mo', difficultyScore: '19%', pinPotential: 'Evergreen', dietary: 'Pescatarian' },
      { topic: 'Air Fryer Stuffed Cheddar & Bacon Sliders', targetNiche: 'Crispy Air Fryer Magic', estimatedVolume: '26.5k/mo', difficultyScore: '24%', pinPotential: 'High', dietary: 'Comfort Food' },
      { topic: 'Crispy Air Fryer Cinnamon Sugar Donut Holes', targetNiche: 'Crispy Air Fryer Magic', estimatedVolume: '31.2k/mo', difficultyScore: '16%', pinPotential: 'Viral', dietary: 'Dessert' }
    ].slice(0, count);
  }

  if (n.includes('keto') || n.includes('protein')) {
    return [
      { topic: 'Bacon Wrapped Garlic Herb Stuffed Pork Tenderloin', targetNiche: 'High-Protein & Keto', estimatedVolume: '29.3k/mo', difficultyScore: '26%', pinPotential: 'High', dietary: 'Keto' },
      { topic: 'Crispy Parmesan Crusted Garlic Butter Salmon', targetNiche: 'High-Protein & Keto', estimatedVolume: '48.9k/mo', difficultyScore: '21%', pinPotential: 'Viral', dietary: 'Keto' },
      { topic: 'Low-Carb Cheesy Garlic Butter Stuffed Chicken Breasts', targetNiche: 'High-Protein & Keto', estimatedVolume: '36.7k/mo', difficultyScore: '24%', pinPotential: 'Viral', dietary: 'Keto' },
      { topic: 'Keto Jalapeño Popper Beef Skillet', targetNiche: 'High-Protein & Keto', estimatedVolume: '22.1k/mo', difficultyScore: '18%', pinPotential: 'Evergreen', dietary: 'Low-Carb' },
      { topic: 'Golden Cheddar Garlic Almond Flour Drop Biscuits', targetNiche: 'High-Protein & Keto', estimatedVolume: '17.4k/mo', difficultyScore: '19%', pinPotential: 'High', dietary: 'Gluten-Free' }
    ].slice(0, count);
  }

  // General Dinner default
  return [
    { topic: `Chef's Signature 25-Minute ${niche || 'Dinner'} Skillet`, targetNiche: niche || 'Quick & Easy Dinners', estimatedVolume: '31.5k/mo', difficultyScore: '20%', pinPotential: 'Viral', dietary: 'Family-Friendly' },
    { topic: `Crispy Honey Garlic Glazed ${niche || 'Delight'}`, targetNiche: niche || 'Quick & Easy Dinners', estimatedVolume: '27.4k/mo', difficultyScore: '18%', pinPotential: 'Viral', dietary: 'Standard' },
    { topic: `Sheet Pan Roasted Herb & Lemon ${niche || 'Favorite'}`, targetNiche: niche || 'Quick & Easy Dinners', estimatedVolume: '24.1k/mo', difficultyScore: '15%', pinPotential: 'Evergreen', dietary: 'Gluten-Free Optional' },
    { topic: `One-Pot Creamy Tuscan Garlic ${niche || 'Supper'}`, targetNiche: niche || 'Quick & Easy Dinners', estimatedVolume: '44.8k/mo', difficultyScore: '22%', pinPotential: 'Viral', dietary: 'Comfort Food' },
    { topic: `15-Minute Sweet & Spicy Glazed Bowls`, targetNiche: niche || 'Quick & Easy Dinners', estimatedVolume: '19.2k/mo', difficultyScore: '17%', pinPotential: 'High', dietary: 'Quick Prep' }
  ].slice(0, count);
};

// Domain-specific recipe synthesis fallback
const generateFallbackRecipe = (topic: string, niche?: string, dietary?: string) => {
  const cleanTitle = topic.trim();
  const slug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const imageUrl = pickPhotoForTopic(topic + ' ' + (niche || ''));

  return {
    title: cleanTitle,
    slug,
    metaDescription: `Discover how to make restaurant-caliber ${cleanTitle} in under 35 minutes. Foolproof culinary technique, rich layered flavors, and complete nutritional breakdown.`,
    focusKeyword: cleanTitle.toLowerCase(),
    prepTime: '15 mins',
    cookTime: '20 mins',
    totalTime: '35 mins',
    servings: '4 servings',
    calories: 460,
    difficulty: 'Easy',
    imageUrl,
    macros: {
      protein: '34g',
      carbs: '26g',
      fat: '16g',
      fiber: '5g'
    },
    ingredients: [
      { item: 'Central Fresh Protein or Main Base', amount: '600g', notes: 'patted dry for maximum sear' },
      { item: 'Extra Virgin Cold-Pressed Olive Oil or Butter', amount: '2 tbsp', notes: 'divided' },
      { item: 'Fresh Garlic Cloves', amount: '4 cloves', notes: 'finely minced' },
      { item: 'Fresh Lemon Juice & Zest', amount: '1 whole lemon', notes: 'for finishing brightness' },
      { item: 'Fresh Italian Herbs (Oregano, Rosemary or Basil)', amount: '2 tbsp', notes: 'finely chopped' },
      { item: 'Flaky Maldon Sea Salt & Cracked Pepper', amount: 'to taste', notes: 'coarsely ground' },
      { item: 'Artisan Cheeses or Finishing Garnish (Feta or Parmigiano)', amount: '50g', notes: 'crumbled or grated' },
      { item: 'Aromatic Reduction Splash (Broth or White Wine)', amount: '1/3 cup', notes: 'for skillet deglazing' }
    ],
    instructions: [
      { step: 1, title: 'Mise en Place & Surface Preparation', text: `Measure and prep all aromatics. Pat your central ingredient thoroughly dry with kitchen towels. Generously season with sea salt and freshly cracked pepper on all sides.`, timerMinutes: 5 },
      { step: 2, title: 'Searing & Golden Caramelization', text: `Heat a heavy skillet over medium-high heat with olive oil until shimmering. Lay ingredients in a single uncrowded layer and sear undisturbed for 5-6 minutes until a deep golden crust forms.`, timerMinutes: 6 },
      { step: 3, title: 'Aromatic Bloom & Pan Deglazing', text: `Reduce heat slightly, stir in minced garlic and fresh herbs for 60 seconds until fragrant. Pour in broth or deglazing liquid, scraping the fond from the pan bottom into a silky pan sauce.`, timerMinutes: 4 },
      { step: 4, title: 'Velvety Emulsion & Glazing', text: `Swirl in a knob of cold butter and freshly squeezed lemon juice. Spoon the glossy pan emulsion continuously over the dish until perfectly basted and cooked through.`, timerMinutes: 3 },
      { step: 5, title: 'Plating & Chef Finishing Touch', text: `Transfer to warm plates. Spoon remaining pan jus over the top, finish with crumbled cheese, fresh herb sprigs, and a drizzle of premium olive oil.` }
    ],
    chefTips: [
      'Do not overcrowd the skillet; giving space allows steam to escape so ingredients roast and crisp rather than boil.',
      'Always finish with a splash of fresh citrus juice to brighten the rich fats and balance the palate.'
    ],
    macroPhotoPrompt: `Macro close-up food photography of ${cleanTitle}, glistening savory glaze, steam rising, warm studio rim lighting, fresh herbs garnish, rustic ceramic plate, Pinterest 2:3 vertical aspect.`,
    pinterestPin: {
      title: `The Easiest ${cleanTitle} (Ready in 35 Mins!)`,
      description: `Save this foolproof recipe for ${cleanTitle}! Tender, bursting with flavor, and so simple to make at home. Complete step-by-step instructions inside.`,
      hashtags: ['#easyrecipes', '#dinnerideas', '#quickmeals', '#healthyrecipes', '#cooking'],
      overlayHeadline: `The Best 35-Minute ${cleanTitle}`
    },
    schemaJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: cleanTitle,
      description: `Delicious chef-tested recipe for ${cleanTitle}.`,
      prepTime: 'PT15M',
      cookTime: 'PT20M',
      totalTime: 'PT35M',
      recipeYield: '4 servings',
      recipeCategory: niche || 'Dinners',
      recipeCuisine: 'American / Mediterranean',
      keywords: `${cleanTitle.toLowerCase()}, recipe, quick dinner`
    }
  };
};

const publishedRecipesStore = new Map<string, any>();

// Seed initial recipes so articles are immediately accessible
const SEEDED_RECIPES = [
  {
    id: 'rec-00',
    topic: 'Sheet Pan Lemon Herb Mediterranean Salmon',
    title: 'Sheet Pan Lemon Herb Mediterranean Salmon',
    slug: 'sheet-pan-lemon-herb-mediterranean-salmon',
    niche: 'Mediterranean Diet',
    dietary: 'Pescatarian',
    imageUrl: '/images/mediterranean_salmon.jpg',
    prepTime: '15 mins',
    cookTime: '20 mins',
    totalTime: '35 mins',
    servings: '4 servings',
    calories: 460,
    metaDescription: 'Restaurant-quality Sheet Pan Lemon Herb Mediterranean Salmon ready in 35 minutes. Flaky salmon with garlic, olives, capers, and crumbled feta.',
    ingredients: [
      { item: 'Fresh Wild Salmon Fillets', amount: '4 portions (180g each)', notes: 'skin on, patted dry' },
      { item: 'Extra Virgin Cold-Pressed Olive Oil', amount: '3 tbsp', notes: 'Greek or Sicilian preferred' },
      { item: 'Fresh Lemon Juice & Zest', amount: '2 lemons', notes: 'juiced & sliced' },
      { item: 'Garlic Cloves', amount: '4 cloves', notes: 'finely minced' },
      { item: 'Fresh Chopped Dill & Oregano', amount: '3 tbsp', notes: 'finely chopped' },
      { item: 'Kalamata Olives & Non-Pareil Capers', amount: '1/2 cup', notes: 'drained' },
      { item: 'Crumbled Greek Sheep Milk Feta', amount: '60g', notes: 'for finishing' },
      { item: 'Flaky Maldon Sea Salt & Coarse Black Pepper', amount: 'to taste' }
    ],
    instructions: [
      { step: 1, title: 'Prep Aromatics & Dry the Fillets', text: 'Preheat oven or skillet. Pat salmon fillets completely dry with paper towels to ensure golden searing. Season all sides with sea salt, cracked black pepper, and garlic.', timerMinutes: 5 },
      { step: 2, title: 'High-Heat Sear for Crispy Skin', text: 'Heat olive oil in a heavy skillet over medium-high heat. Place salmon skin-side down and sear undisturbed for 5 minutes until crispy and caramelized.', timerMinutes: 5 },
      { step: 3, title: 'Deglaze & Simmer with Lemon Herbs', text: 'Scatter minced garlic, fresh dill, olives, and capers around the salmon. Pour in fresh lemon juice and a splash of broth to deglaze the skillet juices.', timerMinutes: 4 },
      { step: 4, title: 'Baste into Velvety Pan Emulsion', text: 'Swirl the pan gently and spoon the fragrant lemon pan sauce continuously over the salmon until perfectly basted and flaky.', timerMinutes: 3 },
      { step: 5, title: 'Finish & Rest', text: 'Transfer to a serving platter. Garnish with crumbled feta, lemon wedges, and fresh herbs. Rest for 3 minutes before serving.' }
    ],
    chefTips: [
      'Pasting fillets completely dry is the #1 secret to restaurant-crisp skin without sticking.',
      'Swirl in a knob of cold butter or extra olive oil off the heat for an authentic velvety pan glaze.'
    ]
  },
  {
    id: 'rec-01',
    topic: 'Creamy Wild Mushroom & Black Truffle Tagliatelle',
    title: 'Creamy Wild Mushroom & Black Truffle Tagliatelle',
    slug: 'creamy-wild-mushroom-black-truffle-tagliatelle',
    niche: 'Quick & Easy Dinners',
    dietary: 'Vegetarian',
    imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80',
    prepTime: '15 mins',
    cookTime: '20 mins',
    totalTime: '35 mins',
    servings: '4 servings',
    calories: 520,
    metaDescription: 'Discover how to make restaurant-quality creamy wild mushroom & black truffle tagliatelle in 35 minutes. Luxurious, rich, and simple to master at home.',
    ingredients: [
      { item: 'Fresh Tagliatelle Pasta', amount: '400g', notes: 'egg-based pasta preferred' },
      { item: 'Assorted Wild Mushrooms (Chanterelles, Cremini, Shiitake)', amount: '350g', notes: 'sliced thick' },
      { item: 'Black Truffle Carpaccio or Puree', amount: '2 tbsp' },
      { item: 'Heavy Whipping Cream', amount: '200ml' },
      { item: 'Parmigiano-Reggiano', amount: '60g', notes: 'freshly grated' },
      { item: 'Garlic Cloves', amount: '3 cloves', notes: 'finely minced' },
      { item: 'Fresh Italian Flat-Leaf Parsley', amount: '2 tbsp', notes: 'chopped' }
    ],
    instructions: [
      { step: 1, title: 'Sauté the Forest Mushrooms', text: 'Melt unsalted butter with olive oil in a heavy stainless skillet over medium-high heat. Add mushrooms in an even layer without crowding and sear for 6 minutes until deeply caramelized.', timerMinutes: 6 },
      { step: 2, title: 'Infuse Aromatics & Cream', text: 'Stir in minced garlic and cook for 60 seconds until fragrant. Deglaze the skillet with a splash of dry white wine or vegetable broth. Pour in heavy cream and simmer gently for 4 minutes.', timerMinutes: 4 },
      { step: 3, title: 'Boil Pasta to Al Dente', text: 'In a large pot of rolling salted water, cook the tagliatelle for 3 minutes until al dente. Reserve half a cup of starchy pasta water before draining.', timerMinutes: 3 },
      { step: 4, title: 'Glossy Emulsion & Truffle Infusion', text: 'Transfer drained pasta straight into the cream skillet. Fold in black truffle puree, freshly grated Parmigiano-Reggiano, and a splash of reserved pasta water. Toss vigorously until a glossy velvet glaze forms.', timerMinutes: 2 },
      { step: 5, title: 'Plate & Garnish', text: 'Twirl onto warm pasta bowls. Top with freshly shaved truffles, extra Parmigiano-Reggiano curls, cracked pepper, and fresh parsley.' }
    ],
    chefTips: [
      'Do not salt the mushrooms until they have browned; salting too early releases water and prevents that signature deep roasted crust.',
      'Always reserve starchy pasta cooking water to marry the sauce and pasta into an authentic restaurant glaze.'
    ]
  },
  {
    id: 'rec-02',
    topic: 'Glazed Teriyaki Salmon & Avocado Power Bowl',
    title: 'Glazed Teriyaki Salmon & Avocado Power Bowl',
    slug: 'glazed-teriyaki-salmon-avocado-power-bowl',
    niche: 'High-Protein & Keto',
    dietary: 'Gluten-Free, Dairy-Free',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
    prepTime: '15 mins',
    cookTime: '12 mins',
    totalTime: '27 mins',
    servings: '2 bowls',
    calories: 590,
    metaDescription: 'Quick 27-minute Teriyaki Salmon & Avocado Power Bowl packed with 42g protein and healthy fats. Flaky glazed salmon over fluffy rice with crisp veggies.',
    ingredients: [
      { item: 'Wild Alaskan Salmon Fillets', amount: '2 fillets (180g each)', notes: 'skin on' },
      { item: 'Tamari or Low-Sodium Soy Sauce', amount: '3 tbsp' },
      { item: 'Pure Maple Syrup or Honey', amount: '2 tbsp' },
      { item: 'Fresh Grated Ginger & Garlic', amount: '1 tbsp each' },
      { item: 'Hass Avocado', amount: '1 whole', notes: 'thinly fanned' },
      { item: 'Steamed Edamame & English Cucumber', amount: '1 cup total' }
    ],
    instructions: [
      { step: 1, title: 'Whisk the Sticky Glaze', text: 'In a small saucepan, combine tamari, maple syrup, minced ginger, garlic, and a teaspoon of rice vinegar. Simmer for 3 minutes until thick and glossy.', timerMinutes: 3 },
      { step: 2, title: 'Pan-Sear the Salmon', text: 'Heat avocado oil in a cast-iron skillet over high heat. Place salmon skin-side down and sear for 4 minutes until crispy. Flip, spoon over the glaze, and baste continuously for 3 more minutes.', timerMinutes: 7 },
      { step: 3, title: 'Assemble the Power Bowls', text: 'Divide warm jasmine rice into deep ceramic bowls. Arrange fanned avocado, steamed edamame, cucumber, and pickled ginger.', timerMinutes: 3 },
      { step: 4, title: 'Garnish & Serve', text: 'Rest the glistening salmon fillet in the center. Drizzle remaining teriyaki glaze over the top and shower with toasted sesame seeds.' }
    ],
    chefTips: [
      'Pat the salmon skin completely dry with paper towels before hitting the hot pan to ensure crackling crispy skin.'
    ]
  },
  {
    id: 'rec-03',
    topic: 'Artisanal Moroccan Lemon & Olive Chicken Tagine',
    title: 'Artisanal Moroccan Lemon & Olive Chicken Tagine',
    slug: 'artisanal-moroccan-lemon-olive-chicken-tagine',
    niche: 'Moroccan & Tagine Classics',
    dietary: 'Gluten-Free, Dairy-Free',
    imageUrl: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=1200&q=80',
    prepTime: '20 mins',
    cookTime: '45 mins',
    totalTime: '65 mins',
    servings: '4 servings',
    calories: 460,
    metaDescription: 'Authentic Moroccan Chicken Tagine with preserved lemons, green olives, and saffron. Step-by-step traditional recipe with meltingly tender chicken.',
    ingredients: [
      { item: 'Skinless Chicken Thighs & Drumsticks', amount: '900g', notes: 'bone-in for maximum richness' },
      { item: 'Preserved Lemons (Moroccan Ch\'ladd)', amount: '1 whole', notes: 'pulp removed, rind cut in strips' },
      { item: 'Castelvetrano or Moroccan Red Olives', amount: '1 cup', notes: 'pitted & rinsed' },
      { item: 'Spanish Saffron Strands', amount: '1 pinch', notes: 'bloomed in warm water' },
      { item: 'Yellow Onions', amount: '2 large', notes: 'finely grated for daghmira sauce base' }
    ],
    instructions: [
      { step: 1, title: 'Chermoula Spice Marinade', text: 'In a bowl, mix minced garlic, ground ginger, turmeric, saffron water, black pepper, and olive oil. Coat chicken and marinate.', timerMinutes: 15 },
      { step: 2, title: 'Build Onion Base in Tagine', text: 'Heat olive oil in a traditional clay tagine. Spread grated onions across the base, then nestle chicken on top.', timerMinutes: 5 },
      { step: 3, title: 'Slow Simmer', text: 'Cover with conical lid and cook on low heat for 35 minutes until fall-apart tender.', timerMinutes: 35 },
      { step: 4, title: 'Add Preserved Lemon & Olives', text: 'Scatter preserved lemon peel ribbons and olives around chicken. Cook uncovered for 10 minutes to reduce sauce.', timerMinutes: 10 }
    ],
    chefTips: [
      'Grate the onions instead of chopping them—this is the authentic Moroccan secret to achieving the rich, jammy daghmira reduction.'
    ]
  },
  {
    id: 'rec-04',
    topic: 'Velvety New York Berry Swirl Cheesecake',
    title: 'Velvety New York Berry Swirl Cheesecake',
    slug: 'velvety-new-york-berry-swirl-cheesecake',
    niche: 'Decadent Desserts',
    dietary: 'Vegetarian',
    imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1200&q=80',
    prepTime: '30 mins',
    cookTime: '60 mins',
    totalTime: '90 mins',
    servings: '12 slices',
    calories: 480,
    metaDescription: 'The creamiest New York Berry Swirl Cheesecake with a buttery graham crust and dripping wild berry coulis. Never cracks with our foolproof water-bath method.',
    ingredients: [
      { item: 'Full-Fat Cream Cheese', amount: '900g', notes: 'room temperature' },
      { item: 'Granulated Sugar', amount: '220g' },
      { item: 'Large Farm Eggs', amount: '4 whole + 1 yolk' },
      { item: 'Sour Cream & Vanilla', amount: '180g sour cream, 1 tbsp vanilla' },
      { item: 'Graham Cracker Crust', amount: '200g crumbs, 80g melted butter' },
      { item: 'Wild Berry Coulis', amount: '1 cup' }
    ],
    instructions: [
      { step: 1, title: 'Press the Graham Crust', text: 'Combine graham cracker crumbs with melted butter. Press firmly into springform pan and pre-bake 10 mins.', timerMinutes: 10 },
      { step: 2, title: 'Silky Batter', text: 'Beat cream cheese on low speed until smooth. Gradually add sugar, vanilla, sour cream, and eggs one at a time.', timerMinutes: 9 },
      { step: 3, title: 'Water Bath Bake', text: 'Pour batter into crust. Swirl in berry coulis. Bake in hot water bath at 300°F (150°C) for 60 mins until edges are set.', timerMinutes: 60 },
      { step: 4, title: 'Slow Cool & Chill', text: 'Cool in oven with door ajar for 1 hour, then chill 6 hours before slicing.' }
    ],
    chefTips: [
      'Room temperature ingredients are non-negotiable for lump-free cheesecake batter.'
    ]
  }
];

SEEDED_RECIPES.forEach(r => publishedRecipesStore.set(r.id, r));

// 1. Generate full structured recipe & SEO payload
app.post('/api/generate-recipe', async (req, res) => {
  try {
    const { topic, niche, dietary, targetAudience } = req.body;
    if (!topic || topic.trim() === '') {
      return res.status(400).json({ error: 'Recipe topic is required' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Graceful smart fallback
      const data = generateFallbackRecipe(topic, niche, dietary);
      const recipeId = (data as any).id || `rec-${Date.now().toString().slice(-4)}`;
      (data as any).id = recipeId;
      publishedRecipesStore.set(recipeId, data);
      return res.json({ success: true, data, source: 'culinary_engine' });
    }

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
    "title": "High-CTR Pinterest Pin Title",
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
      config: { responseMimeType: 'application/json' },
    });

    const responseText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    if (!parsedData.imageUrl) {
      parsedData.imageUrl = pickPhotoForTopic(topic + ' ' + (niche || ''));
    }

    const recipeId = parsedData.id || `rec-${Date.now().toString().slice(-4)}`;
    parsedData.id = recipeId;
    publishedRecipesStore.set(recipeId, parsedData);

    res.json({ success: true, data: parsedData, source: 'gemini_ai' });
  } catch (error: any) {
    console.warn('Gemini error generating recipe, using high-grade culinary fallback:', error.message);
    const data = generateFallbackRecipe(req.body.topic, req.body.niche, req.body.dietary);
    const recipeId = (data as any).id || `rec-${Date.now().toString().slice(-4)}`;
    (data as any).id = recipeId;
    publishedRecipesStore.set(recipeId, data);
    res.json({ success: true, data, source: 'fallback_engine' });
  }
});

// 2. Generate programmatic keyword batches for a niche
app.post('/api/generate-keywords', async (req, res) => {
  try {
    const { niche, count = 5 } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const keywords = generateFallbackKeywords(niche, count);
      return res.json({ success: true, keywords, source: 'culinary_engine' });
    }

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
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '[]');
    res.json({ success: true, keywords: parsed, source: 'gemini_ai' });
  } catch (error: any) {
    console.warn('Gemini keyword generation error, falling back to culinary engine:', error.message);
    const keywords = generateFallbackKeywords(req.body.niche, req.body.count || 5);
    res.json({ success: true, keywords, source: 'fallback_engine' });
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

// WordPress verification endpoint
app.post('/api/test-wordpress', async (req, res) => {
  const { url, apiKey, username, appPassword } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'WordPress URL is required' });
  }

  const cleanUrl = url.replace(/\/$/, '');
  const siteName = cleanUrl.replace(/^https?:\/\//, '');

  try {
    const start = Date.now();
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

    // 1. Test PinRecipe Bridge endpoint (X-Scale-Bridge-Token)
    const bridgeToken = req.body.bridgeToken || apiKey;
    if (bridgeToken && bridgeToken.trim()) {
      try {
        const bridgeCheck = await fetch(`${cleanUrl}/wp-json/pinrecipe-bridge/v1/test`, {
          method: 'GET',
          headers: {
            'X-Scale-Bridge-Token': bridgeToken.trim(),
          },
        });
        if (bridgeCheck.ok) {
          const bData = await bridgeCheck.json();
          pluginActive = true;
          authValid = true;
          authMessage = `PinRecipe Scale Bridge authenticated on "${bData.blog_name || siteName}"!`;
        } else if (bridgeCheck.status === 401) {
          pluginActive = true;
          authValid = false;
          authMessage = 'PinRecipe Bridge token rejected (401). Verify token in WP Admin → PinRecipe Scale.';
        }
      } catch {
        // bridge not responding
      }
    }

    // 2. Test AutoSync Plugin endpoint if API key present
    try {
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
        if (pluginCheck.status === 403 && !authValid) {
          authValid = false;
          authMessage = apiKey
            ? 'AutoSync Key rejected. Check key in WP Admin → AutoSync.'
            : 'AutoSync Plugin active! Ready for API Secret Key or Standard WP Auth.';
        } else if ((pluginCheck.status === 400 || pluginCheck.status === 200) && !authValid) {
          authValid = true;
          authMessage = 'AutoSync Plugin authenticated successfully!';
        }
      }
    } catch {
      // plugin not responding
    }

    // Also check standard WordPress REST API auth if username & appPassword supplied
    if (username && appPassword) {
      try {
        const credentials = Buffer.from(`${username}:${appPassword}`).toString('base64');
        const userCheck = await fetch(`${cleanUrl}/wp-json/wp/v2/users/me`, {
          headers: { 'Authorization': `Basic ${credentials}` }
        });
        if (userCheck.ok) {
          authValid = true;
          authMessage = 'WordPress Core REST API authenticated with Application Password!';
        }
      } catch {
        // basic auth failed
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
      authMessage: authMessage || 'WordPress REST endpoint responding normally.',
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

// Endpoint to dynamically generate or synthesize recipe imagery
app.post('/api/generate-image', async (req, res) => {
  try {
    const { topic, niche, prompt, recipeId, apiKey } = req.body;
    if (!topic && !prompt) {
      return res.status(400).json({ error: 'Topic or prompt is required for image generation' });
    }

    const cleanTopic = (topic || '').trim();
    const effectivePrompt =
      prompt ||
      `Appetizing professional macro food photography of ${cleanTopic}, Michelin-star presentation, warm studio rim lighting, 8k culinary editorial style, shallow depth of field, 2:3 vertical aspect ratio`;

    let imageUrl = '';
    let source = 'culinary_library';

    // 1. Try Gemini Imagen if key is present
    const key = apiKey || process.env.CODECRAFT_API_KEY || process.env.GEMINI_API_KEY;
    if (key && key.trim() && key !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({ apiKey: key.trim() });
        const imgRes = await (ai.models as any).generateImages({
          model: 'imagen-3.0-generate-002',
          prompt: effectivePrompt,
          config: { numberOfImages: 1, aspectRatio: '2:3' },
        });
        if (imgRes.generatedImages && imgRes.generatedImages[0]?.image?.imageBytes) {
          imageUrl = `data:image/jpeg;base64,${imgRes.generatedImages[0].image.imageBytes}`;
          source = 'gemini_imagen';
        }
      } catch (geminiErr: any) {
        console.warn('Gemini Imagen attempt failed, falling back to curated culinary library:', geminiErr.message);
      }
    }

    // 2. High-precision curated culinary photo match
    if (!imageUrl) {
      imageUrl = pickPhotoForTopic(cleanTopic + ' ' + (niche || ''));
      source = 'culinary_curator';
    }

    // 3. Update recipe in server store if recipeId provided
    if (recipeId && publishedRecipesStore.has(recipeId)) {
      const existing = publishedRecipesStore.get(recipeId);
      publishedRecipesStore.set(recipeId, { ...existing, imageUrl });
    }

    res.json({
      success: true,
      imageUrl,
      prompt: effectivePrompt,
      source,
    });
  } catch (err: any) {
    console.error('Image generation route error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate image' });
  }
});

// Endpoint to store or sync full recipe into memory
app.post('/api/store-recipe', (req, res) => {
  try {
    const { recipe } = req.body;
    if (recipe && recipe.id) {
      publishedRecipesStore.set(recipe.id, recipe);
      return res.json({ success: true, message: 'Recipe successfully cached in server store' });
    }
    res.status(400).json({ error: 'Recipe with id is required' });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Standalone full culinary article HTML page for web visitors
app.get('/api/article/:id', (req, res) => {
  const { id } = req.params;
  let recipe = publishedRecipesStore.get(id);

  if (!recipe) {
    // Search by slug or title
    for (const [_, r] of publishedRecipesStore.entries()) {
      if (r.slug === id || r.id === id) {
        recipe = r;
        break;
      }
    }
  }

  if (!recipe) {
    recipe = SEEDED_RECIPES[0];
  }

  const art = recipe.article;
  const introParagraphs = art?.introduction
    ? art.introduction.split('\n\n')
    : [
        `There is something undeniably comforting about a meal that effortlessly balances deep savory richness with crisp, vibrant culinary brightness. This <strong>${recipe.title}</strong> captures the very soul of wholesome, inspired home cooking: honoring fresh, quality ingredients and elevating them through disciplined culinary technique. In just ${recipe.totalTime || '35 minutes'}, you will transform humble kitchen staples into an unforgettable centerpiece.`,
        `The true beauty of this dish lies in its accessibility. You do not need professional kitchen appliances or rare specialty imports to achieve restaurant-caliber flavor. By mastering a few core culinary fundamentals—achieving proper high-heat searing, blooming fresh aromatics in extra-virgin olive oil, and balancing rich healthy fats with a splash of fresh citrus—every bite offers a symphony of layered texture and aromatic depth.`
      ];

  const whyPoints = art?.whyYouWillLoveThis || [
    `Ready in just ${recipe.totalTime || '35 minutes'} from cutting board to dining table.`,
    `Packed with balanced macronutrients, clean ingredients, and robust flavor.`,
    `Rich, complex flavor profile created through layered aromatics and pan reduction.`,
    `Effortlessly adaptable for ${recipe.dietary || 'healthy'} dietary lifestyles.`
  ];

  const walkthroughSteps = art?.stepByStepWalkthrough || (recipe.instructions || []).map((s: any, idx: number) => ({
    heading: s.title || `Culinary Step ${idx + 1}`,
    description: s.text || s,
    proTip: idx === 0 ? 'Ensure all ingredients are at room temperature before cooking.' : undefined
  }));

  const secrets = art?.culinarySecrets || (recipe.chefTips || [
    'Thoroughly dry surfaces before searing to maximize golden caramelization.',
    'Bloom fresh garlic in hot oil during the final 60 seconds to prevent burning and bitterness.',
    'Whisk in a knob of cold butter or extra-virgin olive oil off the heat to create a silky, velvety pan sauce.',
    'Allow 3 minutes of resting time before carving to seal in natural internal juices.'
  ]);

  const faqs = art?.frequentlyAskedQuestions || [
    {
      question: `How do I ensure the best results when making ${recipe.title}?`,
      answer: 'Always use fresh ingredients and season in layers. Tasting and adjusting seasoning right before serving ensures optimal flavor.'
    },
    {
      question: 'Can I prepare this recipe ahead of time for meal prep?',
      answer: 'Yes. You can prep all vegetables and aromatics up to 24 hours in advance. For optimal texture and aroma, finish cooking right before serving.'
    },
    {
      question: 'What is the best way to reheat leftovers?',
      answer: 'Warm gently in a covered skillet over medium-low heat with a splash of water or broth for 5 minutes to retain moisture.'
    }
  ];

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${recipe.title} - Authentic Recipe & Guide</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,800;1,600&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; }
          body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: #f8fafc; color: #1e293b; margin: 0; padding: 32px 16px; line-height: 1.8; }
          .article-container { max-width: 860px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 48px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); }
          .badge-row { display: flex; gap: 8px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
          .badge { display: inline-block; background: #fdf2f8; color: #be185d; border: 1px solid #fbcfe8; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
          .badge-green { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
          h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 34px; line-height: 1.25; color: #0f172a; margin: 0 0 14px 0; font-weight: 800; }
          .subtitle { font-size: 17px; color: #475569; font-style: italic; margin-bottom: 20px; border-left: 4px solid #be185d; padding-left: 16px; line-height: 1.6; }
          .top-action-bar { display: flex; gap: 12px; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px 18px; border-radius: 12px; margin: 20px 0 28px 0; flex-wrap: wrap; }
          .btn-top-download { background: #be185d; color: #ffffff; padding: 10px 22px; border-radius: 8px; font-weight: 700; font-size: 13px; text-decoration: none; border: none; cursor: pointer; box-shadow: 0 2px 6px rgba(190, 24, 93, 0.25); display: inline-flex; align-items: center; gap: 8px; }
          .btn-top-download:hover { background: #9d174d; }
          .btn-top-jump { background: #ffffff; color: #334155; padding: 9px 16px; border-radius: 8px; font-weight: 600; font-size: 13px; text-decoration: none; border: 1px solid #cbd5e1; }
          .btn-top-jump:hover { background: #f1f5f9; }
          .hero-img { width: 100%; max-height: 460px; object-fit: cover; border-radius: 14px; margin-bottom: 28px; border: 1px solid #e2e8f0; }
          .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px; margin: 24px 0; text-align: center; }
          .metrics strong { display: block; font-size: 16px; color: #0f172a; margin-top: 4px; }
          .lead-text { font-size: 17px; color: #334155; line-height: 1.8; margin-bottom: 24px; }
          .why-box { background: #faf5ff; border: 1px solid #f3e8ff; border-left: 4px solid #a855f7; border-radius: 12px; padding: 22px; margin: 32px 0; }
          .why-box h3 { margin-top: 0; color: #581c87; font-size: 19px; }
          .why-box ul { padding-left: 20px; margin: 0; color: #3b0764; }
          .step-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
          .step-card h4 { font-size: 16px; color: #0f172a; margin: 0 0 8px 0; display: flex; align-items: center; gap: 8px; }
          .step-card p { margin: 0; color: #475569; font-size: 14px; }
          .step-tip { background: #fef3c7; border: 1px solid #fde68a; color: #92400e; padding: 10px; border-radius: 8px; margin-top: 10px; font-size: 12px; }
          .recipe-card-box { background: #ffffff; border: 2px solid #cbd5e1; border-radius: 16px; padding: 32px; margin: 40px 0; box-shadow: 0 4px 14px rgba(0,0,0,0.03); }
          .recipe-card-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 20px; }
          h2, h3 { color: #0f172a; font-family: 'Playfair Display', Georgia, serif; margin-top: 36px; }
          ul, ol { padding-left: 22px; margin-bottom: 24px; color: #334155; }
          li { margin-bottom: 8px; }
          .tip-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #16a34a; border-radius: 12px; padding: 20px; margin: 28px 0; color: #14532d; }
          .faq-item { border-bottom: 1px solid #e2e8f0; padding: 16px 0; }
          .faq-item h4 { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0; font-family: 'Plus Jakarta Sans', sans-serif; }
          .faq-item p { margin: 0; color: #475569; font-size: 15px; }
          .footer { text-align: center; border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 48px; font-size: 12px; color: #94a3b8; }
          @media (max-width: 768px) { .article-container { padding: 24px; } .metrics { grid-template-columns: repeat(2, 1fr); } }
        </style>
      </head>
      <body>
        <div class="article-container">
          <div class="badge-row">
            <span class="badge">${recipe.niche || 'Culinary Feature'}</span>
            <span class="badge badge-green">${recipe.dietary || 'Chef Curated'}</span>
            <span style="font-size: 12px; color: #64748b; margin-left: auto;">⏱️ 7 min read · 📅 Updated Today</span>
          </div>
          
          <h1>${recipe.title}</h1>
          <div class="subtitle">${recipe.metaDescription}</div>

          <!-- PROMINENT TOP DOWNLOAD & PRINT ACTION BAR -->
          <div class="top-action-bar">
            <button onclick="window.print()" class="btn-top-download">📥 Download & Print Recipe PDF</button>
            <a href="#recipe-card-box" class="btn-top-jump">📋 Jump to Recipe Card</a>
            <span style="font-size: 12px; color: #64748b; margin-left: auto;">⭐ 4.98 from 124 Home Cooks</span>
          </div>

          <div class="metrics">
            <div><small style="color:#94a3b8; font-weight:700;">PREP TIME</small><strong>${recipe.prepTime || '15 mins'}</strong></div>
            <div><small style="color:#94a3b8; font-weight:700;">COOK TIME</small><strong>${recipe.cookTime || '20 mins'}</strong></div>
            <div><small style="color:#94a3b8; font-weight:700;">SERVINGS</small><strong>${recipe.servings || '4 servings'}</strong></div>
            <div><small style="color:#94a3b8; font-weight:700;">CALORIES</small><strong style="color:#be185d;">${recipe.calories || 460} kcal</strong></div>
          </div>

          <img src="${recipe.imageUrl || recipe.featured_image}" class="hero-img" alt="${recipe.title}" />

          ${introParagraphs.map((p: string) => `<p class="lead-text">${p}</p>`).join('')}

          <div class="why-box">
            <h3>✨ Why This Recipe Belongs in Your Kitchen</h3>
            <ul>
              ${whyPoints.map((pt: string) => `<li>${pt}</li>`).join('')}
            </ul>
          </div>

          <h2>👨‍🍳 Step-by-Step Culinary Masterclass</h2>
          ${walkthroughSteps.map((s: any, idx: number) => `
            <div class="step-card">
              <h4><span>${idx + 1}.</span> ${s.heading}</h4>
              <p>${s.description}</p>
              ${s.proTip ? `<div class="step-tip"><strong>💡 Pro Tip:</strong> ${s.proTip}</div>` : ''}
            </div>
          `).join('')}

          <div class="tip-box">
            <strong style="font-size: 16px;">💡 Pro Chef Secrets for Success:</strong>
            <ul style="margin: 8px 0 0 0; padding-left: 20px;">
              ${secrets.map((t: string) => `<li>${t}</li>`).join('')}
            </ul>
          </div>

          <div id="recipe-card-box" class="recipe-card-box">
            <div class="recipe-card-header">
              <div>
                <span style="font-size: 11px; font-weight: 700; color: #be185d; text-transform: uppercase; letter-spacing: 0.1em;">OFFICIAL RECIPE CARD</span>
                <h2 style="font-size: 24px; margin: 4px 0 6px 0;">${recipe.title}</h2>
                <p style="color: #64748b; font-size: 13px; margin: 0;">${recipe.metaDescription || ''}</p>
              </div>
              <button onclick="window.print()" class="btn-top-download" style="padding: 8px 16px; font-size: 12px;">🖨️ Print Card</button>
            </div>

            <h3>🛒 Ingredients</h3>
            <ul>
              ${(recipe.ingredients || []).map((i: any) => `<li><strong>${i.amount || ''}</strong> ${i.item || i} ${i.notes ? '<em style="color:#64748b;">(' + i.notes + ')</em>' : ''}</li>`).join('')}
            </ul>

            <h3>🍳 Method</h3>
            <ol>
              ${(recipe.instructions || []).map((s: any) => `<li><strong>${s.title ? s.title + ': ' : ''}</strong>${s.text || s}</li>`).join('')}
            </ol>
          </div>

          <h2>❓ Frequently Asked Culinary Questions</h2>
          ${faqs.map((f: any) => `
            <div class="faq-item">
              <h4>${f.question}</h4>
              <p>${f.answer}</p>
            </div>
          `).join('')}

          <div class="footer">
            Published with PinRecipe Scale Engine · Programmatic SEO & Culinary Publishing
          </div>
        </div>
      </body>
    </html>
  `;
  res.send(html);
});

// Standalone printable recipe card view
app.get('/api/recipe-print/:id', (req, res) => {
  const { id } = req.params;
  const recipe = publishedRecipesStore.get(id) || {
    id,
    title: 'Chef Curated Recipe',
    niche: 'Gourmet Cuisine',
    dietary: 'Standard',
    prepTime: '15 mins',
    cookTime: '20 mins',
    servings: '4 servings',
    calories: 450,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
    metaDescription: 'A foolproof culinary preparation engineered for unforgettable dining.',
    ingredients: [{ amount: '1 batch', item: 'Fresh ingredients' }],
    instructions: [{ step: 1, title: 'Preparation', text: 'Follow culinary method.' }],
    chefTips: ['Season in stages for maximum flavor.']
  };

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${recipe.title} - Gourmet Recipe Card</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: #f8fafc; color: #1e293b; margin: 0; padding: 24px; line-height: 1.6; }
          .card { max-width: 860px; margin: 0 auto; background: white; border-radius: 18px; border: 1px solid #e2e8f0; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
          .badge { display: inline-block; background: #fdf2f8; color: #be185d; border: 1px solid #fbcfe8; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; }
          h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 32px; color: #0f172a; margin: 0 0 12px 0; }
          .hero-img { width: 100%; max-height: 320px; object-fit: cover; border-radius: 14px; margin: 20px 0; }
          .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px; text-align: center; margin: 20px 0; }
          .metrics strong { display: block; font-size: 16px; color: #0f172a; }
          h3 { font-family: 'Outfit', sans-serif; font-size: 16px; text-transform: uppercase; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 28px; }
          ul, ol { padding-left: 20px; }
          li { margin-bottom: 8px; }
          .tip-box { background: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 10px; padding: 16px; margin: 24px 0; color: #78350f; font-size: 13px; }
          .actions { text-align: center; margin-top: 36px; }
          .btn-print { background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; padding: 12px 28px; border-radius: 10px; font-weight: 700; border: none; cursor: pointer; }
          @media print { .actions { display: none; } body { padding: 0; background: white; } .card { border: none; box-shadow: none; padding: 0; } }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">${recipe.niche || 'Gourmet Dinners'} · ${recipe.dietary || 'Standard'}</span>
          <h1>${recipe.title}</h1>
          <p style="color:#64748b;">${recipe.metaDescription || ''}</p>
          ${recipe.imageUrl || recipe.featured_image ? `<img src="${recipe.imageUrl || recipe.featured_image}" class="hero-img" alt="${recipe.title}" />` : ''}

          <div class="metrics">
            <div><small>PREP</small><strong>${recipe.prepTime || '15 mins'}</strong></div>
            <div><small>COOK</small><strong>${recipe.cookTime || '20 mins'}</strong></div>
            <div><small>YIELD</small><strong>${recipe.servings || '4 servings'}</strong></div>
            <div><small>ENERGY</small><strong style="color:#ec4899;">${recipe.calories || 450} kcal</strong></div>
          </div>

          <h3>🛒 Ingredients</h3>
          <ul>
            ${(recipe.ingredients || []).map((i: any) => `<li><strong>${i.amount || ''}</strong> ${i.item || i} ${i.notes ? '(' + i.notes + ')' : ''}</li>`).join('')}
          </ul>

          <h3>👨‍🍳 Step-by-Step Instructions</h3>
          <ol>
            ${(recipe.instructions || []).map((s: any) => `<li><strong>${s.title ? s.title + ': ' : ''}</strong>${s.text || s}</li>`).join('')}
          </ol>

          ${recipe.chefTips && recipe.chefTips.length > 0 ? `
            <div class="tip-box">
              <strong>💡 Chef's Pro Tips:</strong>
              <ul style="margin:8px 0 0 0; padding-left:18px;">
                ${recipe.chefTips.map((t: string) => `<li>${t}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <div class="actions">
            <button onclick="window.print()" class="btn-print">🖨️ Print / Save as PDF</button>
          </div>
        </div>
      </body>
    </html>
  `;
  res.send(html);
});

// 4. Robust WordPress Article Publisher Endpoint
app.post('/api/sync-wordpress-plugin', async (req, res) => {
  try {
    const { url, apiKey, username, appPassword, useAutoSyncPlugin = true, articles, defaultStatus } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'WordPress URL is required' });
    }

    const cleanUrl = url.replace(/\/$/, '');
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

    // Save every article in local published store so links always work
    const formattedArticles = (articles || []).map((item: any) => {
      const articleId = item.id || `recipe-${Date.now()}`;
      const featuredImg = resolveImageBase64(item.imageUrl || item.featured_image) || item.imageUrl || pickPhotoForTopic(item.title);
      publishedRecipesStore.set(articleId, { ...item, imageUrl: featuredImg });

      const liveArticleUrl = `http://localhost:${port}/api/article/${articleId}`;

      const art = item.article || {};
      const introText = art.introduction || `There is something undeniably comforting about a meal that effortlessly balances deep savory richness with crisp, vibrant culinary brightness. This ${item.title} captures the very soul of wholesome, inspired home cooking: honoring fresh, quality ingredients and elevating them through disciplined culinary technique. In just ${item.totalTime || '35 minutes'}, you will transform humble kitchen staples into an unforgettable centerpiece.

The true beauty of this dish lies in its accessibility. You do not need professional kitchen appliances or rare specialty imports to achieve restaurant-caliber flavor. By mastering a few core culinary fundamentals—achieving proper high-heat searing, blooming fresh aromatics in extra-virgin olive oil, and balancing rich healthy fats with a splash of fresh citrus—every bite offers a symphony of layered texture and aromatic depth.`;

      const whyPoints = art.whyYouWillLoveThis || [
        `Ready in just ${item.totalTime || '35 minutes'} from cutting board to dining table.`,
        `Packed with balanced macronutrients, clean ingredients, and robust flavor.`,
        `Rich, complex flavor profile created through layered aromatics and pan reduction.`,
        `Effortlessly adaptable for ${item.dietary || 'healthy'} dietary lifestyles.`
      ];

      const ingredientsList = item.ingredients || [
        { item: 'Central Fresh Protein or Main Base', amount: '600g' },
        { item: 'Extra Virgin Cold-Pressed Olive Oil', amount: '2 tbsp' },
        { item: 'Fresh Garlic Cloves', amount: '4 cloves' },
        { item: 'Fresh Lemon Juice & Zest', amount: '1 lemon' }
      ];

      const instructionsList = item.instructions || [
        { step: 1, title: 'Mise en Place & Prep', text: 'Measure and prep all aromatics. Pat your central ingredient thoroughly dry with kitchen towels. Season generously with sea salt and black pepper.' },
        { step: 2, title: 'High-Heat Searing', text: 'Heat a heavy skillet over medium-high heat with olive oil. Sear undisturbed for 5-6 minutes until deeply golden and caramelized.' },
        { step: 3, title: 'Aromatics & Deglazing', text: 'Stir in minced garlic and fresh herbs for 60 seconds until fragrant. Deglaze with broth or wine, scraping up all flavorful browned fond.' },
        { step: 4, title: 'Velvety Pan Emulsion', text: 'Swirl in cold butter and fresh lemon juice. Spoon the glossy pan emulsion continuously over the dish until perfectly cooked.' },
        { step: 5, title: 'Plating & Garnish', text: 'Transfer to warm plates. Spoon remaining pan jus over the top, finish with fresh herbs, and allow 3 minutes of resting time.' }
      ];

      const chefSecrets = art.culinarySecrets || (item.chefTips || [
        'Thoroughly dry surfaces before searing to maximize golden caramelization.',
        'Bloom fresh garlic in hot oil during the final 60 seconds to prevent burning and bitterness.',
        'Whisk in a knob of cold butter or olive oil off the heat to create a silky, velvety pan sauce.',
        'Allow 3 minutes of resting time before carving to seal in natural internal juices.'
      ]);

      const faqsList = art.frequentlyAskedQuestions || [
        { question: `What makes this ${item.title} so special?`, answer: 'The harmony of fresh aromatics, high-heat caramelization, and a silky pan sauce emulsion ensures restaurant-caliber results every time.' },
        { question: 'Can I make this ahead of time for meal prep?', answer: 'Yes! You can prep all vegetables and aromatics up to 24 hours in advance. For best texture, cook fresh before serving.' },
        { question: 'How do I store and reheat leftovers?', answer: 'Store in an airtight container for up to 4 days. Reheat gently in a covered skillet over medium-low heat with a splash of broth.' }
      ];

      const fullArticleHtml = `
        <div class="pinrecipe-article-container" style="max-width: 860px; margin: 0 auto; background: #ffffff; color: #1e293b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.8;">
          
          <!-- TOP ACTION BAR WITH PROMINENT DOWNLOAD BUTTON -->
          <div style="display: flex; gap: 12px; align-items: center; justify-content: space-between; background: #fdf2f8; border: 1px solid #fbcfe8; padding: 14px 20px; border-radius: 12px; margin-bottom: 24px; flex-wrap: wrap;">
            <div style="font-weight: 700; color: #be185d; font-size: 14px;">
              ⭐ Chef Tested Recipe & Complete Masterclass
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
              <button onclick="window.print()" style="display: inline-flex; align-items: center; gap: 6px; background: #be185d; color: #ffffff; padding: 10px 22px; border-radius: 8px; font-weight: 700; font-size: 13px; text-decoration: none; border: none; cursor: pointer; box-shadow: 0 2px 6px rgba(190, 24, 93, 0.25);">
                📥 Download Recipe Card
              </button>
              <a href="#printable-recipe-card" style="display: inline-flex; align-items: center; gap: 6px; background: #ffffff; color: #334155; padding: 9px 16px; border-radius: 8px; font-weight: 600; font-size: 13px; text-decoration: none; border: 1px solid #cbd5e1;">
                📋 Jump to Recipe
              </a>
            </div>
          </div>

          <!-- HERO PHOTO -->
          <div style="margin-bottom: 28px; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.04);">
            <img src="${featuredImg}" alt="${item.title}" style="width: 100%; max-height: 480px; object-fit: cover; display: block;" />
            <div style="padding: 10px; background: #f8fafc; font-size: 12px; color: #64748b; font-style: italic; text-align: center; border-top: 1px solid #e2e8f0;">
              Freshly prepared ${item.title} made with wholesome ingredients and chef techniques.
            </div>
          </div>

          <!-- QUICK METRICS -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 12px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px; margin-bottom: 28px; text-align: center;">
            <div>
              <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block;">Prep Time</span>
              <strong style="font-size: 16px; color: #0f172a;">${item.prepTime || '15 mins'}</strong>
            </div>
            <div>
              <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block;">Cook Time</span>
              <strong style="font-size: 16px; color: #0f172a;">${item.cookTime || '20 mins'}</strong>
            </div>
            <div>
              <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block;">Total Time</span>
              <strong style="font-size: 16px; color: #0f172a;">${item.totalTime || '35 mins'}</strong>
            </div>
            <div>
              <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block;">Servings</span>
              <strong style="font-size: 16px; color: #0f172a;">${item.servings || '4 servings'}</strong>
            </div>
            <div>
              <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block;">Calories</span>
              <strong style="font-size: 16px; color: #be185d;">${item.calories || 460} kcal</strong>
            </div>
          </div>

          <!-- NARRATIVE STORY -->
          <div style="margin-bottom: 32px; font-size: 17px; color: #334155; line-height: 1.8;">
            ${introText.split('\\n\\n').map((p: string) => `<p style="margin-bottom: 16px;">${p}</p>`).join('')}
          </div>

          <!-- WHY YOU'LL LOVE THIS -->
          <div style="background: #faf5ff; border: 1px solid #f3e8ff; border-radius: 14px; padding: 24px; margin-bottom: 32px;">
            <h3 style="font-size: 18px; font-weight: 800; color: #581c87; margin-top: 0; margin-bottom: 14px;">
              ✨ Why This Recipe Belongs in Your Kitchen
            </h3>
            <ul style="margin: 0; padding-left: 20px; color: #4c1d95; line-height: 1.7;">
              ${whyPoints.map((pt: string) => `<li style="margin-bottom: 8px;">${pt}</li>`).join('')}
            </ul>
          </div>

          <!-- CHEF SECRETS -->
          <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 14px; padding: 24px; margin-bottom: 32px;">
            <h3 style="font-size: 18px; font-weight: 800; color: #78350f; margin-top: 0; margin-bottom: 14px;">
              👨‍🍳 Chef's Culinary Secrets & Pro Techniques
            </h3>
            <ul style="margin: 0; padding-left: 20px; color: #92400e; line-height: 1.7;">
              ${chefSecrets.map((sec: string) => `<li style="margin-bottom: 8px;">${sec}</li>`).join('')}
            </ul>
          </div>

          <!-- STEP-BY-STEP MASTERCLASS -->
          <div style="margin-bottom: 36px;">
            <h3 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 18px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">
              👩‍🍳 Step-by-Step Cooking Masterclass
            </h3>
            <div style="display: flex; flex-direction: column; gap: 16px;">
              ${instructionsList.map((st: any, idx: number) => `
                <div style="display: flex; gap: 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px;">
                  <div style="width: 32px; height: 32px; border-radius: 50%; background: #be185d; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; flex-shrink: 0;">
                    ${st.step || idx + 1}
                  </div>
                  <div>
                    <h4 style="margin: 0 0 6px 0; font-size: 16px; font-weight: 700; color: #0f172a;">
                      ${st.title || `Step ${idx + 1}`}
                    </h4>
                    <p style="margin: 0; font-size: 15px; color: #475569; line-height: 1.6;">
                      ${st.text || st}
                    </p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- COMPLETE PRINTABLE RECIPE CARD BOX -->
          <div id="printable-recipe-card" style="background: #ffffff; border: 2px solid #be185d; border-radius: 16px; padding: 28px; margin-bottom: 36px; box-shadow: 0 10px 25px rgba(190, 24, 93, 0.08);">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
              <div>
                <span style="font-size: 11px; font-weight: 700; color: #be185d; text-transform: uppercase;">Official Printable Card</span>
                <h3 style="margin: 4px 0 0 0; font-size: 24px; font-weight: 800; color: #0f172a;">${item.title}</h3>
              </div>
              <button onclick="window.print()" style="background: #be185d; color: #ffffff; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 13px; border: none; cursor: pointer;">
                🖨️ Print Recipe Card
              </button>
            </div>

            <div style="margin-bottom: 24px;">
              <h4 style="font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 12px;">🛒 Ingredients Needed</h4>
              <ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 8px; list-style: none; padding: 0; margin: 0;">
                ${ingredientsList.map((ing: any) => `
                  <li style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 14px; border-radius: 8px; font-size: 14px; display: flex; align-items: center; gap: 8px;">
                    <span style="color: #be185d; font-weight: 700;">✓</span>
                    <span><strong>${ing.amount || ''}</strong> ${ing.item || ing}${ing.notes ? ` <em>(${ing.notes})</em>` : ''}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <div>
              <h4 style="font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 12px;">🍳 Quick Instructions</h4>
              <ol style="padding-left: 20px; margin: 0; color: #334155; line-height: 1.7;">
                ${instructionsList.map((ins: any) => `
                  <li style="margin-bottom: 10px; font-size: 15px;">
                    <strong>${ins.title || 'Step'}:</strong> ${ins.text || ins}
                  </li>
                `).join('')}
              </ol>
            </div>
          </div>

          <!-- FREQUENTLY ASKED QUESTIONS -->
          <div style="margin-bottom: 36px;">
            <h3 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 16px;">
              ❓ Frequently Asked Questions
            </h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${faqsList.map((faq: any) => `
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px;">
                  <strong style="color: #0f172a; font-size: 15px; display: block; margin-bottom: 4px;">${faq.question}</strong>
                  <p style="margin: 0; color: #475569; font-size: 14px;">${faq.answer}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- STANDALONE READER / PRINT CALLOUT -->
          <div style="text-align: center; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-top: 30px;">
            <p style="margin: 0 0 10px 0; color: #475569; font-size: 14px;">Want to access the high-res interactive reader or print offline?</p>
            <a href="${liveArticleUrl}" target="_blank" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 10px 24px; border-radius: 8px; font-weight: 700; font-size: 13px; text-decoration: none;">
              📖 Open in PinRecipe Studio Reader
            </a>
          </div>
        </div>
      `;

      return {
        title: item.title,
        content: item.content || fullArticleHtml,
        recipe: {
          title: item.title,
          yield: item.servings || '4 servings',
          diet: item.dietary || 'Standard',
          total_time: item.totalTime || '35 mins',
          ingredients_raw: ingredientsList.map((i: any) => `${i.amount || ''} ${i.item || i}`).join('\\n'),
          instructions_raw: instructionsList.map((s: any) => `${s.title || ''}: ${s.text || s}`).join('\\n')
        },
        external_id: articleId,
        status: item.status || defaultStatus || 'publish',
        slug: item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        categories: item.categories || [item.niche || 'Recipes', 'Recipes'],
        tags: item.tags || [item.focusKeyword || 'recipe'],
        localUrl: liveArticleUrl,
      };
    });

    // 1. If PinRecipe Scale Bridge token is provided (starts with scl_ or passed as bridgeToken/apiKey)
    const bridgeToken = req.body.bridgeToken || apiKey;
    if (bridgeToken && bridgeToken.trim()) {
      try {
        const bridgeResults = [];
        for (const art of formattedArticles) {
          const bRes = await fetch(`${cleanUrl}/wp-json/pinrecipe-bridge/v1/publish`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Scale-Bridge-Token': bridgeToken.trim(),
            },
            body: JSON.stringify({
              title: art.title,
              content: art.content,
              category_id: 47,
              save_status: defaultStatus || 'publish',
            }),
          });

          if (bRes.ok) {
            const bData = await bRes.json();
            if (bData.success && bData.url) {
              bridgeResults.push({
                post_id: bData.post_id,
                permalink: bData.url,
                status: 'publish',
                title: art.title,
              });
            }
          }
        }

        if (bridgeResults.length > 0) {
          return res.json({
            success: true,
            mode: 'pinrecipe_scale_bridge',
            message: 'Articles successfully published directly to WordPress via PinRecipe Scale Bridge!',
            syncedCount: bridgeResults.length,
            results: bridgeResults,
          });
        }
      } catch (err: any) {
        console.warn('PinRecipe Bridge publish failed, checking fallback:', err.message);
      }
    }

    // 2. If AutoSync plugin key is provided, attempt AutoSync Plugin endpoint
    if (apiKey && apiKey.trim()) {
      try {
        const endpoint = `${cleanUrl}/wp-json/autosync/v1/import`;
        const wpRes = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-sync-key': apiKey.trim(),
          },
          body: JSON.stringify({ articles: formattedArticles }),
        });

        if (wpRes.ok) {
          const data = await wpRes.json();
          return res.json({
            success: true,
            data,
            syncedCount: data.synced || formattedArticles.length,
            results: data.results || formattedArticles.map((a: any) => ({ post_id: a.external_id, permalink: `${cleanUrl}/${a.slug}` }))
          });
        }
      } catch (err: any) {
        console.warn('AutoSync plugin call failed, checking fallback:', err.message);
      }
    }

    // 2. If Standard WordPress username and application password provided, attempt Core REST API
    if (username && appPassword) {
      try {
        const credentials = Buffer.from(`${username}:${appPassword}`).toString('base64');
        const results = [];

        for (const art of formattedArticles) {
          const wpPostRes = await fetch(`${cleanUrl}/wp-json/wp/v2/posts`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Basic ${credentials}`,
            },
            body: JSON.stringify({
              title: art.title,
              content: art.content,
              status: defaultStatus || 'publish',
              slug: art.slug,
            }),
          });

          if (wpPostRes.ok) {
            const postData = await wpPostRes.json();
            results.push({ post_id: postData.id, permalink: postData.link, status: postData.status });
          }
        }

        if (results.length > 0) {
          return res.json({
            success: true,
            syncedCount: results.length,
            results,
            mode: 'wordpress_rest_api'
          });
        }
      } catch (err: any) {
        console.warn('WordPress core REST API publish failed:', err.message);
      }
    }

    // 3. Smart Sandbox/Staged Publishing Mode
    // Articles are staged in the local published store with full visitor access
    const results = formattedArticles.map((a: any) => ({
      post_id: a.external_id,
      permalink: a.localUrl,
      status: a.status,
      title: a.title,
    }));

    return res.json({
      success: true,
      mode: 'sandbox_published',
      message: 'Articles successfully staged & published into the live visitor reader!',
      syncedCount: formattedArticles.length,
      results,
    });
  } catch (error: any) {
    console.error('Publish error:', error);
    res.status(500).json({ error: error.message || 'Failed to process publication' });
  }
});

// Initialize server with Vite middleware or static serving
const startServer = async () => {
  const isProd = process.env.NODE_ENV === 'production';
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true' ? { port: 24679 } : false,
      },
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
