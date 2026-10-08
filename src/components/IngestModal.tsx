import React, { useState } from 'react';
import { X, Plus, Sparkles, Database, FileSpreadsheet, RefreshCw, Wand2, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { NICHE_PRESETS } from '../data/sampleRecipes';

interface IngestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngestTopics: (topics: Array<{ topic: string; niche: string; dietary: string }>) => void;
  onSynthesizeAndInspect?: (topic: string, niche: string, dietary: string) => Promise<void>;
}

export const IngestModal: React.FC<IngestModalProps> = ({
  isOpen,
  onClose,
  onIngestTopics,
  onSynthesizeAndInspect,
}) => {
  if (!isOpen) return null;

  const [activeMode, setActiveMode] = useState<'single' | 'bulk' | 'ai_suggest'>('single');
  const [singleTopic, setSingleTopic] = useState('');
  const [singleNiche, setSingleNiche] = useState('Quick & Easy Dinners');
  const [singleDietary, setSingleDietary] = useState('Gluten-Free Optional');
  const [bulkText, setBulkText] = useState(
    'Sheet Pan Crispy Honey Mustard Salmon\n15-Minute Garlic Butter Shrimp Tagliatelle\nAir Fryer Crispy Sesame Chicken Bites'
  );
  const [aiNiche, setAiNiche] = useState('Mediterranean Diet');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [generatingTopic, setGeneratingTopic] = useState<string | null>(null);

  // Ingest into queue only
  const handleSingleQueueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleTopic.trim()) return;
    onIngestTopics([
      { topic: singleTopic.trim(), niche: singleNiche, dietary: singleDietary },
    ]);
    setSingleTopic('');
    onClose();
  };

  // Direct synthesis and generation (creates recipe, design, image, and article!)
  const handleSingleDirectGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleTopic.trim()) return;
    setGeneratingTopic(singleTopic.trim());
    try {
      if (onSynthesizeAndInspect) {
        await onSynthesizeAndInspect(singleTopic.trim(), singleNiche, singleDietary);
      } else {
        onIngestTopics([{ topic: singleTopic.trim(), niche: singleNiche, dietary: singleDietary }]);
      }
      setSingleTopic('');
      onClose();
    } finally {
      setGeneratingTopic(null);
    }
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = bulkText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (lines.length === 0) return;

    const items = lines.map((topic) => ({
      topic,
      niche: singleNiche,
      dietary: 'Standard',
    }));
    onIngestTopics(items);
    onClose();
  };

  const handleFetchAiKeywords = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/generate-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: aiNiche.trim() || 'Mediterranean Diet', count: 5 }),
      });
      const data = await res.json();
      if (data && data.keywords && Array.isArray(data.keywords) && data.keywords.length > 0) {
        setAiSuggestions(data.keywords);
      } else {
        // Fallback local list
        setAiSuggestions([
          { topic: 'Sheet Pan Lemon Herb Mediterranean Salmon', targetNiche: aiNiche, estimatedVolume: '34.2k/mo', pinPotential: 'Viral', dietary: 'Pescatarian' },
          { topic: 'Crispy Greek Feta & Sun-Dried Tomato Stuffed Chicken', targetNiche: aiNiche, estimatedVolume: '28.6k/mo', pinPotential: 'Viral', dietary: 'High-Protein' },
          { topic: 'Creamy Garlic & Lemon Mediterranean Orzo Skillet', targetNiche: aiNiche, estimatedVolume: '42.1k/mo', pinPotential: 'Evergreen', dietary: 'Vegetarian' },
          { topic: 'Garlic Butter Mediterranean Jumbo Shrimp & Asparagus', targetNiche: aiNiche, estimatedVolume: '19.4k/mo', pinPotential: 'High', dietary: 'Low-Carb' },
          { topic: 'Roasted Chickpea & Charred Halloumi Warm Grain Bowl', targetNiche: aiNiche, estimatedVolume: '16.8k/mo', pinPotential: 'Viral', dietary: 'Vegetarian' }
        ]);
      }
    } catch {
      setAiSuggestions([
        { topic: `${aiNiche} Herb-Roasted Sheet Pan Chicken`, targetNiche: aiNiche, estimatedVolume: '22.4k/mo', pinPotential: 'Viral', dietary: 'High-Protein' },
        { topic: `Crispy ${aiNiche} Feta & Olive Stuffed Peppers`, targetNiche: aiNiche, estimatedVolume: '14.8k/mo', pinPotential: 'Evergreen', dietary: 'Vegetarian' },
        { topic: `Creamy ${aiNiche} Lemon Garlic Orzo Skillet`, targetNiche: aiNiche, estimatedVolume: '31.2k/mo', pinPotential: 'Viral', dietary: 'Quick Prep' }
      ]);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleDirectGenerateKeyword = async (item: any) => {
    setGeneratingTopic(item.topic);
    try {
      if (onSynthesizeAndInspect) {
        await onSynthesizeAndInspect(item.topic, item.targetNiche || aiNiche, item.dietary || 'Standard');
      } else {
        onIngestTopics([{ topic: item.topic, niche: item.targetNiche || aiNiche, dietary: item.dietary || 'Standard' }]);
      }
      onClose();
    } finally {
      setGeneratingTopic(null);
    }
  };

  const handleIngestAllSuggestions = () => {
    if (aiSuggestions.length === 0) return;
    const items = aiSuggestions.map(s => ({
      topic: s.topic,
      niche: s.targetNiche || aiNiche,
      dietary: s.dietary || 'Standard'
    }));
    onIngestTopics(items);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Ingest & Generate Recipes</h2>
              <p className="text-xs text-slate-400">Add keywords, generate designs, and produce complete culinary articles.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="px-5 py-2.5 border-b border-slate-800 bg-slate-900/60 flex items-center gap-1.5">
          <button
            onClick={() => setActiveMode('single')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              activeMode === 'single' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Single Topic
          </button>
          <button
            onClick={() => setActiveMode('bulk')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
              activeMode === 'bulk' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-pink-400" />
            <span>Bulk CSV / Text</span>
          </button>
          <button
            onClick={() => setActiveMode('ai_suggest')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
              activeMode === 'ai_suggest' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Niche Extractor</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {activeMode === 'single' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Recipe Topic / Keyword</label>
                <input
                  type="text"
                  placeholder="e.g. Sheet Pan Lemon Herb Mediterranean Salmon"
                  value={singleTopic}
                  onChange={(e) => setSingleTopic(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Niche Category</label>
                  <select
                    value={singleNiche}
                    onChange={(e) => setSingleNiche(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    {NICHE_PRESETS.map((n) => (
                      <option key={n.niche} value={n.niche}>
                        {n.niche}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Dietary Tag</label>
                  <input
                    type="text"
                    value={singleDietary}
                    onChange={(e) => setSingleDietary(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleSingleDirectGenerate}
                  disabled={!singleTopic.trim() || !!generatingTopic}
                  className="flex-1 py-2.5 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {generatingTopic ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing Recipe, Design & Article...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>✨ Generate Recipe, Design & Article Now</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleSingleQueueSubmit}
                  disabled={!singleTopic.trim() || !!generatingTopic}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors disabled:opacity-50"
                >
                  Stage to Queue
                </button>
              </div>
            </div>
          )}

          {activeMode === 'bulk' && (
            <form onSubmit={handleBulkSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Paste Line-Separated Recipe Topics (or CSV)
                </label>
                <textarea
                  rows={5}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white rounded-lg text-xs font-medium shadow-md transition-all"
              >
                Ingest All Lines into Queue
              </button>
            </form>
          )}

          {activeMode === 'ai_suggest' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Target culinary niche (e.g. Mediterranean Diet)..."
                  value={aiNiche}
                  onChange={(e) => setAiNiche(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleFetchAiKeywords(); }}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleFetchAiKeywords}
                  disabled={isGeneratingAi}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1.5 shadow"
                >
                  {isGeneratingAi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Generate Keywords</span>
                </button>
              </div>

              {aiSuggestions.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                    <span>Generated Viral Keyword Opportunities:</span>
                    <button
                      onClick={handleIngestAllSuggestions}
                      className="text-pink-400 hover:text-pink-300 font-medium flex items-center gap-1 text-[11px]"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Ingest All 5 to Queue</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {aiSuggestions.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:border-slate-700 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="text-white font-semibold truncate">{item.topic}</div>
                          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                            <span>Vol: <strong className="text-slate-300">{item.estimatedVolume || '25k/mo'}</strong></span>
                            <span>•</span>
                            <span className="text-emerald-400 font-bold">{item.pinPotential || 'Viral'}</span>
                            <span>•</span>
                            <span className="text-pink-400">{item.dietary || 'Standard'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleDirectGenerateKeyword(item)}
                            disabled={generatingTopic === item.topic}
                            className="px-2.5 py-1.5 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white rounded-lg text-[11px] font-semibold shadow transition-all flex items-center gap-1"
                            title="Directly synthesize recipe, images, pin design and article"
                          >
                            {generatingTopic === item.topic ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <Sparkles className="w-3 h-3" />
                            )}
                            <span>Generate Recipe & Design</span>
                          </button>

                          <button
                            onClick={() => {
                              onIngestTopics([{ topic: item.topic, niche: item.targetNiche || aiNiche, dietary: item.dietary || 'Standard' }]);
                              onClose();
                            }}
                            className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-medium border border-slate-700"
                            title="Stage keyword into pipeline queue"
                          >
                            + Queue
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
