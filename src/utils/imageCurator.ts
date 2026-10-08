// Curated high-resolution culinary photography library
// Provides beautiful, appetizing imagery across culinary niches, specific dishes, and ingredients

import trufflePastaImg from '../assets/images/recipe_truffle_pasta_1791456194437.jpg';
import salmonBowlImg from '../assets/images/recipe_salmon_bowl_1791456206016.jpg';
import berryCheesecakeImg from '../assets/images/recipe_berry_cheesecake_1791456217003.jpg';
import moroccanTagineImg from '../assets/images/recipe_moroccan_tagine_1791456228215.jpg';

export interface CulinaryImageMatch {
  url: string;
  alt: string;
  source: 'local' | 'curated_unsplash';
}

export const CURATED_FOOD_IMAGES: Array<{
  keywords: string[];
  url: string;
  alt: string;
}> = [
  // Local high-res assets & Gemini culinary photographs
  {
    keywords: ['salmon', 'lemon herb', 'sheet pan salmon', 'mediterranean salmon', 'pan-seared salmon', 'wild salmon'],
    url: '/images/mediterranean_salmon.jpg',
    alt: 'Sheet Pan Lemon Herb Mediterranean Salmon with Fresh Dill and Olives',
  },
  {
    keywords: ['greek feta', 'stuffed chicken', 'sun-dried tomato', 'feta chicken', 'spinach stuffed', 'greek chicken'],
    url: '/images/greek_feta_chicken.jpg',
    alt: 'Crispy Greek Feta & Sun-Dried Tomato Stuffed Chicken Breast',
  },
  {
    keywords: ['orzo', 'mediterranean orzo', 'garlic orzo', 'orzo skillet', 'creamy orzo', 'artichoke orzo'],
    url: '/images/mediterranean_orzo.jpg',
    alt: 'Creamy Garlic & Lemon Mediterranean Orzo Skillet with Spinach and Artichokes',
  },
  {
    keywords: ['truffle', 'pasta', 'tagliatelle', 'fettuccine', 'mushroom pasta', 'spaghetti', 'carbonara', 'alfredo'],
    url: trufflePastaImg,
    alt: 'Creamy Wild Mushroom & Black Truffle Tagliatelle',
  },
  {
    keywords: ['salmon bowl', 'poke bowl', 'grain bowl', 'seafood bowl', 'avocado salmon', 'rice bowl'],
    url: salmonBowlImg,
    alt: 'Crispy Miso Glazed Salmon Bowl with Avocado and Edamame',
  },
  {
    keywords: ['cheesecake', 'berry cheesecake', 'new york cheesecake', 'basque cheesecake'],
    url: berryCheesecakeImg,
    alt: 'Silky Vanilla Bean Basque Burnt Cheesecake with Glazed Berries',
  },
  {
    keywords: ['moroccan', 'tagine', 'tajine', 'prunes', 'lamb tagine', 'couscous', 'harira', 'north african'],
    url: moroccanTagineImg,
    alt: 'Slow-Cooked Royal Moroccan Lamb Tagine with Toasted Almonds',
  },

  // Breakfast, Brunch, Pancakes, Waffles, Eggs
  {
    keywords: ['pancake', 'pancakes', 'ricotta pancake', 'lemon pancake', 'buttermilk pancake', 'fluffy pancake', 'blueberry pancake', 'crepe', 'crepes'],
    url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1200&q=80',
    alt: 'Golden Fluffy Lemon Ricotta Pancakes with Fresh Berries and Maple Syrup',
  },
  {
    keywords: ['waffle', 'waffles', 'belgian waffle'],
    url: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=1200&q=80',
    alt: 'Crispy Golden Belgian Waffles with Powdered Sugar and Syrup',
  },
  {
    keywords: ['french toast', 'brioche toast', 'cinnamon toast'],
    url: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=1200&q=80',
    alt: 'Custardy Golden Brioche French Toast with Berries and Honey',
  },
  {
    keywords: ['avocado toast', 'poached egg', 'avocado', 'sourdough toast', 'guacamole toast'],
    url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80',
    alt: 'Artisan Avocado Toast with Poached Egg, Chili Flakes and Microgreens',
  },
  {
    keywords: ['egg', 'eggs', 'benedict', 'frittata', 'omelet', 'omelette', 'scrambled', 'breakfast'],
    url: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=1200&q=80',
    alt: 'Classic Eggs Benedict with Silky Hollandaise and Fresh Chives',
  },
  {
    keywords: ['smoothie bowl', 'acai', 'acai bowl', 'chia', 'granola bowl'],
    url: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=1200&q=80',
    alt: 'Vibrant Antioxidant Acai Smoothie Bowl with Fresh Fruit and Granola',
  },

  // Italian, Pasta, Pizza & Baked Dishes
  {
    keywords: ['lasagna', 'lasagne', 'baked ziti', 'cannelloni'],
    url: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=1200&q=80',
    alt: 'Layered Traditional Italian Lasagna with Bubbling Bechamel and Bolognese',
  },
  {
    keywords: ['pizza', 'margherita', 'pepperoni', 'flatbread', 'calzone'],
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    alt: 'Wood-Fired Neapolitan Pizza with Fresh Basil and Melted Mozzarella',
  },
  {
    keywords: ['risotto', 'mushroom risotto', 'parmesan risotto', 'arborio'],
    url: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=1200&q=80',
    alt: 'Creamy Pan-Seared Wild Mushroom Risotto with Fresh Thyme',
  },
  {
    keywords: ['mac and cheese', 'macaroni', 'cheddar pasta', 'cheese sauce'],
    url: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=80',
    alt: 'Baked Gourmet Cheddar Macaroni and Cheese with Crispy Panko Crust',
  },
  {
    keywords: ['gnocchi', 'potato gnocchi', 'pesto gnocchi'],
    url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80',
    alt: 'Pan-Seared Brown Butter Sage Gnocchi',
  },

  // Meat, Steak, Poultry & Comfort Foods
  {
    keywords: ['steak', 'ribeye', 'beef', 'sirloin', 'tenderloin', 'filet mignon', 'garlic butter steak'],
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    alt: 'Cast Iron Seared Ribeye Steak with Rosemary Garlic Butter Basting',
  },
  {
    keywords: ['beef bourguignon', 'beef stew', 'pot roast', 'short rib', 'brisket'],
    url: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=1200&q=80',
    alt: 'Slow-Braised French Beef Bourguignon with Pearl Onions and Herbs',
  },
  {
    keywords: ['burger', 'cheeseburger', 'sliders', 'patty', 'hamburger'],
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    alt: 'Artisan Wagyu Cheeseburger with Melted Aged Cheddar on Brioche',
  },
  {
    keywords: ['chicken thighs', 'honey garlic chicken', 'bbq chicken', 'roast chicken', 'chicken breast', 'skillet chicken'],
    url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1200&q=80',
    alt: 'Glazed Honey Garlic Roasted Chicken Thighs with Sesame Garnish',
  },
  {
    keywords: ['wings', 'air fryer wings', 'buffalo wings', 'crispy wings', 'chicken wings'],
    url: 'https://images.unsplash.com/photo-1527477378408-1bc09c2a311b?auto=format&fit=crop&w=1200&q=80',
    alt: 'Golden Crispy Glazed Wings with Herbs and Dipping Sauce',
  },
  {
    keywords: ['pork', 'pork chops', 'ribs', 'bbq ribs', 'tenderloin', 'bacon'],
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    alt: 'Savory Seared Garlic Herb Pork with Pan Juices',
  },

  // Seafood & Shellfish
  {
    keywords: ['shrimp', 'prawn', 'scampi', 'garlic shrimp', 'butter shrimp'],
    url: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=1200&q=80',
    alt: 'Garlic Butter Sautéed Jumbo Shrimp with Lemon and Fresh Parsley',
  },
  {
    keywords: ['fish', 'cod', 'halibut', 'sea bass', 'white fish', 'snapper', 'trout'],
    url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
    alt: 'Pan-Seared White Fish Fillet with Lemon Caper Herb Butter',
  },
  {
    keywords: ['lobster', 'crab', 'scallops', 'calamari', 'seafood'],
    url: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=1200&q=80',
    alt: 'Pan-Seared Gourmet Jumbo Scallops with Herb Infusion',
  },

  // Mexican & Latin Cuisine
  {
    keywords: ['taco', 'tacos', 'birria', 'carnitas', 'fish taco', 'street taco'],
    url: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=80',
    alt: 'Artisan Mexican Street Tacos with Fresh Cilantro, Lime and Salsas',
  },
  {
    keywords: ['burrito', 'fajita', 'fajitas', 'enchilada', 'enchiladas', 'quesadilla', 'nachos'],
    url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1200&q=80',
    alt: 'Loaded Sizzling Mexican Fajita Skillet with Peppers and Tortillas',
  },

  // Asian, Noodles, Bowls & Curries
  {
    keywords: ['ramen', 'pho', 'noodle soup', 'udon', 'japanese noodles'],
    url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80',
    alt: 'Steaming Artisan Japanese Tonkotsu Ramen with Soft Boiled Egg and Chashu',
  },
  {
    keywords: ['sushi', 'sashimi', 'maki', 'roll', 'nigiri'],
    url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Fresh Handcrafted Sushi Roll Platter with Wasabi and Pickled Ginger',
  },
  {
    keywords: ['curry', 'tikka masala', 'butter chicken', 'korma', 'curried', 'coconut curry'],
    url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80',
    alt: 'Rich Aromatic Coconut Curry with Fresh Herbs and Fragrant Rice',
  },
  {
    keywords: ['stir fry', 'fried rice', 'pad thai', 'chow mein', 'wok'],
    url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80',
    alt: 'Sizzling Wok Vegetable Stir Fry with Crispy Tofu and Sesame',
  },

  // Soups, Stews & Salads
  {
    keywords: ['soup', 'chowder', 'tomato soup', 'butternut', 'bisque', 'lentil soup', 'broth'],
    url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80',
    alt: 'Velvety Roasted Tomato and Garlic Soup with Fresh Basil Drizzle',
  },
  {
    keywords: ['salad', 'caesar', 'greek salad', 'caprese', 'cobb', 'greens', 'buddha bowl', 'quinoa bowl'],
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    alt: 'Vibrant Mediterranean Artisan Salad Bowl with Fresh Herbs and Feta',
  },

  // Baking, Desserts, Cookies & Cakes
  {
    keywords: ['chocolate cake', 'lava cake', 'brownie', 'brownies', 'fudge', 'molten'],
    url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Decadent Dark Chocolate Molten Lava Cake with Gooey Center',
  },
  {
    keywords: ['cookie', 'cookies', 'chocolate chip', 'biscuit', 'shortbread'],
    url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=80',
    alt: 'Warm Soft-Baked Chocolate Chip Cookies with Melting Pockets',
  },
  {
    keywords: ['pie', 'apple pie', 'tart', 'pastry', 'puff pastry', 'galette'],
    url: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=1200&q=80',
    alt: 'Artisan Golden Cinnamon Spiced Apple Pie with Flaky Crust',
  },
  {
    keywords: ['donut', 'donuts', 'doughnut', 'cinnamon roll', 'churro', 'churros'],
    url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80',
    alt: 'Artisan Glazed Cinnamon Brioche Donut with Spiced Glaze',
  },
  {
    keywords: ['bread', 'focaccia', 'sourdough', 'baguette', 'loaf', 'brioche', 'garlic bread'],
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    alt: 'Artisan Rosemary Sea Salt Focaccia with Golden Olive Oil Crust',
  },
];

export function getCuratedFoodImage(topic: string, niche?: string): string {
  const query = `${topic} ${niche || ''}`.toLowerCase();

  // 1. Direct multi-word match priority
  for (const item of CURATED_FOOD_IMAGES) {
    for (const kw of item.keywords) {
      if (query.includes(kw.toLowerCase())) {
        return item.url;
      }
    }
  }

  // 2. Individual word token matching
  const words = query.split(/[^a-z0-9]+/).filter(w => w.length >= 4);
  for (const word of words) {
    for (const item of CURATED_FOOD_IMAGES) {
      if (item.keywords.some(k => k.toLowerCase().includes(word))) {
        return item.url;
      }
    }
  }

  // 3. Fallback to delicious food image
  const fallbackIndex = Math.abs(hashString(query)) % CURATED_FOOD_IMAGES.length;
  return CURATED_FOOD_IMAGES[fallbackIndex].url;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
