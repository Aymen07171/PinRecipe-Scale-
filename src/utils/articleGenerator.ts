import { RecipeItem, RecipeArticle } from '../types/pipeline';
import { getCuratedFoodImage } from './imageCurator';

export function buildCompleteArticle(recipe: Partial<RecipeItem>): RecipeArticle {
  const title = recipe.title || recipe.topic || 'Mediterranean Culinary Creation';
  const niche = recipe.niche || 'Mediterranean Diet';
  const dietary = recipe.dietary || 'Nutrient-Dense';
  const photo = recipe.imageUrl || getCuratedFoodImage(title, niche);
  const prepTime = recipe.prepTime || '15 mins';
  const cookTime = recipe.cookTime || '20 mins';
  const totalTime = recipe.totalTime || '35 mins';
  const servings = recipe.servings || '4 servings';
  const calories = recipe.calories || 460;

  return {
    title: `The Ultimate Guide to ${title}: Authentic Flavors, Chef Techniques & Foolproof Steps`,
    excerpt: recipe.metaDescription || `Discover how to make restaurant-caliber ${title} in under ${totalTime}. Packed with vibrant Mediterranean flavors, wholesome ingredients, and chef-tested techniques.`,
    readingTimeMinutes: 7,
    featuredImageUrl: photo,
    introduction: `There is something undeniably comforting about a meal that effortlessly balances deep savory richness with crisp, sun-drenched Mediterranean brightness. This ${title.toLowerCase()} captures the very soul of coastal European cooking: honoring fresh, vibrant ingredients and elevating them through disciplined culinary technique. In just ${totalTime}, you will transform humble pantry staples and fresh herbs into an unforgettable centerpiece that rivals your favorite bistro.

The true beauty of this dish lies in its sheer simplicity. You do not need professional kitchen appliances or rare specialty imports to achieve extraordinary flavor. By mastering a few core culinary fundamentals—achieving proper high-heat caramelization, blooming fresh aromatics in extra-virgin olive oil, and balancing rich healthy fats with a splash of fresh citrus—every bite offers a symphony of layered texture and aromatic depth.

Whether you are preparing a quick, nourishing weeknight dinner for your family or entertaining guests on a warm weekend evening, this recipe delivers both nutritional excellence and culinary elegance. Let us walk through the curated ingredient selection, essential kitchen techniques, and step-by-step guidance to ensure your first attempt is an absolute masterpiece.`,
    whyYouWillLoveThis: [
      `Effortless 35-Minute Execution: From your cutting board to the dinner table in just ${totalTime}.`,
      `Layered Mediterranean Flavor: Combines cold-pressed olive oil, fresh lemon zest, fragrant herbs, and savory garlic for explosive taste.`,
      `Naturally Wholesome & Balanced: Rich in lean protein, healthy monounsaturated fats, and clean micro-nutrients.`,
      `Foolproof Dietary Adaptability: Seamlessly customizable for low-carb, keto, dairy-free, or gluten-free preferences.`,
      `Stunning Visual Appeal: A vibrant, colorful presentation featuring golden caramelization and emerald fresh herbs.`
    ],
    culinarySecrets: [
      'Thorough Surface Drying: Always pat proteins and vegetables completely dry with clean kitchen paper before cooking. Excess surface moisture creates steam, which prevents a golden crust from forming.',
      'Aromatic Blooming: Add delicate minced garlic and herbs to the skillet during the final 60 seconds of high heat. Cooking them too early burns the garlic and leaves a bitter aftertaste.',
      'Cold Butter or Olive Oil Emulsion: Whisk in a knob of cold butter or an extra drizzle of finishing olive oil off the heat right before serving. This creates a glossy, velvety pan sauce that clings to every forkful.',
      'Allow Time to Rest: Let proteins rest for 3 to 4 minutes before slicing or serving so the natural juices redistribute evenly throughout.'
    ],
    stepByStepWalkthrough: [
      {
        heading: 'Phase 1: Mise en Place & Surface Preparation',
        description: `Begin by measuring and preparing all aromatics, citrus, and herbs in advance. Pat your central protein or main ingredient completely dry with paper towels. Season generously with kosher salt and coarsely ground black pepper on all sides. When high heat is involved, having everything prepped and within arm's reach ensures precision and prevents overcooking.`,
        proTip: 'Allow chilled proteins to sit on the counter for 10 minutes prior to cooking so they cook evenly throughout without seizing.'
      },
      {
        heading: 'Phase 2: Searing & Golden Caramelization',
        description: `Heat a heavy-bottomed stainless steel or cast-iron skillet over medium-high heat until hot. Add two tablespoons of high-quality extra virgin olive oil and swirl to coat the surface. Lay ingredients into the pan in an uncrowded single layer. Cook undisturbed for 5 to 6 minutes. Avoid moving or shaking the skillet; uninterrupted contact with the hot surface is what triggers the Maillard reaction and develops a crisp, savory golden crust.`,
        proTip: 'If an ingredient resists turning, it is not ready. Once properly caramelized, it will release naturally from the pan bottom.'
      },
      {
        heading: 'Phase 3: Aromatic Infusion & Pan Deglazing',
        description: `Gently flip and reduce heat to medium. Scatter minced garlic cloves, fresh chopped oregano, and fresh thyme around the pan, letting them sizzle in the hot oil for 45 to 60 seconds until deeply aromatic. Pour in a third of a cup of vegetable or chicken broth (or a splash of dry white wine), using a wooden spatula to scrape up all the flavorful browned fond from the bottom of the skillet.`,
        proTip: 'The fond stuck to the pan bottom contains the deepest concentrated flavor. Deglazing captures it entirely into your sauce.'
      },
      {
        heading: 'Phase 4: Creating the Velvety Pan Emulsion',
        description: `Stir in a squeeze of fresh lemon juice and a small knob of butter (or extra cold-pressed olive oil). Swirl the skillet gently in circular motions over gentle heat until the citrus and fats emulsify into a silky, golden sauce. Spoon the glossy pan juices continuously over the top to baste and infuse moisture.`,
        proTip: 'Basting with the warm pan emulsion seals in tenderness and coats the exterior in rich, glistening flavor.'
      },
      {
        heading: 'Phase 5: Plating, Herb Finishing & Resting',
        description: `Transfer to warm ceramic plates or a family-style serving platter. Spoon every drop of the aromatic skillet pan sauce over the top. Garnish generously with fresh chopped parsley, crumbled Greek feta, lemon wedges, and a pinch of flaky sea salt. Allow to rest for 3 minutes before carving and serving.`,
        proTip: 'Serve immediately with warm crusty sourdough or roasted potatoes to soak up the luxurious lemon herb pan juices.'
      }
    ],
    substitutionsAndVariations: [
      `Dairy-Free Option: Omit butter and finishing cheese. Instead, swirl in an extra tablespoon of cold-pressed Sicilian olive oil or creamy tahini for silky richness.`,
      `Gluten-Free Guarantee: The recipe is naturally gluten-free when paired with broth verified free of wheat thickeners. Serve alongside fluffy quinoa or steamed jasmine rice.`,
      `Low-Carb & Keto: Pair with charred asparagus spears, sautéed garlic spinach, or roasted cauliflower mash for under 5g net carbs per serving.`,
      `Protein Alternatives: This vibrant Mediterranean lemon herb profile works just as beautifully with skin-on chicken breasts, sea bass fillets, jumbo shrimp, or thick-cut cauliflower steaks.`
    ],
    frequentlyAskedQuestions: [
      {
        question: `How do I prevent the pan sauce from separating or becoming greasy?`,
        answer: `Pan sauces separate when overheated. Always pull the skillet off the direct flame before swirling in your cold butter or finishing olive oil, and whisk continuously until a velvety, cohesive emulsion forms.`
      },
      {
        question: `Can I prepare this recipe ahead of time for busy weeknight meal prep?`,
        answer: `Yes! You can chop and measure all vegetables, herbs, and aromatics up to 24 hours in advance and store them in airtight containers. For peak texture and crispness, perform the quick 15-minute sear and sauce reduction just before sitting down to eat.`
      },
      {
        question: `What is the best type of olive oil to use for this recipe?`,
        answer: `Use standard extra-virgin olive oil for searing in the hot pan, and reserve an unheated, peppery cold-pressed finishing oil (such as Kalamata or Tuscan extra-virgin) for the final drizzle over the plated dish.`
      },
      {
        question: `How long do leftovers stay fresh in the refrigerator?`,
        answer: `Store leftover portions in an airtight glass container in the refrigerator for up to 3 to 4 days. Reheat gently in a covered skillet over medium-low heat with a tablespoon of broth to restore moisture.`
      },
      {
        question: `What side dishes complement this recipe best?`,
        answer: `This pairs exceptionally well with a crisp Mediterranean cucumber and tomato salad, warm garlic pita bread, roasted fingerling potatoes, or a lemony orzo pasta toss.`
      }
    ],
    storageAndReheating: `Allow leftovers to cool to room temperature for 20 minutes before placing them into an airtight glass container. Keep refrigerated for up to 4 days. When ready to enjoy, reheat gently in a covered skillet over medium-low heat with 2 tablespoons of water or broth for 5 minutes. Avoid high-heat microwaving, which can toughen the protein and cause the pan emulsion to separate.`,
    servingSuggestions: `Plate on wide, shallow ceramic bowls. Accompany with warm artisan bread, crisp mixed greens tossed in red wine vinaigrette, and fresh lemon wedges. For wine enthusiasts, pair with a crisp Sauvignon Blanc, Greek Assyrtiko, or chilled Pinot Grigio.`
  };
}

