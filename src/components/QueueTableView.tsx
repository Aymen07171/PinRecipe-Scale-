import React, { useState } from 'react';
import { RecipeItem } from '../types/pipeline';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Trash2, 
  FileText, 
  Download,
  Share2,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

interface QueueTableViewProps {
  recipes: RecipeItem[];
  onSelectRecipe: (recipe: RecipeItem) => void;
  onDeleteRecipe: (id: string) => void;
  onRetryRecipe: (id: string) => void;
  onExportCsv: () => void;
  onQuickIngestPreset: (nicheName: string) => void;
}

export const QueueTableView: React.FC<QueueTableViewProps> = ({
  recipes,
  onSelectRecipe,
  onDeleteRecipe,
  onRetryRecipe,
  onExportCsv,
  onQuickIngestPreset,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'queued' | 'processing'>('all');
  const [nicheFilter, setNicheFilter] = useState<string>('all');

  const filteredRecipes = recipes.filter((rec) => {
    const matchesSearch =
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.niche.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'completed'
        ? rec.status === 'completed'
        : statusFilter === 'queued'
        ? rec.status === 'queued'
        : ['synthesizing', 'generating_image', 'publishing_wp', 'scheduling_pin'].includes(rec.status);

    const matchesNiche = nicheFilter === 'all' ? true : rec.niche === nicheFilter;

    return matchesSearch && matchesStatus && matchesNiche;
  });

  const availableNiches = Array.from(new Set(recipes.map((r) => r.niche)));

  return (
    <div className="bg-[#0f172a]/80 border border-slate-800/80 rounded-xl overflow-hidden shadow-sm">
      {/* Table Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search recipes, keywords, niches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Status Filter Segment */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800/80">
            {(['all', 'completed', 'processing', 'queued'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors capitalize ${
                  statusFilter === st
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Niche Filter & Export */}
        <div className="flex items-center gap-2">
          {availableNiches.length > 0 && (
            <select
              value={nicheFilter}
              onChange={(e) => setNicheFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Niches</option>
              {availableNiches.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 text-xs font-medium hover:bg-slate-800 hover:border-slate-700 transition-colors"
            title="Export Pinterest bulk schedule CSV"
          >
            <Download className="w-3.5 h-3.5 text-pink-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-900/40 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
              <th className="py-3 px-4">Recipe Title & SEO Keyword</th>
              <th className="py-3 px-4">Niche & Dietary</th>
              <th className="py-3 px-4 text-center">Macro Visual</th>
              <th className="py-3 px-4">Timing & Yield</th>
              <th className="py-3 px-4">WordPress Sync</th>
              <th className="py-3 px-4">Pinterest Schedule</th>
              <th className="py-3 px-4 text-center">Health</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
            {filteredRecipes.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <FileText className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                  <p className="text-sm font-medium text-slate-400">No recipe campaigns in this view</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try adjusting filters or ingest new recipe topics from the top bar.
                  </p>
                </td>
              </tr>
            ) : (
              filteredRecipes.map((recipe) => (
                <tr
                  key={recipe.id}
                  className="hover:bg-slate-900/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectRecipe(recipe)}
                >
                  {/* Title & Keyword */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-semibold text-white truncate group-hover:text-pink-300 transition-colors">
                      {recipe.title}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-1.5 font-mono">
                      <span>KW: {recipe.focusKeyword}</span>
                    </div>
                  </td>

                  {/* Niche & Dietary */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="text-slate-300 font-medium">{recipe.niche}</div>
                    <div className="text-[11px] text-slate-500">{recipe.dietary}</div>
                  </td>

                  {/* Image Thumbnail */}
                  <td className="py-3 px-4 text-center">
                    <div className="inline-block relative w-10 h-14 rounded overflow-hidden border border-slate-700/60 bg-slate-900 shadow-sm">
                      {recipe.imageUrl ? (
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-600">
                          2:3
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Timing & Yield */}
                  <td className="py-3 px-4 whitespace-nowrap font-mono tabular-nums text-slate-400">
                    <div>{recipe.totalTime} · {recipe.calories} kcal</div>
                    <div className="text-[11px] text-slate-500">{recipe.servings}</div>
                  </td>

                  {/* WordPress Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          recipe.wpStatus === 'published'
                            ? 'bg-emerald-400'
                            : recipe.wpStatus === 'draft'
                            ? 'bg-amber-400'
                            : 'bg-slate-600'
                        }`}
                      />
                      <span className="font-medium text-slate-300 capitalize">
                        {recipe.wpStatus === 'published' ? 'Live Post' : recipe.wpStatus}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate max-w-[140px]">
                      {recipe.wpCategory || 'Default'}
                    </div>
                  </td>

                  {/* Pinterest Schedule */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="text-slate-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-pink-400" />
                      <span>{recipe.pinterestPin.scheduledTime}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[140px] mt-0.5">
                      Board: {recipe.pinterestPin.board}
                    </div>
                  </td>

                  {/* Health */}
                  <td className="py-3 px-4 text-center whitespace-nowrap font-mono tabular-nums font-semibold text-amber-400">
                    {recipe.healthScore}%
                  </td>

                  {/* Actions */}
                  <td
                    className="py-3 px-4 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      {recipe.wpPostUrl && (
                        <a
                          href={recipe.wpPostUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded transition-colors"
                          title="View live post on WordPress"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => onSelectRecipe(recipe)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                        title="Inspect recipe"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onRetryRecipe(recipe.id)}
                        className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition-colors"
                        title="Re-run synthesis pipeline"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteRecipe(recipe.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                        title="Delete slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3 sm:p-4 bg-slate-900/60 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div className="font-mono tabular-nums">
          Showing {filteredRecipes.length} of {recipes.length} campaign items · 100% posting success rate
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500">Quick Niche Presets:</span>
          {['Mediterranean Diet', 'Crispy Air Fryer Magic', 'Moroccan & Tagine Classics'].map((p) => (
            <button
              key={p}
              onClick={() => onQuickIngestPreset(p)}
              className="text-[11px] text-pink-400 hover:text-pink-300 hover:underline"
            >
              +{p.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
