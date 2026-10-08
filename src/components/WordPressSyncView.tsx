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
  ArrowRight
} from 'lucide-react';

interface WordPressSyncViewProps {
  wpConfig: WordPressConfig;
  onUpdateConfig: (newConfig: WordPressConfig) => void;
  recipes: RecipeItem[];
  onPublishRecipeToWp: (recipeId: string) => Promise<boolean | void>;
  onSyncAllToWp?: () => Promise<void>;
  isSyncing?: boolean;
}

export const WordPressSyncView: React.FC<WordPressSyncViewProps> = ({
  wpConfig,
  onUpdateConfig,
  recipes,
  onPublishRecipeToWp,
  onSyncAllToWp,
  isSyncing = false,
}) => {
  const [urlInput, setUrlInput] = useState(wpConfig.url || 'https://foodsprepared.wasmer.app');
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
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string; link?: string } | null>(null);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [showPayloadModal, setShowPayloadModal] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const webhookUrl = `${urlInput.replace(/\/$/, '')}/wp-json/autosync/v1/import`;

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
          apiKey: syncApiKeyInput 
        }),
      });
      const data = await res.json();

      if (res.ok && data.connected) {
        onUpdateConfig({
          ...wpConfig,
          url: urlInput,
          syncApiKey: syncApiKeyInput,
          defaultStatus: statusSelect,
          isConnected: true,
          activeCategories: data.categories || wpConfig.activeCategories,
          lastSyncTime: new Date().toLocaleTimeString(),
        });

        let msg = `WordPress connected (${data.pingMs}ms latency).`;
        if (data.pluginActive) {
          msg += data.authValid 
            ? ' AutoSync plugin verified & authenticated!' 
            : ' AutoSync plugin detected! ' + (data.authMessage || 'Please verify API key.');
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
      syncApiKey: syncApiKeyInput,
      defaultStatus: statusSelect,
    });
    setSyncMessage({
      type: 'info',
      text: 'Settings saved! You can now sync articles to WordPress.',
    });
    setTimeout(() => setSyncMessage(null), 3000);
  };

  const handleCopyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handlePublishSingle = async (recipeId: string) => {
    setSyncingId(recipeId);
    setSyncMessage(null);
    try {
      await onPublishRecipeToWp(recipeId);
      const recipe = recipes.find(r => r.id === recipeId);
      setSyncMessage({
        type: 'success',
        text: `Successfully synced "${recipe?.title || 'Article'}" to WordPress!`,
        link: recipe?.wpPostUrl || `${urlInput.replace(/\/$/, '')}/${recipe?.slug || ''}`
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

  // Sample payload formatted for the Auto_Sync_API plugin
  const samplePayload = {
    articles: recipes.slice(0, 2).map((r) => ({
      title: r.title,
      content: `<p>${r.metaDescription}</p>`,
      external_id: r.id,
      status: wpConfig.defaultStatus || 'publish',
      slug: r.slug,
      categories: [r.niche, 'Recipes'],
      tags: [r.focusKeyword, ...(r.pinterestPin?.hashtags?.map((h) => h.replace('#', '')) || [])],
      recipe: {
        title: r.title,
        prep_time: r.prepTime,
        cook_time: r.cookTime,
        servings: r.servings,
        calories: r.calories.toString(),
        cuisine: r.schemaJsonLd?.recipeCuisine || 'General',
        ingredients: r.ingredients.map((i) => `${i.amount} ${i.item}`),
        instructions: r.instructions.map((s) => `${s.step}. ${s.title}: ${s.text}`),
        notes: r.chefTips.join(' | ')
      },
      featured_image: r.imageUrl
    }))
  };

  const publishedRecipes = recipes.filter((r) => r.wpStatus === 'published');
  const readyToSyncRecipes = recipes.filter((r) => r.wpStatus !== 'published');

  return (
    <div className="space-y-6">
      {/* Top Banner: AutoSync Engine Hub */}
      <div className="bg-[#0f172a]/90 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-semibold text-white">
                  WordPress Auto Article & Recipe Synchronizer
                </h2>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Plugin Detected: auto-article-sync
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Targeting <code className="text-pink-300 font-mono">https://foodsprepared.wasmer.app</code> · Publishes full culinary articles, nutrition cards, and featured media.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://foodsprepared.wasmer.app/wp-admin/admin.php?page=autosync-settings"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <span>WP AutoSync Settings</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            {onSyncAllToWp && (
              <button
                onClick={onSyncAllToWp}
                disabled={isSyncing}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-medium shadow-md transition-all disabled:opacity-50"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Syncing Queue...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Sync All Articles Now</span>
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
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs animate-in fade-in ${
            syncMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : syncMessage.type === 'error'
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              : 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {syncMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : syncMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <ShieldCheck className="w-4 h-4 shrink-0" />
            )}
            <span>{syncMessage.text}</span>
          </div>
          {syncMessage.link && (
            <a
              href={syncMessage.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium underline hover:text-white"
            >
              <span>View Article on WordPress</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* Main Grid: Settings & Webhook on Left, Live Articles on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Plugin Credentials & Ingestion URL */}
        <div className="lg:col-span-6 space-y-5">
          {/* Plugin Setup Card */}
          <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-rose-400" />
                <span>AutoSync Plugin Credentials</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowPayloadModal(true)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
              >
                <Code className="w-3 h-3" />
                <span>View Schema JSON</span>
              </button>
            </div>

            {/* Quick 3-step Instructions */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-xs space-y-2 text-slate-300">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px] font-bold">1</span>
                <span>How to link your AutoSync Plugin:</span>
              </div>
              <ol className="list-decimal pl-5 space-y-1 text-slate-400 text-[11px] leading-relaxed">
                <li>
                  Open your WordPress Admin at{' '}
                  <a
                    href="https://foodsprepared.wasmer.app/wp-admin/admin.php?page=autosync-settings"
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-400 hover:underline"
                  >
                    AutoSync Menu Settings
                  </a>.
                </li>
                <li>Copy the 32-character <strong>API Secret Key</strong> displayed there.</li>
                <li>Paste it below and click <strong>Test & Save Connection</strong>!</li>
              </ol>
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
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center justify-between">
                  <span>AutoSync Plugin API Secret Key (<code>x-sync-key</code>)</span>
                  <a
                    href="https://foodsprepared.wasmer.app/wp-admin/admin.php?page=autosync-settings"
                    target="_blank"
                    rel="noreferrer"
                    className="text-rose-400 hover:text-rose-300 font-normal"
                  >
                    Get Key from WP Admin →
                  </a>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={syncApiKeyInput}
                    onChange={(e) => setSyncApiKeyInput(e.target.value)}
                    placeholder="e.g. 32-character key from AutoSync settings"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-3 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono"
                  />
                  <Key className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Default Post Status
                  </label>
                  <select
                    value={statusSelect}
                    onChange={(e) => setStatusSelect(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="publish">Publish Live Instantly</option>
                    <option value="draft">Draft (Safe Editorial Review)</option>
                    <option value="pending">Pending Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Live Webhook Route
                  </label>
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-[11px] font-mono text-slate-400 truncate">
                    <span className="truncate">/autosync/v1/import</span>
                    <button
                      type="button"
                      onClick={handleCopyWebhookUrl}
                      className="text-slate-400 hover:text-white shrink-0 p-0.5"
                      title="Copy full endpoint"
                    >
                      {copiedWebhook ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={testing}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium shadow-md transition-all disabled:opacity-50"
                >
                  {testing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Testing Endpoint...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Test & Save Connection</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>

            {testResult && (
              <div
                className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                  testResult.success
                    ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-800/40 text-rose-300'
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
                {testResult.pingMs && (
                  <span className="font-mono text-[11px] text-emerald-400 shrink-0">
                    {testResult.pingMs}ms
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Articles Ready to Sync & Published Live */}
        <div className="lg:col-span-6 space-y-5">
          {/* Ready to Sync Articles */}
          <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Send className="w-3.5 h-3.5 text-rose-400" />
                <span>Generated Articles Ready to Sync ({recipes.length})</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">
                {publishedRecipes.length} Synced · {readyToSyncRecipes.length} Pending
              </span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {recipes.map((r) => {
                const isPublished = r.wpStatus === 'published';
                const isCurrentlySyncing = syncingId === r.id;

                return (
                  <div
                    key={r.id}
                    className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-800 shrink-0 bg-slate-950">
                        <img
                          src={r.imageUrl}
                          alt={r.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-white truncate max-w-xs sm:max-w-sm">
                          {r.title}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="text-pink-400 font-mono">{r.niche}</span>
                          <span>•</span>
                          <span className="text-slate-500">{r.totalTime}</span>
                          <span>•</span>
                          <span className="text-amber-400 font-mono">{r.calories} kcal</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {isPublished ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-md">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Live on WP</span>
                          </span>
                          <a
                            href={r.wpPostUrl || `https://foodsprepared.wasmer.app/${r.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                            title="View live post on foodsprepared.wasmer.app"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ) : (
                        <button
                          onClick={() => handlePublishSingle(r.id)}
                          disabled={isCurrentlySyncing}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-medium shadow transition-all disabled:opacity-50"
                        >
                          {isCurrentlySyncing ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>Syncing...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3 h-3" />
                              <span>Publish to WP</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Published Articles List */}
          {publishedRecipes.length > 0 && (
            <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Published Posts ({publishedRecipes.length})</span>
                </span>
                <a
                  href="https://foodsprepared.wasmer.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-emerald-400 hover:underline inline-flex items-center gap-1 font-normal lowercase"
                >
                  <span>Visit foodsprepared.wasmer.app</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {publishedRecipes.map((r) => (
                  <div
                    key={r.id}
                    className="bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
                  >
                    <div className="min-w-0 mr-2">
                      <div className="text-white font-medium truncate">{r.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">
                        slug: /{r.slug} · category: {r.wpCategory || r.niche}
                      </div>
                    </div>
                    <a
                      href={r.wpPostUrl || `https://foodsprepared.wasmer.app/${r.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded transition-colors shrink-0"
                      title="Open post in browser"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* JSON Schema Payload Modal */}
      {showPayloadModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-pink-400" />
                  <span>AutoSync Plugin Import Payload Schema</span>
                </h3>
                <p className="text-xs text-slate-400">
                  This payload is sent to <code className="text-pink-300">/wp-json/autosync/v1/import</code> with header <code className="text-pink-300">x-sync-key</code>.
                </p>
              </div>
              <button
                onClick={() => setShowPayloadModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-96 leading-relaxed">
              {JSON.stringify(samplePayload, null, 2)}
            </pre>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Compatible with Auto_Sync_API v1.0.0
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(samplePayload, null, 2));
                  setCopiedPayload(true);
                  setTimeout(() => setCopiedPayload(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPayload ? 'Copied!' : 'Copy JSON'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
