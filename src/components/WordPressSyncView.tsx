import React, { useState } from 'react';
import { WordPressConfig, RecipeItem } from '../types/pipeline';
import { 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  Layers, 
  Key, 
  Server,
  FolderTree,
  Send,
  Copy,
  Check,
  Code,
  Sparkles,
  ShieldCheck,
  Download,
  BookOpen,
  User,
  Lock,
  FileText
} from 'lucide-react';
import { openPrintRecipeWindow } from '../utils/pdfGenerator';
import { buildCompleteArticle, generateArticleHtml } from '../utils/articleGenerator';

interface WordPressSyncViewProps {
  wpConfig: WordPressConfig;
  onUpdateConfig: (newConfig: WordPressConfig) => void;
  recipes: RecipeItem[];
  onPublishRecipeToWp: (recipeId: string) => Promise<boolean | void>;
  onSyncAllToWp?: () => Promise<void>;
  isSyncing?: boolean;
  onOpenArticleModal?: (recipe: RecipeItem) => void;
}

export const WordPressSyncView: React.FC<WordPressSyncViewProps> = ({
  wpConfig,
  onUpdateConfig,
  recipes,
  onPublishRecipeToWp,
  onSyncAllToWp,
  isSyncing = false,
  onOpenArticleModal,
}) => {
  const [urlInput, setUrlInput] = useState(wpConfig.url || 'https://foodsprepared.wasmer.app');
  const [bridgeTokenInput, setBridgeTokenInput] = useState(wpConfig.bridgeToken || '');
  const [usernameInput, setUsernameInput] = useState(wpConfig.username || 'elattarayman1');
  const [appPasswordInput, setAppPasswordInput] = useState(wpConfig.appPassword || '');
  const [syncApiKeyInput, setSyncApiKeyInput] = useState(wpConfig.syncApiKey || '');
  const [statusSelect, setStatusSelect] = useState<'draft' | 'publish' | 'pending'>(wpConfig.defaultStatus || 'publish');
  
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ 
    success: boolean; 
    message: string; 
    pingMs?: number; 
    pluginActive?: boolean;
    authValid?: boolean;
  } | null>(null);

  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string; link?: string; recipe?: RecipeItem } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPayloadModal, setShowPayloadModal] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const handleTestConnection = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/test-wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: urlInput, 
          bridgeToken: bridgeTokenInput,
          username: usernameInput,
          appPassword: appPasswordInput,
          apiKey: syncApiKeyInput 
        }),
      });
      const data = await res.json();

      if (res.ok && data.connected) {
        onUpdateConfig({
          ...wpConfig,
          url: urlInput,
          bridgeToken: bridgeTokenInput,
          username: usernameInput,
          appPassword: appPasswordInput,
          syncApiKey: syncApiKeyInput,
          defaultStatus: statusSelect,
          isConnected: true,
          activeCategories: data.categories || wpConfig.activeCategories,
          lastSyncTime: new Date().toLocaleTimeString(),
        });

        let msg = `WordPress site connected (${data.pingMs}ms latency).`;
        if (data.authValid) {
          msg += ' ' + data.authMessage;
        } else if (data.pluginActive) {
          msg += ' Plugin detected! ' + (data.authMessage || 'Ready for Bridge Token or App Password.');
        }

        setTestResult({
          success: true,
          message: msg,
          pingMs: data.pingMs,
          pluginActive: data.pluginActive,
          authValid: data.authValid,
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Failed to verify connection to WordPress.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Network error while testing connection.',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveSettings = () => {
    onUpdateConfig({
      ...wpConfig,
      url: urlInput,
      bridgeToken: bridgeTokenInput,
      username: usernameInput,
      appPassword: appPasswordInput,
      syncApiKey: syncApiKeyInput,
      defaultStatus: statusSelect,
    });
    setSyncMessage({
      type: 'info',
      text: 'Settings saved! Bridge credentials and configurations updated.',
    });
    setTimeout(() => setSyncMessage(null), 3500);
  };

  const handlePublishSingle = async (recipeId: string) => {
    setSyncingId(recipeId);
    setSyncMessage(null);
    try {
      await onPublishRecipeToWp(recipeId);
      const recipe = recipes.find(r => r.id === recipeId);
      const targetLink = recipe?.wpPostUrl || `/api/article/${recipeId}`;
      setSyncMessage({
        type: 'success',
        text: `Successfully synced "${recipe?.title || 'Article'}"!`,
        link: targetLink,
        recipe: recipe
      });
    } catch (err: any) {
      setSyncMessage({
        type: 'error',
        text: err.message || 'Failed to sync recipe to WordPress.',
      });
    } finally {
      setSyncingId(null);
    }
  };

  const handleCopyRecipeHtml = (r: RecipeItem) => {
    const art = r.article || buildCompleteArticle(r);
    const html = generateArticleHtml(art, r);
    navigator.clipboard.writeText(html);
    setCopiedId(r.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const publishedRecipes = recipes.filter((r) => r.wpStatus === 'published');
  const queuedRecipes = recipes.filter((r) => r.wpStatus !== 'published');

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="bg-[#0f172a]/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-pink-600 flex items-center justify-center text-white shrink-0 shadow-lg">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-white">
                  WordPress Publishing & Live Article Synchronizer
                </h2>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Target: foodsprepared.wasmer.app
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Publishes rich long-form articles, clean white reader pages, and downloadable recipe cards directly to your WordPress site.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href="https://foodsprepared.wasmer.app/wp-admin/admin.php?page=pinrecipe-scale-bridge"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Key className="w-3.5 h-3.5 text-pink-400" />
              <span>WP PinRecipe Setup</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {onSyncAllToWp && (
              <button
                onClick={onSyncAllToWp}
                disabled={isSyncing}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-pink-700 hover:bg-pink-800 text-white text-xs font-bold shadow transition-all disabled:opacity-50"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Syncing Queue...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Publish All Queued</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sync Status Alert Message */}
      {syncMessage && (
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in ${
            syncMessage.type === 'success'
              ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
              : syncMessage.type === 'error'
              ? 'bg-rose-950/50 border-rose-500/50 text-rose-200'
              : 'bg-indigo-950/50 border-indigo-500/50 text-indigo-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {syncMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : syncMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            ) : (
              <ShieldCheck className="w-4 h-4 shrink-0 text-indigo-400" />
            )}
            <span className="font-medium text-sm sm:text-xs">{syncMessage.text}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {syncMessage.recipe && (
              <button
                type="button"
                onClick={() => onOpenArticleModal ? onOpenArticleModal(syncMessage.recipe!) : window.open(`/api/article/${syncMessage.recipe!.id}`, '_blank')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow transition-colors"
                title="Read full article in clean magazine reader"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>📖 Read Article in App</span>
              </button>
            )}

            {syncMessage.link && (
              <a
                href={syncMessage.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition-colors"
                title="Open live post on WordPress site"
              >
                <span>🌐 View on WordPress</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Main Grid: Settings on Left, Articles on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Connection Setup */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-[#0f172a]/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-pink-400" />
                <span>WordPress Connection Credentials</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowPayloadModal(true)}
                className="text-[11px] text-pink-400 hover:text-pink-300 inline-flex items-center gap-1"
              >
                <Code className="w-3 h-3" />
                <span>API Payload</span>
              </button>
            </div>

            {/* Quick 2-Way Connection Guide */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs space-y-2 text-slate-300">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-pink-400" />
                <span>Direct WordPress Publishing Methods:</span>
              </div>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-400 text-[11px] leading-relaxed">
                <li>
                  <strong>Method 1 (Recommended):</strong> Paste your <code>X-Scale-Bridge-Token</code> from{' '}
                  <a
                    href="https://foodsprepared.wasmer.app/wp-admin/admin.php?page=pinrecipe-scale-bridge"
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-400 hover:underline"
                  >
                    WP Admin → PinRecipe Scale
                  </a>.
                </li>
                <li>
                  <strong>Method 2:</strong> Use your WordPress Username (<code>elattarayman1</code>) &{' '}
                  <a
                    href="https://foodsprepared.wasmer.app/wp-admin/profile.php#application-passwords-section"
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-400 hover:underline"
                  >
                    Application Password
                  </a>.
                </li>
                <li>
                  <strong>Local Fallback:</strong> If keys are not set, articles automatically open in your live local reader at <code>http://localhost:3001</code> with 1-click HTML copy for WordPress.
                </li>
              </ul>
            </div>

            <form onSubmit={handleTestConnection} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  WordPress Site Domain URL
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://foodsprepared.wasmer.app"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center justify-between">
                  <span>PinRecipe Bridge Token (<code>X-Scale-Bridge-Token</code>)</span>
                  <a
                    href="https://foodsprepared.wasmer.app/wp-admin/admin.php?page=pinrecipe-scale-bridge"
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-400 hover:text-pink-300 font-normal"
                  >
                    Get Token from WP Admin →
                  </a>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={bridgeTokenInput}
                    onChange={(e) => setBridgeTokenInput(e.target.value)}
                    placeholder="scl_..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 font-mono"
                  />
                  <Key className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>WP Username</span>
                  </label>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="elattarayman1"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>App Password</span>
                    </span>
                    <a
                      href="https://foodsprepared.wasmer.app/wp-admin/profile.php#application-passwords-section"
                      target="_blank"
                      rel="noreferrer"
                      className="text-pink-400 hover:text-pink-300"
                      title="Create in WP Admin"
                    >
                      New →
                    </a>
                  </label>
                  <input
                    type="password"
                    value={appPasswordInput}
                    onChange={(e) => setAppPasswordInput(e.target.value)}
                    placeholder="xxxx xxxx xxxx xxxx"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Post Status
                  </label>
                  <select
                    value={statusSelect}
                    onChange={(e) => setStatusSelect(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="publish">Publish Live Instantly</option>
                    <option value="draft">Draft (Review First)</option>
                    <option value="pending">Pending Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Categories Found
                  </label>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-emerald-400 font-mono">
                    {wpConfig.activeCategories.length} Categories Synced
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={testing}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-pink-700 hover:bg-pink-800 text-white text-xs font-bold shadow transition-all disabled:opacity-50"
                >
                  {testing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Testing Endpoint...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Test & Verify Connection</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>

            {testResult && (
              <div
                className={`p-3.5 rounded-lg border text-xs flex items-center justify-between ${
                  testResult.success
                    ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-800/40 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Article Management & Quick Publishing */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-[#0f172a]/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-pink-400" />
                  <span>Article Deployment Queue ({recipes.length} Articles)</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Every article includes clean white reading design, high-res photography, and printable recipe card.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {recipes.map((r) => {
                const isCurrentlySyncing = syncingId === r.id;
                const isCopied = copiedId === r.id;
                const articleUrl = (r.wpPostUrl && !r.wpPostUrl.includes('wasmer.app')) ? r.wpPostUrl : `/api/article/${r.id}`;

                return (
                  <div
                    key={r.id}
                    className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div 
                      onClick={() => onOpenArticleModal?.(r)}
                      className="flex items-center gap-3 min-w-0 cursor-pointer group"
                      title="Click to open and read full article"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-800 bg-slate-900 group-hover:border-pink-500/50 transition-colors">
                        {r.imageUrl ? (
                          <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <BookOpen className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-pink-300 transition-colors truncate">{r.title}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="text-pink-400 font-medium">{r.niche}</span>
                          <span>•</span>
                          <span>{r.prepTime} prep · {r.cookTime} cook</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-mono">{r.calories} kcal</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {/* Copy Formatted HTML */}
                      <button
                        onClick={() => handleCopyRecipeHtml(r)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1 transition-colors"
                        title="Copy Clean Article HTML for WordPress"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                        <span className="hidden sm:inline">{isCopied ? 'Copied' : 'HTML'}</span>
                      </button>

                      {/* Read Article in Clean White Modal */}
                      <button
                        onClick={() => onOpenArticleModal ? onOpenArticleModal(r) : window.open(`/api/article/${r.id}`, '_blank')}
                        className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold border border-pink-500 flex items-center gap-1.5 transition-all shadow-md hover:shadow-pink-500/20"
                        title="Open in Clean White Magazine Reader"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Read Article</span>
                      </button>

                      {/* Download Recipe PDF Card */}
                      <button
                        onClick={() => openPrintRecipeWindow(r)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
                        title="Download Recipe PDF"
                      >
                        <Download className="w-3.5 h-3.5 text-pink-400" />
                      </button>

                      {/* Publish / View Live */}
                      <button
                        onClick={() => handlePublishSingle(r.id)}
                        disabled={isCurrentlySyncing}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-700 hover:bg-pink-800 text-white text-xs font-bold shadow transition-all disabled:opacity-50"
                      >
                        {isCurrentlySyncing ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Syncing...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3 h-3" />
                            <span>Publish</span>
                          </>
                        )}
                      </button>

                      {/* Open Link */}
                      <a
                        href={articleUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                        title="Open Live Article Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
