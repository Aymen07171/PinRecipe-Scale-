import { RecipeItem } from '../types/pipeline';

export function generatePrintableRecipeHtml(recipe: RecipeItem): string {
  const ingredients = recipe.ingredients || [];
  const instructions = recipe.instructions || [];
  const chefTips = recipe.chefTips || [];
  const macros = recipe.macros || { protein: '28g', carbs: '32g', fat: '14g', fiber: '4g' };

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${recipe.title} - Gourmet Recipe Card</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body {
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            margin: 0;
            padding: 30px 20px;
            line-height: 1.55;
          }
          .recipe-sheet {
            max-width: 900px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 10px 40px -10px rgba(15, 23, 42, 0.08);
            border: 1px solid #e2e8f0;
            padding: 44px;
            position: relative;
            overflow: hidden;
          }
          .accent-bar {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6);
          }
          .masthead {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 18px;
            margin-bottom: 24px;
          }
          .masthead-brand {
            font-family: 'Outfit', sans-serif;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #ec4899;
          }
          .masthead-series {
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .header-grid {
            display: grid;
            grid-template-columns: 1fr 320px;
            gap: 32px;
            margin-bottom: 30px;
            align-items: center;
          }
          .recipe-badge-row {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-bottom: 12px;
          }
          .badge-pill {
            display: inline-block;
            background: #fdf2f8;
            color: #be185d;
            border: 1px solid #fbcfe8;
            padding: 3px 12px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .badge-pill.dietary {
            background: #f0fdf4;
            color: #15803d;
            border-color: #bbf7d0;
          }
          .badge-pill.diff {
            background: #fefce8;
            color: #a16207;
            border-color: #fef08a;
          }
          h1 {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 32px;
            font-weight: 800;
            line-height: 1.2;
            color: #0f172a;
            margin: 0 0 12px 0;
          }
          .meta-desc {
            font-size: 14px;
            color: #475569;
            margin: 0 0 20px 0;
            line-height: 1.6;
          }
          .hero-img-wrap {
            position: relative;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.12);
            border: 1px solid #e2e8f0;
            aspect-ratio: 4/3;
            max-height: 240px;
          }
          .hero-img-wrap img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }
          .hero-overlay-tag {
            position: absolute;
            bottom: 10px;
            right: 10px;
            background: rgba(15, 23, 42, 0.75);
            backdrop-filter: blur(4px);
            color: #fff;
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 10px;
            font-weight: 600;
          }
          .metrics-card {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 16px;
            margin-bottom: 24px;
            text-align: center;
          }
          .metric-cell .label {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #64748b;
            display: block;
            margin-bottom: 4px;
          }
          .metric-cell .val {
            font-family: 'Outfit', sans-serif;
            font-size: 17px;
            font-weight: 700;
            color: #0f172a;
          }
          .metric-cell .val.highlight {
            color: #ec4899;
          }
          .macros-row {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            background: #fff;
            border: 1px dashed #cbd5e1;
            padding: 10px 16px;
            border-radius: 10px;
            margin-bottom: 28px;
            font-size: 12px;
            color: #475569;
          }
          .macro-badge {
            font-weight: 700;
            color: #0f172a;
            background: #f1f5f9;
            padding: 2px 8px;
            border-radius: 6px;
            font-family: 'Outfit', sans-serif;
          }
          .two-col-layout {
            display: grid;
            grid-template-columns: 320px 1fr;
            gap: 32px;
            margin-bottom: 28px;
          }
          .section-title {
            font-family: 'Outfit', sans-serif;
            font-size: 16px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #0f172a;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 8px;
            margin: 0 0 16px 0;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .ingredient-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .ingredient-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 8px 10px;
            border-radius: 8px;
            font-size: 13px;
            margin-bottom: 4px;
            background: #fafafa;
            border: 1px solid #f1f5f9;
          }
          .checkbox-square {
            width: 14px;
            height: 14px;
            border: 1.5px solid #cbd5e1;
            border-radius: 4px;
            margin-top: 3px;
            flex-shrink: 0;
            background: #fff;
          }
          .ingredient-amount {
            font-family: 'Outfit', sans-serif;
            font-weight: 700;
            color: #0f172a;
            white-space: nowrap;
          }
          .ingredient-name {
            color: #334155;
          }
          .ingredient-notes {
            color: #64748b;
            font-size: 11px;
            font-style: italic;
          }
          .step-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .step-item {
            position: relative;
            padding-left: 48px;
            margin-bottom: 20px;
          }
          .step-num {
            position: absolute;
            left: 0;
            top: 0;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ec4899, #8b5cf6);
            color: #ffffff;
            font-family: 'Outfit', sans-serif;
            font-weight: 800;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(236, 72, 153, 0.3);
          }
          .step-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 4px;
          }
          .step-title {
            font-family: 'Outfit', sans-serif;
            font-size: 14px;
            font-weight: 700;
            color: #0f172a;
          }
          .step-timer {
            font-size: 11px;
            font-weight: 700;
            color: #8b5cf6;
            background: #f5f3ff;
            border: 1px solid #ede9fe;
            padding: 2px 8px;
            border-radius: 9999px;
            white-space: nowrap;
          }
          .step-text {
            font-size: 13px;
            color: #475569;
            margin: 0;
            line-height: 1.6;
          }
          .chef-tips-card {
            background: #fffbeb;
            border: 1px solid #fef3c7;
            border-left: 4px solid #f59e0b;
            border-radius: 12px;
            padding: 18px 22px;
            margin-bottom: 24px;
          }
          .chef-tips-title {
            font-family: 'Outfit', sans-serif;
            font-size: 13px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #92400e;
            margin: 0 0 8px 0;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .chef-tips-list {
            margin: 0;
            padding-left: 20px;
            font-size: 12.5px;
            color: #78350f;
          }
          .chef-tips-list li {
            margin-bottom: 6px;
          }
          .card-footer {
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: #94a3b8;
          }
          .print-toolbar {
            max-width: 900px;
            margin: 0 auto 20px auto;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
          }
          .btn {
            font-family: 'Outfit', sans-serif;
            font-size: 13px;
            font-weight: 700;
            padding: 10px 20px;
            border-radius: 10px;
            border: none;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
            transition: all 0.2s ease;
          }
          .btn-primary {
            background: linear-gradient(135deg, #ec4899, #8b5cf6);
            color: #fff;
            box-shadow: 0 4px 14px rgba(236, 72, 153, 0.25);
          }
          .btn-secondary {
            background: #ffffff;
            color: #475569;
            border: 1px solid #cbd5e1;
          }
          @media print {
            body { background: #ffffff; padding: 0; }
            .print-toolbar { display: none !important; }
            .recipe-sheet {
              box-shadow: none !important;
              border: none !important;
              padding: 12px !important;
              max-width: 100% !important;
            }
            .step-item, .ingredient-item, .chef-tips-card {
              break-inside: avoid;
              page-break-inside: avoid;
            }
          }
          @media (max-width: 768px) {
            .header-grid, .two-col-layout { grid-template-columns: 1fr; }
            .recipe-sheet { padding: 24px; }
          }
        </style>
      </head>
      <body>
        <div class="print-toolbar">
          <button onclick="window.close()" class="btn btn-secondary">← Close Preview</button>
          <button onclick="window.print()" class="btn btn-primary">🖨️ Print / Save as PDF</button>
        </div>

        <div class="recipe-sheet">
          <div class="accent-bar"></div>

          <div class="masthead">
            <span class="masthead-brand">PinRecipe Gourmet Collection</span>
            <span class="masthead-series">Chef Curated Series · Scale v4.0</span>
          </div>

          <div class="header-grid">
            <div>
              <div class="recipe-badge-row">
                <span class="badge-pill">${recipe.niche || 'Gourmet Dinners'}</span>
                <span class="badge-pill dietary">${recipe.dietary || 'Standard'}</span>
                <span class="badge-pill diff">${recipe.difficulty || 'Easy'}</span>
              </div>
              <h1>${recipe.title}</h1>
              <p class="meta-desc">${recipe.metaDescription || 'A foolproof gourmet culinary preparation engineered for unforgettable dining.'}</p>
            </div>

            <div class="hero-img-wrap">
              <img src="${recipe.imageUrl}" alt="${recipe.title}" />
              <div class="hero-overlay-tag">★ Chef Curated</div>
            </div>
          </div>

          <div class="metrics-card">
            <div class="metric-cell">
              <span class="label">Prep Time</span>
              <span class="val">${recipe.prepTime || '15 mins'}</span>
            </div>
            <div class="metric-cell">
              <span class="label">Cook Time</span>
              <span class="val">${recipe.cookTime || '20 mins'}</span>
            </div>
            <div class="metric-cell">
              <span class="label">Yield</span>
              <span class="val">${recipe.servings || '4 servings'}</span>
            </div>
            <div class="metric-cell">
              <span class="label">Calories</span>
              <span class="val highlight">${recipe.calories || 450} kcal</span>
            </div>
          </div>

          <div class="macros-row">
            <span><strong>Nutrition per Serving:</strong></span>
            <span>Protein: <span class="macro-badge">${macros.protein}</span></span>
            <span>Carbs: <span class="macro-badge">${macros.carbs}</span></span>
            <span>Fat: <span class="macro-badge">${macros.fat}</span></span>
            ${macros.fiber ? `<span>Fiber: <span class="macro-badge">${macros.fiber}</span></span>` : ''}
          </div>

          <div class="two-col-layout">
            <div>
              <h3 class="section-title">🛒 Ingredients (${ingredients.length})</h3>
              <ul class="ingredient-list">
                ${ingredients.map(ing => `
                  <li class="ingredient-item">
                    <span class="checkbox-square"></span>
                    <div>
                      <span class="ingredient-amount">${ing.amount}</span>
                      <span class="ingredient-name">${ing.item}</span>
                      ${ing.notes ? `<div class="ingredient-notes">(${ing.notes})</div>` : ''}
                    </div>
                  </li>
                `).join('')}
              </ul>
            </div>

            <div>
              <h3 class="section-title">👨‍🍳 Step-by-Step Method</h3>
              <ol class="step-list">
                ${instructions.map((step, idx) => `
                  <li class="step-item">
                    <span class="step-num">${String(step.step || idx + 1).padStart(2, '0')}</span>
                    <div class="step-header">
                      <span class="step-title">${step.title || `Phase ${idx + 1}`}</span>
                      ${step.timerMinutes ? `<span class="step-timer">⏱️ ${step.timerMinutes} min timer</span>` : ''}
                    </div>
                    <p class="step-text">${step.text}</p>
                  </li>
                `).join('')}
              </ol>
            </div>
          </div>

          ${chefTips.length > 0 ? `
            <div class="chef-tips-card">
              <div class="chef-tips-title">💡 Executive Chef Pro Tips & Secrets</div>
              <ul class="chef-tips-list">
                ${chefTips.map(tip => `<li>${tip}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <div class="card-footer">
            <span>Generated with PinRecipe Scale Engine (Tool AYMAN) · Google Schema.org Compliant</span>
            <span>Online Recipe: ${recipe.wpPostUrl || 'https://foodsprepared.wasmer.app'}</span>
          </div>
        </div>

        <script>
          // Automatic print trigger on direct print window open if requested
          if (window.location.search.includes('print=true')) {
            window.onload = () => { setTimeout(() => window.print(), 400); };
          }
        </script>
      </body>
    </html>
  `;
}

export function openPrintRecipeWindow(recipe: RecipeItem): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to open the printable recipe PDF card.');
    return;
  }
  const html = generatePrintableRecipeHtml(recipe);
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
