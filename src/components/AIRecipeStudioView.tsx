import React, { useState } from 'react';
import { RecipeItem } from '../types/pipeline';
import { 
  Sparkles, 
  ChefHat, 
  Clock, 
  Flame, 
  Copy, 
  Check, 
  Code, 
  FileText, 
  Plus, 
  Trash2,
  RefreshCw,
  Share2,
  BookOpen,
  Download
} from 'lucide-react';

interface AIRecipeStudioViewProps {
  currentRecipe: RecipeItem;
  onUpdateRecipe: (updated: RecipeItem) => void;
  onSynthesizeNew: (topic: string, niche: string, dietary: string) => Promise<void>;
  isSynthesizing: boolean;
}

export const AIRecipeStudioView: React.FC<AIRecipeStudioViewProps> = ({
  currentRecipe,
  onUpdateRecipe,
  onSynthesizeNew,
  isSynthesizing,
}) => {
  const [topicInput, setTopicInput] = useState('');
  const [nicheInput, setNicheInput] = useState(currentRecipe.niche || 'Quick & Easy Dinners');
  const [dietaryInput, setDietaryInput] = useState('');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'editor' | 'schema' | 'gutenberg'>('editor');

  const handleCopySchema = () => {
    if (currentRecipe.schemaJsonLd) {
      navigator.clipboard.writeText(JSON.stringify(currentRecipe.schemaJsonLd, null, 2));
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 2000);
    }
  };

  const handleRunSynthesis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    await onSynthesizeNew(topicInput.trim(), nicheInput, dietaryInput);
    setTopicInput('');
  };

  const handleDownloadPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${currentRecipe.title} - Recipe PDF</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #1e293b; line-height: 1.6; }
            h1 { font-size: 24px; color: #0f172a; margin-bottom: 8px; }
            .meta { font-size: 14px; color: #64748b; margin-bottom: 24px; }
            .badge { display: inline-block; background: #fce7f3; color: #db2777; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-bottom: 12px; }
            img { max-width: 100%; height: auto; border-radius: 12px; margin: 16px 0; max-height: 350px; object-fit: cover; }
            .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0; text-align: center; }
            .grid div { font-size: 13px; }
            .grid strong { display: block; font-size: 16px; color: #0f172a; }
            h3 { font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px; }
            ul, ol { padding-left: 20px; }
            li { margin-bottom: 8px; }
            .footer { margin-top: 40px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 16px; }
          </style>
        </head>
        <body>
          <div class="badge">${currentRecipe.niche} · ${currentRecipe.dietary}</div>
          <h1>${currentRecipe.title}</h1>
          <div class="meta">${currentRecipe.metaDescription}</div>
          ${currentRecipe.imageUrl ? `<img src="${currentRecipe.imageUrl}" alt="${currentRecipe.title}" />` : ''}
          <div class="grid">
            <div>Prep Time<strong>${currentRecipe.prepTime}</strong></div>
            <div>Cook Time<strong>${currentRecipe.cookTime}</strong></div>
            <div>Yield<strong>${currentRecipe.servings}</strong></div>
            <div>Calories<strong>${currentRecipe.calories} kcal</strong></div>
          </div>
          <h3>Ingredients</h3>
          <ul>
            ${currentRecipe.ingredients.map(i => `<li><strong>${i.amount}</strong> ${i.item} ${i.notes ? '(' + i.notes + ')' : ''}</li>`).join('')}
          </ul>
          <h3>Instructions</h3>
          <ol>
            ${currentRecipe.instructions.map(s => `<li><strong>${s.title}:</strong> ${s.text}</li>`).join('')}
          </ol>
          ${currentRecipe.chefTips && currentRecipe.chefTips.length > 0 ? `
            <h3>Chef's Pro Tips</h3>
            <ul>
              ${currentRecipe.chefTips.map(t => `<li>${t}</li>`).join('')}
            </ul>
          ` : ''}
          <div class="footer">
            Generated with PinRecipe Scale Engine (Tool AYMAN) · <a href="${currentRecipe.wpPostUrl || '#'}" target="_blank">View Online Recipe</a>
          </div>
          <script>
            window.onload = () => { window.print(); };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Ingestion Form */}
      <div className="bg-[#0f172a]/90 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                Programmatic Culinary Synthesis Studio
              </h2>
              <p className="text-xs text-slate-400">
                Generate high-ranking recipes, structured nutrition, and Google Schema.org markups with Gemini.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-500/30 px-2.5 py-1 rounded-full">
            Gemini 3.8 Engine
          </span>
        </div>

        <form onSubmit={handleRunSynthesis} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Recipe Concept / Target Keyword
            </label>
            <input
              type="text"
              placeholder="e.g. Crispy Honey Garlic Butter Chicken Thighs"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Culinary Niche
            </label>
            <select
              value={nicheInput}
              onChange={(e) => setNicheInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
            >
              <option value="Quick & Easy Dinners">Quick & Easy Dinners</option>
              <option value="High-Protein & Keto">High-Protein & Keto</option>
              <option value="Moroccan & Tagine Classics">Moroccan & Tagine Classics</option>
              <option value="Decadent Desserts">Decadent Desserts</option>
              <option value="Crispy Air Fryer Magic">Crispy Air Fryer Magic</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={isSynthesizing || !topicInput.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-medium shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSynthesizing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Synthesize via Gemini</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Main Recipe Inspector / Editor */}
      <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {/* Sub-Tabs Bar */}
        <div className="border-b border-slate-800 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('editor')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeSubTab === 'editor'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Full Recipe Editor
            </button>
            <button
              onClick={() => setActiveSubTab('schema')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'schema'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3 h-3 text-emerald-400" />
              <span>Google Recipe Schema (JSON-LD)</span>
            </button>
            <button
              onClick={() => setActiveSubTab('gutenberg')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'gutenberg'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3 h-3 text-indigo-400" />
              <span>Gutenberg HTML Card</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeSubTab === 'schema' && (
              <button
                onClick={handleCopySchema}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-md border border-slate-700 transition-colors"
              >
                {copiedSchema ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSchema ? 'Copied!' : 'Copy JSON-LD'}</span>
              </button>
            )}
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 rounded-lg shadow transition-all"
              title="Download recipe as a printable PDF for visitors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Full Recipe Editor */}
        {activeSubTab === 'editor' && (
          <div className="p-5 space-y-6">
            {/* Header Meta */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    SEO Recipe Title
                  </label>
                  <input
                    type="text"
                    value={currentRecipe.title}
                    onChange={(e) => onUpdateRecipe({ ...currentRecipe, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm font-semibold text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Meta Description (Google SERP Snippet)
                  </label>
                  <textarea
                    rows={2}
                    value={currentRecipe.metaDescription}
                    onChange={(e) => onUpdateRecipe({ ...currentRecipe, metaDescription: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Photo & Quick Stats */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-24 rounded-lg overflow-hidden border border-slate-700/60 bg-slate-950 shrink-0">
                    <img
                      src={currentRecipe.imageUrl}
                      alt={currentRecipe.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="text-slate-400 font-medium">Prep: <span className="text-white font-mono">{currentRecipe.prepTime}</span></div>
                    <div className="text-slate-400 font-medium">Cook: <span className="text-white font-mono">{currentRecipe.cookTime}</span></div>
                    <div className="text-slate-400 font-medium">Yield: <span className="text-white font-mono">{currentRecipe.servings}</span></div>
                    <div className="text-slate-400 font-medium">Energy: <span className="text-amber-400 font-mono">{currentRecipe.calories} kcal</span></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-center pt-2 mt-2 border-t border-slate-800 text-[10px] font-mono">
                  <div className="bg-slate-800/60 rounded p-1">
                    <span className="text-slate-400 block">Protein</span>
                    <span className="text-emerald-400 font-semibold">{currentRecipe.macros.protein}</span>
                  </div>
                  <div className="bg-slate-800/60 rounded p-1">
                    <span className="text-slate-400 block">Carbs</span>
                    <span className="text-indigo-400 font-semibold">{currentRecipe.macros.carbs}</span>
                  </div>
                  <div className="bg-slate-800/60 rounded p-1">
                    <span className="text-slate-400 block">Fat</span>
                    <span className="text-amber-400 font-semibold">{currentRecipe.macros.fat}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ingredients & Cooking Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
              {/* Ingredients List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Structured Ingredients ({currentRecipe.ingredients.length})
                  </h3>
                  <button
                    onClick={() => {
                      const updated = [...currentRecipe.ingredients, { item: 'New Ingredient', amount: '1 unit' }];
                      onUpdateRecipe({ ...currentRecipe, ingredients: updated });
                    }}
                    className="text-[11px] text-pink-400 hover:text-pink-300 inline-flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Row
                  </button>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {currentRecipe.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-lg p-2 text-xs">
                      <input
                        type="text"
                        value={ing.amount}
                        placeholder="Amount"
                        onChange={(e) => {
                          const updated = [...currentRecipe.ingredients];
                          updated[idx].amount = e.target.value;
                          onUpdateRecipe({ ...currentRecipe, ingredients: updated });
                        }}
                        className="w-24 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-pink-300 font-mono text-[11px]"
                      />
                      <input
                        type="text"
                        value={ing.item}
                        placeholder="Item"
                        onChange={(e) => {
                          const updated = [...currentRecipe.ingredients];
                          updated[idx].item = e.target.value;
                          onUpdateRecipe({ ...currentRecipe, ingredients: updated });
                        }}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs"
                      />
                      <button
                        onClick={() => {
                          const updated = currentRecipe.ingredients.filter((_, i) => i !== idx);
                          onUpdateRecipe({ ...currentRecipe, ingredients: updated });
                        }}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Step-by-Step Method ({currentRecipe.instructions.length} Steps)
                </h3>
                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {currentRecipe.instructions.map((inst, idx) => (
                    <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-pink-400 font-mono text-[11px]">
                          Step {inst.step}. {inst.title}
                        </span>
                        {inst.timerMinutes && (
                          <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                            <Clock className="w-2.5 h-2.5" /> {inst.timerMinutes} min
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">{inst.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chef Tips */}
            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Chef's Pro Tips
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-400">
                {currentRecipe.chefTips.map((tip, idx) => (
                  <li key={idx} className="bg-slate-900/40 border border-slate-800/80 rounded-lg p-2.5 flex items-start gap-2">
                    <span className="text-pink-400 font-bold">★</span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Google Recipe Schema JSON-LD */}
        {activeSubTab === 'schema' && (
          <div className="p-5">
            <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
              {JSON.stringify(currentRecipe.schemaJsonLd || {}, null, 2)}
            </pre>
          </div>
        )}

        {/* Tab 3: Gutenberg HTML Card */}
        {activeSubTab === 'gutenberg' && (
          <div className="p-5 space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto">
              <div className="text-slate-500 mb-2">// Copy into WordPress Custom HTML / Gutenberg Block:</div>
              <code>
{`<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">${currentRecipe.title}</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>${currentRecipe.metaDescription}</p>
<!-- /wp:paragraph -->

<div class="pinrecipe-card" style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 24px 0;">
  <h3>Prep Time: ${currentRecipe.prepTime} | Cook Time: ${currentRecipe.cookTime} | Servings: ${currentRecipe.servings}</h3>
  <h4>Ingredients</h4>
  <ul>
${currentRecipe.ingredients.map(i => `    <li><strong>${i.amount}</strong> ${i.item}</li>`).join('\n')}
  </ul>
  <h4>Instructions</h4>
  <ol>
${currentRecipe.instructions.map(s => `    <li><strong>${s.title}:</strong> ${s.text}</li>`).join('\n')}
  </ol>
</div>`}
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