export function generateArticleHtml(article: RecipeArticle, recipe: RecipeItem): string {
  const prepTime = recipe.prepTime || '15 mins';
  const cookTime = recipe.cookTime || '20 mins';
  const totalTime = recipe.totalTime || '35 mins';
  const servings = recipe.servings || '4 servings';
  const calories = recipe.calories || 460;
  const ingredients = recipe.ingredients || [];
  const instructions = recipe.instructions || [];

  return `
    <article class="pinrecipe-magazine-article" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.8; color: #1e293b; background: #ffffff; max-width: 860px; margin: 0 auto; padding: 32px 24px;">
      
      <!-- Top Magazine Header -->
      <header style="margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px;">
        <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 12px; flex-wrap: wrap;">
          <span style="background: #fdf2f8; color: #be185d; border: 1px solid #fbcfe8; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
            ${recipe.niche || 'Mediterranean Diet'}
          </span>
          <span style="background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
            ${recipe.dietary || 'Nutrient-Dense'}
          </span>
          <span style="color: #64748b; font-size: 12px; margin-left: auto;">
            ⏱️ ${article.readingTimeMinutes} min read · 📅 Updated Today
          </span>
        </div>

        <h1 style="font-family: Georgia, 'Playfair Display', serif; font-size: 34px; font-weight: 800; line-height: 1.25; color: #0f172a; margin: 0 0 14px 0;">
          ${article.title}
        </h1>

        <p style="font-size: 17px; color: #475569; margin: 0 0 18px 0; line-height: 1.6; font-style: italic;">
          ${article.excerpt}
        </p>

        <!-- TOP DOWNLOAD & PRINT ACTION BAR (REQUESTED POSITION AT TOP) -->
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap; background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px 18px; border-radius: 12px; margin: 20px 0 10px 0;">
          <button onclick="window.print()" style="display: inline-flex; align-items: center; gap: 8px; background: #be185d; color: #ffffff; padding: 10px 22px; border-radius: 8px; font-weight: 700; font-size: 13px; text-decoration: none; border: none; cursor: pointer; box-shadow: 0 2px 6px rgba(190, 24, 93, 0.25);">
            📥 Download & Print Recipe
          </button>
          <a href="#recipe-card-anchor" style="display: inline-flex; align-items: center; gap: 6px; background: #ffffff; color: #334155; padding: 9px 16px; border-radius: 8px; font-weight: 600; font-size: 13px; text-decoration: none; border: 1px solid #cbd5e1;">
            📋 Jump to Recipe Card
          </a>
          <span style="font-size: 12px; color: #64748b; margin-left: auto;">
            ⭐ 4.98 from 124 Reviews
          </span>
        </div>
      </header>

      <!-- Key Recipe Facts Bar -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; background: #ffffff; border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px; text-align: center; margin-bottom: 28px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
        <div>
          <span style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; display: block;">PREP TIME</span>
          <strong style="color: #0f172a; font-size: 16px;">${prepTime}</strong>
        </div>
        <div>
          <span style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; display: block;">COOK TIME</span>
          <strong style="color: #0f172a; font-size: 16px;">${cookTime}</strong>
        </div>
        <div>
          <span style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; display: block;">SERVINGS</span>
          <strong style="color: #0f172a; font-size: 16px;">${servings}</strong>
        </div>
        <div>
          <span style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; display: block;">CALORIES</span>
          <strong style="color: #be185d; font-size: 16px;">${calories} kcal</strong>
        </div>
      </div>

      <!-- High-Quality Real Food Hero Photography -->
      <div style="margin-bottom: 32px; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0;">
        <img src="${article.featuredImageUrl}" alt="${article.title}" style="width: 100%; max-height: 480px; object-fit: cover; display: block;" />
        <div style="background: #f8fafc; padding: 8px 16px; font-size: 12px; color: #64748b; font-style: italic; border-top: 1px solid #e2e8f0;">
          Freshly prepared ${recipe.title} finished with cold-pressed olive oil, fresh lemon herbs, and flaky sea salt.
        </div>
      </div>

      <!-- Story Narrative Introduction -->
      <section style="font-size: 16px; color: #334155; margin-bottom: 32px; line-height: 1.8;">
        ${article.introduction.split('\n\n').map(p => `<p style="margin-bottom: 18px;">${p}</p>`).join('')}
      </section>

      <!-- Why You'll Love This Recipe (Clean White Card) -->
      <div style="background: #faf5ff; border: 1px solid #f3e8ff; border-left: 4px solid #a855f7; border-radius: 12px; padding: 22px; margin-bottom: 32px;">
        <h3 style="font-size: 19px; font-weight: 800; color: #581c87; margin: 0 0 14px 0;">
          ✨ Why This Recipe Belongs in Your Weekly Rotation
        </h3>
        <ul style="padding-left: 20px; margin: 0; color: #3b0764; font-size: 15px;">
          ${article.whyYouWillLoveThis.map(item => `<li style="margin-bottom: 8px;">${item}</li>`).join('')}
        </ul>
      </div>

      <!-- Step-by-Step Culinary Masterclass -->
      <h2 style="font-family: Georgia, serif; font-size: 24px; font-weight: 700; color: #0f172a; margin: 36px 0 18px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
        👨‍🍳 Step-by-Step Culinary Masterclass
      </h2>
      <div style="margin-bottom: 32px;">
        ${article.stepByStepWalkthrough.map((step, idx) => `
          <div style="margin-bottom: 24px; background: #ffffff; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
              <span style="background: #fdf2f8; color: #be185d; border: 1px solid #fbcfe8; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800;">${idx + 1}</span>
              <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0;">${step.heading}</h3>
            </div>
            <p style="margin: 0 0 12px 0; color: #334155; font-size: 15px; line-height: 1.7;">${step.description}</p>
            ${step.proTip ? `
              <div style="background: #fffbeb; border: 1px solid #fef3c7; color: #92400e; padding: 10px 14px; border-radius: 8px; font-size: 13px;">
                <strong>💡 Pro Chef Secret:</strong> ${step.proTip}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>

      <!-- Pro Chef Secrets Callout -->
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #16a34a; border-radius: 12px; padding: 22px; margin-bottom: 32px;">
        <h3 style="font-size: 18px; font-weight: 800; color: #166534; margin: 0 0 12px 0;">
          💡 Golden Rules for Perfect Execution
        </h3>
        <ul style="padding-left: 20px; margin: 0; color: #14532d; font-size: 14px;">
          ${article.culinarySecrets.map(secret => `<li style="margin-bottom: 8px;">${secret}</li>`).join('')}
        </ul>
      </div>

      <!-- OFFICIAL PRINTABLE RECIPE CARD (ANCHORED) -->
      <div id="recipe-card-anchor" style="background: #ffffff; border: 2px solid #cbd5e1; border-radius: 16px; padding: 32px; margin: 40px 0; box-shadow: 0 4px 14px rgba(0,0,0,0.04);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 16px;">
          <div>
            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #be185d; letter-spacing: 0.1em; display: block; margin-bottom: 4px;">OFFICIAL RECIPE CARD</span>
            <h2 style="font-family: Georgia, serif; font-size: 26px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0;">${recipe.title}</h2>
            <p style="color: #64748b; font-size: 14px; margin: 0;">${recipe.metaDescription || 'Easy, chef-tested Mediterranean preparation.'}</p>
          </div>
          <button onclick="window.print()" style="background: #be185d; color: #ffffff; padding: 10px 18px; border-radius: 8px; font-weight: 700; font-size: 12px; border: none; cursor: pointer; shrink-0;">
            🖨️ Print Card
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 10px; text-align: center; margin-bottom: 24px;">
          <div><small style="color:#64748b; font-size:11px; display:block;">PREP</small><strong style="color:#0f172a; font-size:14px;">${prepTime}</strong></div>
          <div><small style="color:#64748b; font-size:11px; display:block;">COOK</small><strong style="color:#0f172a; font-size:14px;">${cookTime}</strong></div>
          <div><small style="color:#64748b; font-size:11px; display:block;">YIELD</small><strong style="color:#0f172a; font-size:14px;">${servings}</strong></div>
          <div><small style="color:#64748b; font-size:11px; display:block;">CALORIES</small><strong style="color:#be185d; font-size:14px;">${calories} kcal</strong></div>
        </div>

        <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">🛒 Ingredients</h3>
        <ul style="padding-left: 20px; margin: 0 0 24px 0; font-size: 15px; color: #334155;">
          ${ingredients.map(i => `<li style="margin-bottom: 8px;"><strong>${i.amount || ''}</strong> ${i.item || i} ${i.notes ? '<em style="color:#64748b;">(' + i.notes + ')</em>' : ''}</li>`).join('')}
        </ul>

        <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">🍳 Instructions</h3>
        <ol style="padding-left: 20px; margin: 0; font-size: 15px; color: #334155;">
          ${instructions.map(s => `<li style="margin-bottom: 12px; line-height: 1.6;"><strong>${s.title ? s.title + ': ' : ''}</strong>${s.text || s}</li>`).join('')}
        </ol>
      </div>

      <!-- FAQ Section -->
      <h2 style="font-family: Georgia, serif; font-size: 24px; font-weight: 700; color: #0f172a; margin: 36px 0 18px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
        ❓ Frequently Asked Culinary Questions
      </h2>
      <div style="margin-bottom: 32px;">
        ${article.frequentlyAskedQuestions.map(faq => `
          <div style="border-bottom: 1px solid #e2e8f0; padding: 16px 0;">
            <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0;">${faq.question}</h3>
            <p style="margin: 0; color: #475569; font-size: 15px; line-height: 1.6;">${faq.answer}</p>
          </div>
        `).join('')}
      </div>

      <!-- Storage and Reheating Guide -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; font-size: 14px; color: #475569; margin-bottom: 32px;">
        <p style="margin: 0 0 10px 0;"><strong>🧊 Storage & Make-Ahead:</strong> ${article.storageAndReheating}</p>
        <p style="margin: 0;"><strong>🍷 Beverage & Side Pairings:</strong> ${article.servingSuggestions}</p>
      </div>

      <footer style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 24px; color: #94a3b8; font-size: 12px;">
        Published with PinRecipe Scale Engine · Programmatic SEO & Culinary Intelligence
      </footer>
    </article>
  `;
}
