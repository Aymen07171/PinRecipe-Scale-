import React, { useState } from 'react';
import { RecipeItem } from '../types/pipeline';
import { 
  X, 
  ExternalLink, 
  Clock, 
  Flame, 
  Copy, 
  Check, 
  Code, 
  Globe, 
  Share2, 
  FileText,
  Bookmark,
  Download,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ChefHat,
  Star,
  Printer
} from 'lucide-react';

import { openPrintRecipeWindow } from '../utils/pdfGenerator';
import { buildCompleteArticle } from '../utils/articleGenerator';

interface RecipeDetailModalProps {
  recipe: RecipeItem | null;
  onClose: () => void;
  onOpenArticleModal?: (recipe: RecipeItem) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
  onOpenArticleModal,
}) => {
  if (!recipe) return null;

  const [activeTab, setActiveTab] = useState<'recipe' | 'article' | 'pin' | 'wordpress' | 'schema'>('recipe');
  const [copiedSchema, setCopiedSchema] = useState(false);

  const handleCopySchema = () => {
    if (recipe.schemaJsonLd) {
      navigator.clipboard.writeText(JSON.stringify(recipe.schemaJsonLd, null, 2));
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 2000);
    }
  };

  const handleDownloadPdf = () => {
    openPrintRecipeWindow(recipe);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="min-w-0 pr-4">
            <span className="text-[11px] font-mono text-pink-400 uppercase tracking-wider font-semibold">
              {recipe.niche} · {recipe.dietary}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white truncate mt-0.5">
              {recipe.title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-semibold shadow transition-all"
              title="Download recipe as a printable PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-5 py-2.5 border-b border-slate-800 bg-slate-900/60 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('recipe')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'recipe' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Culinary Guide & Nutrition
          </button>
          <button
            onClick={() => setActiveTab('article')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'article' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-pink-400" />
            <span>📖 Full Magazine Article</span>
          </button>
          <button
            onClick={() => setActiveTab('pin')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pin' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-pink-400" />
            <span>Pinterest Pin Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('wordpress')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'wordpress' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>WordPress Gutenberg Block</span>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'schema' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-indigo-400" />
            <span>Google Schema.org JSON-LD</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {activeTab === 'recipe' && (
            <div className="space-y-6">
              {/* Hero Banner */}
              <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="w-32 aspect-[2/3] rounded-lg overflow-hidden border border-slate-700 bg-slate-950 shrink-0 shadow-md">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-2 text-xs flex-1">
                  <p className="text-slate-300 leading-relaxed">{recipe.metaDescription}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-slate-400 font-mono">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="block text-[10px] text-slate-500">Prep Time</span>
                      <span className="text-white font-semibold">{recipe.prepTime}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="block text-[10px] text-slate-500">Cook Time</span>
                      <span className="text-white font-semibold">{recipe.cookTime}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="block text-[10px] text-slate-500">Servings</span>
                      <span className="text-white font-semibold">{recipe.servings}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="block text-[10px] text-slate-500">Calories</span>
                      <span className="text-amber-400 font-semibold">{recipe.calories} kcal</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ingredients & Steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Ingredients ({recipe.ingredients.length})
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i} className="p-2 bg-slate-900/40 rounded border border-slate-800 flex justify-between">
                        <span className="text-slate-200">{ing.item}</span>
                        <span className="font-mono text-pink-400">{ing.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Instructions ({recipe.instructions.length} Steps)
                  </h3>
                  <div className="space-y-2 text-xs">
                    {recipe.instructions.map((inst, i) => (
                      <div key={i} className="p-2.5 bg-slate-900/40 rounded border border-slate-800 space-y-1">
                        <div className="font-semibold text-pink-400 font-mono text-[11px]">
                          Step {inst.step}. {inst.title}
                        </div>
                        <p className="text-slate-300 leading-relaxed text-[11px]">{inst.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'article' && (() => {
            const article = recipe.article || buildCompleteArticle(recipe);
            return (
              <div className="space-y-6">
                {/* Top Quick Actions Bar */}
                <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300 font-medium">Magazine Article View:</span>
                    <span className="text-xs text-pink-400 font-semibold">{recipe.title}</span>
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
                        onClick={() => onOpenArticleModal(recipe)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-pink-400" />
                        <span>Open in Reader Modal</span>
                      </button>
                    )}
                    <a
                      href={`/api/article/${recipe.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
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
                        {recipe.niche}
                      </span>
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-bold">
                        {recipe.dietary}
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
                        href="#inspect-recipe-card"
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
                      <strong className="text-base text-slate-900 font-semibold">{recipe.prepTime}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Cook Time</span>
                      <strong className="text-base text-slate-900 font-semibold">{recipe.cookTime}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Servings</span>
                      <strong className="text-base text-slate-900 font-semibold">{recipe.servings}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Calories</span>
                      <strong className="text-base text-pink-700 font-semibold">{recipe.calories} kcal</strong>
                    </div>
                  </div>

                  {/* Hero Image */}
                  <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                    <img
                      src={article.featuredImageUrl || recipe.imageUrl}
                      alt={article.title}
                      className="w-full max-h-[440px] object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 italic text-center">
                      Freshly prepared {recipe.title} with natural ingredients, cold-pressed olive oil, and herbs.
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
                      {recipe.ingredients.map((ing, i) => (
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
                  <div id="inspect-recipe-card" className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                      <div>
                        <span className="text-[11px] font-bold text-pink-700 uppercase tracking-widest">
                          Official Recipe Card
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">{recipe.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{recipe.metaDescription}</p>
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
                          Ingredients ({recipe.ingredients.length})
                        </h4>
                        <ul className="space-y-2 text-xs sm:text-sm">
                          {recipe.ingredients.map((ing, i) => (
                            <li key={i} className="flex justify-between p-2 rounded bg-slate-50 border border-slate-200">
                              <span className="text-slate-800">{ing.item}</span>
                              <span className="font-semibold text-pink-700">{ing.amount}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 border-b border-slate-200 pb-1">
                          Method ({recipe.instructions.length} Steps)
                        </h4>
                        <ol className="space-y-2.5 text-xs sm:text-sm">
                          {recipe.instructions.map((step, i) => (
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

          {activeTab === 'pin' && (
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="w-[260px] aspect-[2/3] rounded-2xl overflow-hidden relative shadow-2xl border border-slate-800 bg-slate-950 shrink-0">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-end text-left">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-pink-400 font-bold mb-1">
                    {recipe.niche}
                  </span>
                  <h4 className="text-base font-bold text-white leading-tight">
                    {recipe.pinterestPin.overlayHeadline || recipe.title}
                  </h4>
                  <div className="mt-2 text-[9px] text-slate-400 font-mono">
                    TASTYSCALEBLOG.COM
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-300 flex-1">
                <div>
                  <span className="text-slate-500 block text-[11px]">Pin Title</span>
                  <p className="text-white font-semibold text-sm mt-0.5">{recipe.pinterestPin.title}</p>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Pin Description</span>
                  <p className="leading-relaxed mt-0.5">{recipe.pinterestPin.description}</p>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Target Board</span>
                  <p className="text-pink-400 font-mono font-medium">{recipe.pinterestPin.board}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {recipe.pinterestPin.hashtags.map((h, i) => (
                    <span key={i} className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wordpress' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Slug: <code className="text-pink-300 font-mono">/{recipe.slug}</code></span>
                <span>Category: <strong className="text-white">{recipe.wpCategory}</strong></span>
              </div>
              <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto">
{`<!-- wp:heading {"level":2} -->
<h2>${recipe.title}</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>${recipe.metaDescription}</p>
<!-- /wp:paragraph -->

<div class="pinrecipe-card">
  <h3>${recipe.title}</h3>
  <p>Prep: ${recipe.prepTime} | Cook: ${recipe.cookTime} | Servings: ${recipe.servings}</p>
  <h4>Ingredients:</h4>
  <ul>
${recipe.ingredients.map(i => `    <li>${i.amount} ${i.item}</li>`).join('\n')}
  </ul>
</div>`}
              </pre>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Google Schema.org/Recipe structured JSON-LD</span>
                <button
                  onClick={handleCopySchema}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 hover:text-white"
                >
                  {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSchema ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
                {JSON.stringify(recipe.schemaJsonLd || {}, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
