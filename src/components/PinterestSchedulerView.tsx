import React, { useState } from 'react';
import { PinterestConfig, RecipeItem } from '../types/pipeline';
import { 
  Share2, 
  Clock, 
  Calendar, 
  Download, 
  Sliders, 
  CheckCircle2, 
  Shuffle, 
  ExternalLink,
  Plus
} from 'lucide-react';

interface PinterestSchedulerViewProps {
  pinterestConfig: PinterestConfig;
  onUpdateConfig: (newConfig: PinterestConfig) => void;
  recipes: RecipeItem[];
  onExportCsv: () => void;
}

export const PinterestSchedulerView: React.FC<PinterestSchedulerViewProps> = ({
  pinterestConfig,
  onUpdateConfig,
  recipes,
  onExportCsv,
}) => {
  const [selectedBoard, setSelectedBoard] = useState(pinterestConfig.defaultBoard);
  const [interval, setInterval] = useState(pinterestConfig.intervalMinutes);
  const [jitter, setJitter] = useState(pinterestConfig.enableJitter);
  const [newBoardName, setNewBoardName] = useState('');

  const handleAddBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    const updatedBoards = [...pinterestConfig.boards, newBoardName.trim()];
    onUpdateConfig({ ...pinterestConfig, boards: updatedBoards });
    setNewBoardName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0f172a]/90 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                Programmatic Pinterest Bulk Scheduler
              </h2>
              <p className="text-xs text-slate-400">
                Pace automated pin syndication to target niche boards with randomized timing and UTM tracking.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs font-medium text-pink-300 hover:bg-slate-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Tailwind / Pinterest CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scheduler Configuration Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Timing & Anti-Spam Controls */}
        <div className="lg:col-span-5 bg-[#0f172a]/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-pink-400" />
            <span>Syndication Cadence & Pacing Engine</span>
          </h3>

          <div className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Pin Distribution Interval
              </label>
              <select
                value={interval}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setInterval(val);
                  onUpdateConfig({ ...pinterestConfig, intervalMinutes: val });
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
              >
                <option value={30}>1 Pin Every 30 Minutes (Fast Aggressive)</option>
                <option value={45}>1 Pin Every 45 Minutes (Optimal Growth)</option>
                <option value={60}>1 Pin Every 60 Minutes (Steady Flow)</option>
                <option value={120}>1 Pin Every 2 Hours (Conservative)</option>
              </select>
            </div>

            {/* Anti-Spam Jitter */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-white flex items-center gap-1.5">
                  <Shuffle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Randomized Jitter Pacing</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Injects ±5–12 min variance between pins to bypass spam tripwires.
                </p>
              </div>
              <input
                type="checkbox"
                checked={jitter}
                onChange={(e) => {
                  setJitter(e.target.checked);
                  onUpdateConfig({ ...pinterestConfig, enableJitter: e.target.checked });
                }}
                className="w-4 h-4 rounded text-pink-500 bg-slate-950 border-slate-700 focus:ring-0 cursor-pointer"
              />
            </div>

            {/* Default Target Board */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Default Target Board
              </label>
              <select
                value={selectedBoard}
                onChange={(e) => {
                  setSelectedBoard(e.target.value);
                  onUpdateConfig({ ...pinterestConfig, defaultBoard: e.target.value });
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
              >
                {pinterestConfig.boards.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Add New Board Form */}
            <form onSubmit={handleAddBoard} className="flex gap-2">
              <input
                type="text"
                placeholder="New board name..."
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white rounded-lg transition-colors inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right: Scheduled Queue Table */}
        <div className="lg:col-span-7 bg-[#0f172a]/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-pink-400" />
              <span>Syndication Queue ({recipes.length} Pins)</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Pacing Active
            </span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {recipes.map((r, i) => (
              <div
                key={r.id}
                className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 flex items-center justify-between text-xs hover:border-slate-700 transition-colors gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-14 rounded overflow-hidden border border-slate-700 bg-slate-950 shrink-0">
                    <img
                      src={r.imageUrl}
                      alt={r.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-medium truncate">{r.pinterestPin.title}</div>
                    <div className="text-[11px] text-pink-400 font-mono mt-0.5">
                      Board: {r.pinterestPin.board}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      UTM: ?utm_source=pinterest&campaign={pinterestConfig.utmCampaign}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-slate-300 font-mono text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{r.pinterestPin.scheduledTime}</span>
                  </div>
                  <span className="inline-block mt-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
                    Queued #{i + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
