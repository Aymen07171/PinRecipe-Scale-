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
  Download,
  Globe,
  CheckCircle2,
  Printer,
  Star
} from 'lucide-react';

import { openPrintRecipeWindow } from '../utils/pdfGenerator';
import { buildCompleteArticle, generateArticleHtml } from '../utils/articleGenerator';

interface AIRecipeStudioViewProps {
  currentRecipe: RecipeItem;
  onUpdateRecipe: (updated: RecipeItem) => void;
  onSynthesizeNew: (topic: string, niche: string, dietary: string) => Promise<void>;
  isSynthesizing: boolean;
  onOpenArticleModal?: (recipe: RecipeItem) => void;
}

export const AIRecipeStudioView: React.FC<AIRecipeStudioViewProps> = ({
  currentRecipe,
  onUpdateRecipe,
  onSynthesizeNew,
  isSynthesizing,
  onOpenArticleModal,
}) => {
  const [topicInput, setTopicInput] = useState('');
  const [nicheInput, setNicheInput] = useState(currentRecipe?.niche || 'Quick & Easy Dinners');
  const [dietaryInput, setDietaryInput] = useState('');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'editor' | 'schema' | 'gutenberg' | 'article'>('editor');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const handleCopySchema = () => {
    if (currentRecipe?.schemaJsonLd) {
      navigator.clipboard.writeText(JSON.stringify(currentRecipe.schemaJsonLd, null, 2));
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 2000);
    }
  };

  const handleGenerateImage = async () => {
    if (!currentRecipe) return;
    setIsGeneratingImage(true);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: currentRecipe.title,
          niche: currentRecipe.niche,
          prompt: currentRecipe.macroPhotoPrompt,
          recipeId: currentRecipe.id,
        }),
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        onUpdateRecipe({
          ...currentRecipe,
          imageUrl: data.imageUrl,
          logEntries: [
            ...currentRecipe.logEntries,
            `${new Date().toLocaleTimeString()} - Generated AI culinary image via ${data.source}`
          ]
        });
      }
    } catch (err) {
      console.error('Failed to generate image:', err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleRunSynthesis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    await onSynthesizeNew(topicInput.trim(), nicheInput, dietaryInput);
    setTopicInput('');
  };

  const handleDownloadPdf = () => {
    if (!currentRecipe) return;
    openPrintRecipeWindow(currentRecipe);
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
              onClick={() => setActiveSubTab('article')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'article'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3 h-3 text-pink-400" />
              <span>Full Magazine Article</span>
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
            {onOpenArticleModal && (
              <button
                onClick={() => onOpenArticleModal(currentRecipe)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 shadow transition-all"
                title="Open and read the full culinary article in modal"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>Read Full Article</span>
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
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-24 rounded-lg overflow-hidden border border-slate-700/60 bg-slate-950 shrink-0">
                      <img
                        src={currentRecipe.imageUrl}
                        alt={currentRecipe.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="space-y-1 text-xs flex-1">
                      <div className="text-slate-400 font-medium">Prep: <span className="text-white font-mono">{currentRecipe.prepTime}</span></div>
                      <div className="text-slate-400 font-medium">Cook: <span className="text-white font-mono">{currentRecipe.cookTime}</span></div>
                      <div className="text-slate-400 font-medium">Yield: <span className="text-white font-mono">{currentRecipe.servings}</span></div>
                      <div className="text-slate-400 font-medium">Energy: <span className="text-amber-400 font-mono">{currentRecipe.calories} kcal</span></div>
                    </div>
                  </div>

                  {/* Generate / Regenerate Recipe Image Button */}
                  <button
                    type="button"
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage}
                    className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-pink-950/60 hover:bg-pink-900/60 border border-pink-500/40 text-pink-300 text-[11px] font-semibold shadow-xs transition-all disabled:opacity-50"
                    title="Generate custom culinary photography for this entered recipe"
                  >
                    {isGeneratingImage ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin text-pink-400" />
                        <span>Generating AI Image...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-pink-400" />
                        <span>✨ Generate Recipe Image</span>
                      </>
                    )}
                  </button>
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

        {/* Tab: Full Magazine Article Preview */}
        {activeSubTab === 'article' && (() => {
          const article = currentRecipe.article || buildCompleteArticle(currentRecipe);
          return (
            <div className="p-4 sm:p-6 space-y-6">
              {/* Top Quick Actions Bar */}
              <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-300 font-medium">Magazine Article View:</span>
                  <span className="text-xs text-pink-400 font-semibold">{currentRecipe.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadPdf}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-700 hover:bg-pink-800 text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Recipe PDF</span>
                  </button>
                  {onOpenArticleModal && (
                    <button
                      onClick={() => onOpenArticleModal(currentRecipe)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-pink-400" />
                      <span>Open in Reader Modal</span>
                    </button>
                  )}
                  <a
                    href={`/api/article/${currentRecipe.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <span>Open Standalone Web URL</span>
                  </a>
                </div>
              </div>

              {/* Clean White Magazine Article Content */}
              <div className="bg-white text-slate-700 rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-8">
                {/* Header & Badges */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-pink-50 text-pink-700 border border-pink-200 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {currentRecipe.niche}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-bold">
                      {currentRecipe.dietary}
                    </span>
                    <span className="text-xs text-slate-500 ml-auto flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {article.readingTimeMinutes} min read · Updated Today
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight font-serif">
                    {article.title}
                  </h1>

                  <p className="mt-3 text-base sm:text-lg text-slate-600 italic leading-relaxed border-l-4 border-pink-600 pl-4 py-1">
                    {article.excerpt}
                  </p>

                  {/* Top Action Bar with Download Button */}
                  <div className="mt-5 flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex-wrap">
                    <button
                      onClick={handleDownloadPdf}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-pink-700 hover:bg-pink-800 text-white rounded-lg text-xs sm:text-sm font-bold shadow-sm transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download / Print Recipe PDF</span>
                    </button>
                    <a
                      href="#studio-recipe-card"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs sm:text-sm font-semibold transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      <span>Jump to Recipe Card</span>
                    </a>
                    <div className="ml-auto flex items-center gap-1 text-xs text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>4.98 (124 ratings)</span>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Prep Time</span>
                    <strong className="text-base text-slate-900 font-semibold">{currentRecipe.prepTime}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Cook Time</span>
                    <strong className="text-base text-slate-900 font-semibold">{currentRecipe.cookTime}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Servings</span>
                    <strong className="text-base text-slate-900 font-semibold">{currentRecipe.servings}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Calories</span>
                    <strong className="text-base text-pink-700 font-semibold">{currentRecipe.calories} kcal</strong>
                  </div>
                </div>

                {/* Hero Image */}
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                  <img
                    src={article.featuredImageUrl || currentRecipe.imageUrl}
                    alt={article.title}
                    className="w-full max-h-[440px] object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 italic text-center">
                    Freshly prepared {currentRecipe.title} with natural ingredients, cold-pressed olive oil, and herbs.
                  </div>
                </div>

                {/* Introduction Story */}
                <div className="space-y-4 text-base sm:text-[17px] text-slate-700 leading-relaxed font-sans">
                  {article.introduction.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="leading-relaxed">{paragraph}</p>
                  ))}
                </div>

                {/* Why You'll Love This Recipe */}
                <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-700" />
                    <h3 className="text-base sm:text-lg font-bold text-purple-950">
                      Why This Recipe Belongs in Your Kitchen
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {article.whyYouWillLoveThis.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-purple-900">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Categorized Ingredients */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 font-serif">
                    🛒 Ingredients & Selection Guide
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentRecipe.ingredients.map((ing, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm">
                        <span className="text-slate-800 font-medium">{ing.item}</span>
                        <span className="font-semibold text-pink-700 shrink-0 pl-2">{ing.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Culinary Masterclass */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2 font-serif">
                    <ChefHat className="w-5 h-5 text-pink-600" />
                    <span>Step-by-Step Culinary Masterclass</span>
                  </h3>
                  <div className="space-y-4">
                    {article.stepByStepWalkthrough.map((step, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
                        <h4 className="text-base font-bold text-slate-900 flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-700 text-xs font-bold flex items-center justify-center border border-pink-200">
                            {idx + 1}
                          </span>
                          <span>{step.heading}</span>
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed pl-8">
                          {step.description}
                        </p>
                        {step.proTip && (
                          <div className="ml-8 mt-2 text-xs bg-amber-50 border border-amber-200 text-amber-800 p-2.5 rounded-lg flex items-center gap-2">
                            <span className="font-bold text-amber-900">💡 Pro Tip:</span>
                            <span>{step.proTip}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro Chef Secrets */}
                <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-5 space-y-2.5">
                  <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
                    <span>💡 Chef Secrets for Success</span>
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-emerald-900 list-disc pl-5">
                    {article.culinarySecrets.map((secret, i) => (
                      <li key={i}>{secret}</li>
                    ))}
                  </ul>
                </div>

                {/* Printable Recipe Card */}
                <div id="studio-recipe-card" className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                      <span className="text-[11px] font-bold text-pink-700 uppercase tracking-widest">
                        Official Recipe Card
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">{currentRecipe.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{currentRecipe.metaDescription}</p>
                    </div>
                    <button
                      onClick={handleDownloadPdf}
                      className="px-3.5 py-2 rounded-lg bg-pink-700 hover:bg-pink-800 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Save / Print PDF</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 border-b border-slate-200 pb-1">
                        Ingredients ({currentRecipe.ingredients.length})
                      </h4>
                      <ul className="space-y-2 text-xs sm:text-sm">
                        {currentRecipe.ingredients.map((ing, i) => (
                          <li key={i} className="flex justify-between p-2 rounded bg-slate-50 border border-slate-200">
                            <span className="text-slate-800">{ing.item}</span>
                            <span className="font-semibold text-pink-700">{ing.amount}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 border-b border-slate-200 pb-1">
                        Method ({currentRecipe.instructions.length} Steps)
                      </h4>
                      <ol className="space-y-2.5 text-xs sm:text-sm">
                        {currentRecipe.instructions.map((step, i) => (
                          <li key={i} className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1">
                            <div className="flex justify-between items-center">
                              <strong className="text-slate-900">{step.title}</strong>
                              {step.timerMinutes && (
                                <span className="text-[11px] text-pink-700 font-mono">⏱️ {step.timerMinutes}m</span>
                              )}
                            </div>
                            <p className="text-slate-600">{step.text}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>

                {/* FAQ */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 font-serif">Frequently Asked Culinary Questions</h3>
                  <div className="space-y-2.5">
                    {article.frequentlyAskedQuestions.map((faq, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1.5">
                        <strong className="text-slate-900 block text-sm font-semibold">{faq.question}</strong>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Storage & Pairings */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm space-y-2 text-slate-600">
                  <p><strong className="text-slate-900">🧊 Storage & Meal Prep:</strong> {article.storageAndReheating}</p>
                  <p><strong className="text-slate-900">🍷 Serving & Pairings:</strong> {article.servingSuggestions}</p>
                </div>
              </div>
            </div>
          );
        })()}

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
