import { RecipeItem, WordPressConfig, PinterestConfig } from '../types/pipeline';
import trufflePastaImg from '../assets/images/recipe_truffle_pasta_1791456194437.jpg';
import salmonBowlImg from '../assets/images/recipe_salmon_bowl_1791456206016.jpg';
import berryCheesecakeImg from '../assets/images/recipe_berry_cheesecake_1791456217003.jpg';
import moroccanTagineImg from '../assets/images/recipe_moroccan_tagine_1791456228215.jpg';

export const INITIAL_RECIPES: RecipeItem[] = [
  {
    id: 'rec-01',
    topic: 'Creamy Wild Mushroom & Black Truffle Tagliatelle',
    title: 'Creamy Wild Mushroom & Black Truffle Tagliatelle',
    slug: 'creamy-wild-mushroom-black-truffle-tagliatelle',
    niche: 'Quick & Easy Dinners',
    dietary: 'Vegetarian',
    status: 'completed',
    currentStepIndex: 4,
    progress: 100,
    imageUrl: trufflePastaImg,
    macroPhotoPrompt: 'Macro close-up food photography of creamy wild mushroom and black truffle tagliatelle, freshly shaved parmesan cheese, chopped Italian parsley, steam rising, shallow depth of field, warm rustic restaurant lighting.',
    prepTime: '15 mins',
    cookTime: '20 mins',
    totalTime: '35 mins',
    servings: '4 servings',
    calories: 520,
    difficulty: 'Easy',
    macros: {
      protein: '18g',
      carbs: '64g',
      fat: '22g',
      fiber: '4g'
    },
    ingredients: [
      { item: 'Fresh Tagliatelle Pasta', amount: '400g', notes: 'egg-based pasta preferred' },
      { item: 'Assorted Wild Mushrooms (Chanterelles, Cremini, Shiitake)', amount: '350g', notes: 'sliced thick' },
      { item: 'Black Truffle Carpaccio or Puree', amount: '2 tbsp' },
      { item: 'Heavy Whipping Cream', amount: '200ml' },
      { item: 'Parmigiano-Reggiano', amount: '60g', notes: 'freshly grated' },
      { item: 'Garlic Cloves', amount: '3 cloves', notes: 'finely minced' },
      { item: 'Fresh Italian Flat-Leaf Parsley', amount: '2 tbsp', notes: 'chopped' },
      { item: 'Flaky Sea Salt & Cracked Black Pepper', amount: 'to taste' }
    ],
    instructions: [
      { step: 1, title: 'Sauté the Forest Mushrooms', text: 'Melt unsalted butter with olive oil in a heavy stainless skillet over medium-high heat. Add mushrooms in an even layer without crowding and sear for 6 minutes until deeply caramelized and golden brown.', timerMinutes: 6 },
      { step: 2, title: 'Infuse Aromatics & Cream', text: 'Stir in minced garlic and cook for 60 seconds until fragrant. Deglaze the skillet with a splash of dry white wine or vegetable broth, scraping up browned bits. Pour in heavy cream and simmer gently for 4 minutes.', timerMinutes: 4 },
      { step: 3, title: 'Boil Pasta to Al Dente', text: 'In a large pot of rolling salted water, cook the tagliatelle for 3 minutes until al dente. Reserve half a cup of starchy pasta water before draining.', timerMinutes: 3 },
      { step: 4, title: 'Glossy Emulsion & Truffle Infusion', text: 'Transfer drained pasta straight into the cream skillet. Fold in black truffle puree, freshly grated Parmigiano-Reggiano, and a splash of reserved pasta water. Toss vigorously until a glossy, clinging velvet glaze forms.', timerMinutes: 2 },
      { step: 5, title: 'Plate & Garnish', text: 'Twirl onto warm pasta bowls. Top with freshly shaved truffles, extra Parmigiano-Reggiano curls, cracked tellicherry pepper, and fresh parsley.' }
    ],
    chefTips: [
      'Do not salt the mushrooms until they have browned; salting too early releases water and prevents that signature deep roasted crust.',
      'Always reserve starchy pasta cooking water to marry the sauce and pasta into an authentic restaurant glaze.'
    ],
    metaDescription: 'Discover how to make restaurant-quality creamy wild mushroom & black truffle tagliatelle in 35 minutes. Luxurious, rich, and simple to master at home.',
    focusKeyword: 'black truffle pasta recipe',
    schemaJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: 'Creamy Wild Mushroom & Black Truffle Tagliatelle',
      description: 'Luxurious 35-minute Italian tagliatelle pasta enveloped in wild forest mushrooms and aromatic black truffle cream sauce.',
      prepTime: 'PT15M',
      cookTime: 'PT20M',
      totalTime: 'PT35M',
      recipeYield: '4 servings',
      recipeCategory: 'Dinner',
      recipeCuisine: 'Italian'
    },
    pinterestPin: {
      title: '30-Min Creamy Truffle & Wild Mushroom Pasta (Restaurant Quality!)',
      description: 'The ultimate date-night pasta! Silky tagliatelle tossed with caramelized chanterelles, rich cream, and shaved black truffles. Save this easy gourmet dinner idea!',
      hashtags: ['#trufflepasta', '#pastanight', '#weeknightdinner', '#easyitalianrecipes'],
      overlayHeadline: '30-Min Gourmet Truffle Pasta',
      board: 'Quick & Easy Dinners',
      scheduledTime: 'Today at 6:30 PM',
      status: 'scheduled'
    },
    wpStatus: 'published',
    wpPostUrl: 'https://foodsprepared.wasmer.app/creamy-wild-mushroom-black-truffle-tagliatelle',
    wpCategory: 'Quick & Easy Dinners',
    createdAt: '2026-10-08T02:15:00Z',
    completedAt: '2026-10-08T02:16:30Z',
    healthScore: 100,
    logEntries: [
      '10:15:01 - Ingested keyword "black truffle pasta recipe"',
      '10:15:14 - Gemini AI generated 8 ingredients, 5 steps, and schema.org JSON-LD',
      '10:15:28 - Synthesized macro photo asset (2:3 Pinterest optimized)',
      '10:15:52 - WordPress REST API created draft post #2481 and uploaded media',
      '10:16:15 - Pinterest scheduled pin to board "Quick & Easy Dinners" for 6:30 PM'
    ]
  },
  {
    id: 'rec-02',
    topic: 'Glazed Teriyaki Salmon & Avocado Power Bowl',
    title: 'Glazed Teriyaki Salmon & Avocado Power Bowl',
    slug: 'glazed-teriyaki-salmon-avocado-power-bowl',
    niche: 'High-Protein & Keto',
    dietary: 'Gluten-Free, Dairy-Free',
    status: 'completed',
    currentStepIndex: 4,
    progress: 100,
    imageUrl: salmonBowlImg,
    macroPhotoPrompt: 'Macro food photography of a vibrant teriyaki glazed grilled salmon power bowl with avocado slices, edamame, pickled ginger, sesame seeds, glistening marinade, editorial culinary magazine style.',
    prepTime: '15 mins',
    cookTime: '12 mins',
    totalTime: '27 mins',
    servings: '2 bowls',
    calories: 590,
    difficulty: 'Easy',
    macros: {
      protein: '42g',
      carbs: '38g',
      fat: '28g',
      fiber: '7g'
    },
    ingredients: [
      { item: 'Wild Alaskan Salmon Fillets', amount: '2 fillets (180g each)', notes: 'skin on, pin bones removed' },
      { item: 'Tamari or Low-Sodium Soy Sauce', amount: '3 tbsp' },
      { item: 'Pure Maple Syrup or Honey', amount: '2 tbsp' },
      { item: 'Fresh Grated Ginger & Garlic', amount: '1 tbsp each' },
      { item: 'Hass Avocado', amount: '1 whole', notes: 'thinly fanned' },
      { item: 'Steamed Edamame & English Cucumber', amount: '1 cup total' },
      { item: 'Toasted Jasmine Rice or Cauliflower Rice', amount: '2 cups' },
      { item: 'Toasted White & Black Sesame Seeds', amount: '1 tbsp' }
    ],
    instructions: [
      { step: 1, title: 'Whisk the Sticky Glaze', text: 'In a small saucepan, combine tamari, maple syrup, minced ginger, garlic, and a teaspoon of rice vinegar. Simmer for 3 minutes until thick and glossy.', timerMinutes: 3 },
      { step: 2, title: 'Pan-Sear the Salmon', text: 'Heat avocado oil in a cast-iron skillet over high heat. Place salmon skin-side down and sear for 4 minutes until crispy. Flip, spoon over the glaze, and baste continuously for 3 more minutes.', timerMinutes: 7 },
      { step: 3, title: 'Assemble the Power Bowls', text: 'Divide warm jasmine rice into deep ceramic bowls. Arrange fanned avocado, steamed edamame, ribboned cucumber, and pickled ginger in separate quadrants.', timerMinutes: 3 },
      { step: 4, title: 'Garnish & Serve', text: 'Rest the glistening salmon fillet in the center. Drizzle remaining teriyaki glaze over the top and shower with toasted sesame seeds and sliced scallions.' }
    ],
    chefTips: [
      'Pat the salmon skin completely dry with paper towels before hitting the hot pan to ensure crackling crispy skin.',
      'For a strict keto version, swap jasmine rice for cilantro lime riced cauliflower and use sugar-free allulose teriyaki.'
    ],
    metaDescription: 'Quick 27-minute Teriyaki Salmon & Avocado Power Bowl packed with 42g protein and healthy fats. Flaky glazed salmon over fluffy rice with crisp veggies.',
    focusKeyword: 'teriyaki salmon bowl recipe',
    schemaJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: 'Glazed Teriyaki Salmon & Avocado Power Bowl',
      description: 'High-protein nourishing power bowl featuring pan-seared crispy skin salmon coated in honey ginger teriyaki glaze.',
      prepTime: 'PT15M',
      cookTime: 'PT12M',
      totalTime: 'PT27M',
      recipeYield: '2 bowls',
      recipeCategory: 'High-Protein',
      recipeCuisine: 'Japanese-American'
    },
    pinterestPin: {
      title: 'High-Protein Teriyaki Salmon Bowl (42g Protein & 25 Mins!)',
      description: 'This sticky glazed salmon bowl with creamy avocado and edamame is the easiest meal prep dinner ever! Healthy, loaded with flavor, and so satisfying.',
      hashtags: ['#salmonbowl', '#highproteinmeals', '#healthyrecipes', '#mealprepideas'],
      overlayHeadline: '42g Protein Salmon Power Bowl',
      board: 'High-Protein & Keto',
      scheduledTime: 'Today at 8:00 PM',
      status: 'scheduled'
    },
    wpStatus: 'published',
    wpPostUrl: 'https://foodsprepared.wasmer.app/glazed-teriyaki-salmon-avocado-power-bowl',
    wpCategory: 'High-Protein & Keto',
    createdAt: '2026-10-08T02:40:00Z',
    completedAt: '2026-10-08T02:41:15Z',
    healthScore: 100,
    logEntries: [
      '10:40:02 - Ingested keyword "teriyaki salmon bowl recipe"',
      '10:40:19 - Gemini AI drafted macronutrient profile (42g protein) & SEO tags',
      '10:40:32 - Synthesized macro food photo asset',
      '10:40:55 - WordPress published post #2482 with Gutenberg recipe card',
      '10:41:12 - Pinterest Pin scheduled for 8:00 PM'
    ]
  },
  {
    id: 'rec-03',
    topic: 'Artisanal Moroccan Lemon & Olive Chicken Tagine',
    title: 'Artisanal Moroccan Lemon & Olive Chicken Tagine',
    slug: 'artisanal-moroccan-lemon-olive-chicken-tagine',
    niche: 'Moroccan & Tagine Classics',
    dietary: 'Gluten-Free, Dairy-Free',
    status: 'completed',
    currentStepIndex: 4,
    progress: 100,
    imageUrl: moroccanTagineImg,
    macroPhotoPrompt: 'Macro culinary food photography of authentic Moroccan chicken tagine with preserved lemons, green olives, fragrant saffron ginger sauce, fresh cilantro, artisanal ceramic cookware.',
    prepTime: '20 mins',
    cookTime: '45 mins',
    totalTime: '65 mins',
    servings: '4 servings',
    calories: 460,
    difficulty: 'Medium',
    macros: {
      protein: '39g',
      carbs: '12g',
      fat: '24g',
      fiber: '3g'
    },
    ingredients: [
      { item: 'Skinless Chicken Thighs & Drumsticks', amount: '900g', notes: 'bone-in for maximum richness' },
      { item: 'Preserved Lemons (Moroccan Ch\'ladd)', amount: '1 whole', notes: 'pulp removed, rind cut in strips' },
      { item: 'Castelvetrano or Moroccan Red Olives', amount: '1 cup', notes: 'pitted & rinsed' },
      { item: 'Spanish Saffron Strands', amount: '1 pinch', notes: 'bloomed in 2 tbsp warm water' },
      { item: 'Ground Ginger & Turmeric', amount: '1 tsp each' },
      { item: 'Smoked Sweet Paprika & Cumin', amount: '1/2 tsp each' },
      { item: 'Yellow Onions', amount: '2 large', notes: 'finely grated to form the daghmira sauce base' },
      { item: 'Fresh Cilantro & Flat Parsley', amount: '1/2 cup finely chopped' }
    ],
    instructions: [
      { step: 1, title: 'Chermoula Spice Marinade', text: 'In a bowl, mix minced garlic, ground ginger, turmeric, saffron water, black pepper, and olive oil. Coat the chicken pieces thoroughly and marinate for at least 15 minutes.', timerMinutes: 15 },
      { step: 2, title: 'Build the Onion Base in the Tagine', text: 'Heat 3 tablespoons of extra virgin olive oil in a traditional clay tagine or heavy Dutch oven. Spread the grated onions across the base, then nestle the marinated chicken on top.', timerMinutes: 5 },
      { step: 3, title: 'Slow Simmer until Fall-Apart Tender', text: 'Cover with the conical lid and cook on low heat for 35 minutes. The chicken will render its own concentrated aromatic juices into the onions without adding excess water.', timerMinutes: 35 },
      { step: 4, title: 'Add Preserved Lemon & Olives', text: 'Scatter preserved lemon peel ribbons and olives around the chicken. Cook uncovered for 10 minutes to reduce the sauce into a thick, glossy, golden daghmira sauce.', timerMinutes: 10 },
      { step: 5, title: 'Serve Straight from the Tagine', text: 'Finish with chopped fresh coriander and serve piping hot alongside crusty Moroccan khobz bread.' }
    ],
    chefTips: [
      'Grate the onions instead of chopping them—this is the authentic Moroccan secret to achieving the rich, jammy daghmira reduction.',
      'Rinse your preserved lemons before slicing to calibrate the salt level perfectly.'
    ],
    metaDescription: 'Authentic Moroccan Chicken Tagine with preserved lemons, green olives, and saffron. Step-by-step traditional recipe with meltingly tender chicken.',
    focusKeyword: 'authentic chicken tagine recipe',
    schemaJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: 'Artisanal Moroccan Lemon & Olive Chicken Tagine',
      description: 'Slow-simmered tender chicken infused with preserved lemons, saffron, and green olives in a fragrant onion reduction.',
      prepTime: 'PT20M',
      cookTime: 'PT45M',
      totalTime: 'PT65M',
      recipeYield: '4 servings',
      recipeCategory: 'Moroccan Cuisine',
      recipeCuisine: 'Moroccan'
    },
    pinterestPin: {
      title: 'Authentic Moroccan Chicken Tagine with Preserved Lemons & Olives',
      description: 'Fall-apart tender chicken simmered in saffron, ginger, and preserved lemons. The ultimate comforting dinner recipe that fills your kitchen with incredible aromas!',
      hashtags: ['#chickentagine', '#moroccanfood', '#traditionalcooking', '#dinnergoals'],
      overlayHeadline: 'Authentic Moroccan Tagine',
      board: 'Moroccan & Tagine Classics',
      scheduledTime: 'Tomorrow at 12:00 PM',
      status: 'scheduled'
    },
    wpStatus: 'published',
    wpPostUrl: 'https://foodsprepared.wasmer.app/artisanal-moroccan-lemon-olive-chicken-tagine',
    wpCategory: 'Moroccan & Tagine Classics',
    createdAt: '2026-10-08T03:00:00Z',
    completedAt: '2026-10-08T03:01:20Z',
    healthScore: 100,
    logEntries: [
      '11:00:05 - Ingested keyword "authentic chicken tagine recipe"',
      '11:00:22 - Gemini AI structured ingredients, Moroccan chermoula, and daghmira reduction steps',
      '11:00:41 - Generated macro food photo in clay tagine',
      '11:01:03 - Published to WordPress tagine collection',
      '11:01:18 - Pinterest bulk pin added to Moroccan Flavors board'
    ]
  },
  {
    id: 'rec-04',
    topic: 'Velvety New York Berry Swirl Cheesecake',
    title: 'Velvety New York Berry Swirl Cheesecake',
    slug: 'velvety-new-york-berry-swirl-cheesecake',
    niche: 'Decadent Desserts',
    dietary: 'Vegetarian',
    status: 'completed',
    currentStepIndex: 4,
    progress: 100,
    imageUrl: berryCheesecakeImg,
    macroPhotoPrompt: 'Macro close-up shot of a slice of New York berry cheesecake with glossy dripping blueberry and raspberry coulis, mint leaf garnish, crumbly graham crust, soft morning window light.',
    prepTime: '30 mins',
    cookTime: '60 mins',
    totalTime: '90 mins',
    servings: '12 slices',
    calories: 480,
    difficulty: 'Medium',
    macros: {
      protein: '9g',
      carbs: '42g',
      fat: '31g',
      fiber: '2g'
    },
    ingredients: [
      { item: 'Full-Fat Philadelphia Cream Cheese', amount: '900g', notes: 'brought to room temperature' },
      { item: 'Granulated Sugar', amount: '220g' },
      { item: 'Large Farm Eggs', amount: '4 whole + 1 yolk', notes: 'room temperature' },
      { item: 'Sour Cream', amount: '180g' },
      { item: 'Pure Madagascar Vanilla Extract', amount: '1 tbsp' },
      { item: 'Graham Cracker Crumbs', amount: '200g' },
      { item: 'Melted Unsalted Butter', amount: '80g' },
      { item: 'Wild Blueberry & Raspberry Reduction', amount: '1 cup' }
    ],
    instructions: [
      { step: 1, title: 'Press the Graham Crust', text: 'Combine graham cracker crumbs with melted butter and sugar. Press firmly into the base of a 9-inch springform pan. Bake at 350°F (175°C) for 10 minutes, then cool completely.', timerMinutes: 10 },
      { step: 2, title: 'Silky Cream Cheese Batter', text: 'Beat cream cheese on low speed until smooth. Gradually add sugar and flour without whipping in air. Incorporate vanilla and sour cream.', timerMinutes: 5 },
      { step: 3, title: 'Gentle Egg Incorporation', text: 'Add eggs one at a time on low speed, mixing just until each yolk disappears. Do not over-beat to prevent cracks during baking.', timerMinutes: 4 },
      { step: 4, title: 'Water Bath Baking', text: 'Pour batter over the crust. Swirl in berry coulis with a toothpick. Wrap pan in heavy-duty foil and bake in a hot water bath at 300°F (150°C) for 60 minutes until edges are set with a slight center jiggle.', timerMinutes: 60 },
      { step: 5, title: 'Chill & Serve', text: 'Turn oven off and let cheesecake rest inside with the door propped open for 1 hour. Chill in refrigerator for at least 6 hours before slicing.' }
    ],
    chefTips: [
      'Room temperature ingredients are non-negotiable for lump-free cheesecake batter.',
      'Cooling the cheesecake slowly inside the turned-off oven prevents unsightly cracks on the surface.'
    ],
    metaDescription: 'The creamiest New York Berry Swirl Cheesecake with a buttery graham crust and dripping wild berry coulis. Never cracks with our foolproof water-bath method.',
    focusKeyword: 'new york berry cheesecake recipe',
    schemaJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: 'Velvety New York Berry Swirl Cheesecake',
      description: 'Ultra-creamy classic New York style cheesecake crowned with glossy homemade raspberry blueberry coulis.',
      prepTime: 'PT30M',
      cookTime: 'PT60M',
      totalTime: 'PT90M',
      recipeYield: '12 slices',
      recipeCategory: 'Dessert',
      recipeCuisine: 'American'
    },
    pinterestPin: {
      title: 'Foolproof New York Berry Swirl Cheesecake (No Cracks!)',
      description: 'The creamiest, most decadent New York style cheesecake with a thick graham cracker crust and vibrant berry swirl. Save this showstopper holiday dessert!',
      hashtags: ['#cheesecakerecipe', '#bakinglove', '#holidaydesserts', '#newyorkcheesecake'],
      overlayHeadline: 'Velvety Berry Cheesecake',
      board: 'Baking & Desserts',
      scheduledTime: 'Tomorrow at 4:00 PM',
      status: 'scheduled'
    },
    wpStatus: 'published',
    wpPostUrl: 'https://foodsprepared.wasmer.app/velvety-new-york-berry-swirl-cheesecake',
    wpCategory: 'Decadent Desserts',
    createdAt: '2026-10-08T03:15:00Z',
    completedAt: '2026-10-08T03:16:45Z',
    healthScore: 100,
    logEntries: [
      '11:15:00 - Ingested keyword "new york berry cheesecake recipe"',
      '11:15:18 - Gemini generated pastry chef temperature timings and water-bath specs',
      '11:15:35 - Synthesized macro dessert photography asset',
      '11:16:02 - Synced to WordPress with Recipe JSON-LD schema',
      '11:16:30 - Added to Pinterest Bulk Scheduler for Baking & Desserts'
    ]
  }
];

