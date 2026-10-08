export type PipelineStepId = 
  | 'ingestion'
  | 'synthesis'
  | 'media_gen'
  | 'wp_publish'
  | 'pin_schedule';

export interface PipelineStep {
  id: PipelineStepId;
  name: string;
  shortDesc: string;
  iconName: string;
}

export interface RecipeArticle {
  title: string;
  excerpt: string;
  readingTimeMinutes: number;
  featuredImageUrl: string;
  introduction: string;
  whyYouWillLoveThis: string[];
  culinarySecrets: string[];
  stepByStepWalkthrough: Array<{
    heading: string;
    description: string;
    proTip?: string;
  }>;
  substitutionsAndVariations: string[];
  frequentlyAskedQuestions: Array<{
    question: string;
    answer: string;
  }>;
  storageAndReheating: string;
  servingSuggestions: string;
}

export interface RecipeItem {
  id: string;
  topic: string;
  title: string;
  slug: string;
  niche: string;
  dietary: string;
  status: 'queued' | 'synthesizing' | 'generating_image' | 'publishing_wp' | 'scheduling_pin' | 'completed' | 'failed';
  currentStepIndex: number;
  progress: number;
  imageUrl: string;
  macroPhotoPrompt: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: string;
  calories: number;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  macros: {
    protein: string;
    carbs: string;
    fat: string;
    fiber?: string;
  };
  ingredients: Array<{ item: string; amount: string; notes?: string }>;
  instructions: Array<{ step: number; title: string; text: string; timerMinutes?: number }>;
  chefTips: string[];
  metaDescription: string;
  focusKeyword: string;
  schemaJsonLd?: Record<string, any>;
  article?: RecipeArticle;
  articleHtml?: string;
  pinterestPin: {
    title: string;
    description: string;
    hashtags: string[];
    overlayHeadline: string;
    board: string;
    scheduledTime: string;
    status: 'pending' | 'scheduled' | 'published';
  };
  wpStatus: 'not_synced' | 'draft' | 'published';
  wpPostUrl?: string;
  wpCategory?: string;
  createdAt: string;
  completedAt?: string;
  healthScore: number;
  logEntries: string[];
}

export interface WordPressConfig {
  url: string;
  username: string;
  appPassword: string;
  syncApiKey: string;
  bridgeToken?: string;
  useAutoSyncPlugin: boolean;
  defaultStatus: 'draft' | 'publish' | 'pending';
  isConnected: boolean;
  activeCategories: Array<{ id: number; name: string; slug: string; count: number }>;
  lastSyncTime?: string;
}

export interface PinterestConfig {
  defaultBoard: string;
  boards: string[];
  intervalMinutes: number;
  enableJitter: boolean;
  utmCampaign: string;
  autoSaveToFeed: boolean;
}

export interface EngineStats {
  queueProcessed: number;
  queueTotal: number;
  imagesGenerated: number;
  wpCategoriesCount: number;
  campaignHealth: number;
}
