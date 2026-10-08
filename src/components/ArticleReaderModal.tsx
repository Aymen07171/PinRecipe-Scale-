import React, { useState } from 'react';
import { RecipeItem } from '../types/pipeline';
import { buildCompleteArticle, generateArticleHtml } from '../utils/articleGenerator';
import { openPrintRecipeWindow } from '../utils/pdfGenerator';
import { 
  X, 
  BookOpen, 
  Clock, 
  Sparkles, 
  Download, 
  ExternalLink, 
  Copy, 
  Check, 
  ChefHat, 
  CheckCircle2,
  Globe,
  Star,
  Printer
} from 'lucide-react';

interface ArticleReaderModalProps {
  recipe: RecipeItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSyncToWp?: (recipeId: string) => Promise<boolean | void>;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({
  recipe,
  isOpen,
  onClose,
  onSyncToWp,
}) => {
  if (!isOpen || !recipe) return null;

  const [copiedHtml, setCopiedHtml] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Generate or use attached article
  const article = recipe.article || buildCompleteArticle(recipe);

  const handleCopyHtml = () => {
    const html = generateArticleHtml(article, recipe);
    navigator.clipboard.writeText(html);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleOpenPrintable = () => {
    openPrintRecipeWindow(recipe);
  };

  const handleOpenStandaloneTab = () => {
    window.open(`/api/article/${recipe.id}`, '_blank');
  };

  const handleSyncWp = async () => {
    if (!onSyncToWp) return;
    setIsSyncing(true);
    try {
      await onSyncToWp(recipe.id);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch {
      // handled in parent
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top Sticky Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-3 min-w-0 pr-3">
            <div className="w-8 h-8 rounded-lg bg-pink-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-pink-700 tracking-wide uppercase">
                {recipe.niche || 'Culinary Editorial'}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {article.title}
              </h2>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 shrink-0">
            {/* REQUESTED TOP DOWNLOAD BUTTON */}
            <button
              onClick={handleOpenPrintable}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-700 hover:bg-pink-800 text-white text-xs font-bold shadow-sm transition-colors"
              title="Download & Print Recipe Card"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Recipe</span>
            </button>

            <button
              onClick={handleCopyHtml}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-300 transition-colors"
              title="Copy formatted HTML for WordPress or CMS"
            >
              {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span className="hidden sm:inline">{copiedHtml ? 'Copied' : 'Copy HTML'}</span>
            </button>

            <button
              onClick={handleOpenStandaloneTab}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-300 transition-colors"
              title="Open full article in standalone web tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Open Web Tab</span>
            </button>

            {onSyncToWp && (
              <button
                onClick={handleSyncWp}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>{syncSuccess ? 'Published!' : isSyncing ? 'Publishing...' : 'Publish to WP'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Clean White Background Article Content */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 bg-white text-slate-700">
          
          {/* Article Header & Badges */}
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

            {/* PROMINENT TOP ACTION BAR WITH DOWNLOAD BUTTON (REQUESTED BY USER) */}
            <div className="mt-5 flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex-wrap">
              <button
                onClick={handleOpenPrintable}
                className="inline-flex items-center gap-2 px-4 py-2 bg-pink-700 hover:bg-pink-800 text-white rounded-lg text-xs sm:text-sm font-bold shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download / Print Recipe PDF</span>
              </button>
              <a
                href="#recipe-card-box"
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

          {/* Quick Recipe Metrics */}
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

          {/* High-Resolution Natural Real Food Photography */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md">
            <img
              src={article.featuredImageUrl}
              alt={article.title}
              className="w-full max-h-[460px] object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 italic text-center">
              Freshly prepared {recipe.title} with natural ingredients, cold-pressed olive oil, and herbs.
            </div>
          </div>

          {/* Well-Written Narrative Story Introduction */}
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

          {/* Categorized Ingredients Section */}
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

          {/* Step-by-Step Culinary Walkthrough */}
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

          {/* Pro Chef Secrets Callout */}
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

          {/* Official Printable Recipe Card */}
          <div id="recipe-card-box" className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[11px] font-bold text-pink-700 uppercase tracking-widest">
                  Official Recipe Card
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">{recipe.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{recipe.metaDescription}</p>
              </div>
              <button
                onClick={handleOpenPrintable}
                className="px-3.5 py-2 rounded-lg bg-pink-700 hover:bg-pink-800 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save / Print PDF</span>
              </button>
            </div>

            {/* Ingredients & Method */}
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

          {/* Frequently Asked Questions */}
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

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Clean White Editorial Layout · Download Ready</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenPrintable}
              className="px-4 py-2 bg-pink-700 hover:bg-pink-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Printable Recipe PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