export const NICHE_PRESETS = [
  {
    niche: 'Quick & Easy Dinners',
    description: '30-minute weeknight dinners for busy families and professionals',
    examples: ['Sheet Pan Garlic Herb Shrimp', 'Creamy Tuscan Sun-Dried Tomato Chicken', '15-Minute Spicy Sesame Noodles']
  },
  {
    niche: 'High-Protein & Keto',
    description: 'Low-carb, high-satiety macronutrient powerhouse recipes',
    examples: ['Bacon Wrapped Stuffed Pork Tenderloin', 'Crispy Parmesan Crusted Salmon', 'Keto Cheddar Garlic Biscuits']
  },
  {
    niche: 'Moroccan & Tagine Classics',
    description: 'Authentic North African slow-cooked aromatic culinary gems',
    examples: ['Lamb Tagine with Prunes and Toasted Almonds', 'Spiced Moroccan Harira Lentil Soup', 'Vegetable Couscous Royale']
  },
  {
    niche: 'Decadent Desserts',
    description: 'High-aesthetic viral pastries, artisan cakes, and cookies',
    examples: ['Salted Caramel Molten Lava Cakes', 'Crispy Churro Bites with Mexican Chocolate', 'Pistachio White Chocolate Blondies']
  },
  {
    niche: 'Crispy Air Fryer Magic',
    description: 'Ultra-crispy oil-free comfort meals engineered for Pinterest clicks',
    examples: ['Crispy Air Fryer Bang Bang Cauliflower', 'Garlic Parmesan Air Fryer Wings', 'Air Fryer Cinnamon Donut Holes']
  }
];

export const DEFAULT_WP_CONFIG: WordPressConfig = {
  url: 'https://foodsprepared.wasmer.app',
  username: 'admin',
  appPassword: '',
  syncApiKey: '',
  useAutoSyncPlugin: true,
  defaultStatus: 'publish',
  isConnected: true,
  activeCategories: [
    { id: 1, name: 'Recipes', slug: 'recipes', count: 0 },
    { id: 2, name: 'Quick & Easy Dinners', slug: 'quick-dinners', count: 0 },
    { id: 3, name: 'High-Protein & Keto', slug: 'keto-recipes', count: 0 },
    { id: 4, name: 'Moroccan & Tagine Classics', slug: 'moroccan-cuisine', count: 0 },
    { id: 5, name: 'Decadent Desserts', slug: 'desserts', count: 0 },
    { id: 6, name: 'Air Fryer Specials', slug: 'air-fryer', count: 0 }
  ]
};

export const DEFAULT_PINTEREST_CONFIG: PinterestConfig = {
  defaultBoard: 'Quick & Easy Dinners',
  boards: [
    'Quick & Easy Dinners',
    'High-Protein & Keto',
    'Moroccan & Tagine Classics',
    'Baking & Desserts',
    'Crispy Air Fryer Magic'
  ],
  intervalMinutes: 45,
  enableJitter: true,
  utmCampaign: 'pinrecipe_scale_v4',
  autoSaveToFeed: true
};
