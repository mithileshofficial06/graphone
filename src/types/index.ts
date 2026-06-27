// Core entity types matching the database schema

export interface Company {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  category: string;
  founded_year: number | null;
  employee_count: number | null;
  headquarters: string | null;
  stage: string;
  valuation: number | null;
  is_unicorn: boolean;
  growth_score: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Investor {
  id: string;
  slug: string;
  name: string;
  type: string;
  logo_url: string | null;
  website_url: string | null;
  stage_focus: string[];
  sector_focus: string[];
  aum: number | null;
  investment_thesis: string | null;
  portfolio_count: number;
  created_at: string;
  updated_at: string;
}

export interface Founder {
  id: string;
  company_id: string;
  name: string;
  title: string | null;
  bio: string | null;
  avatar_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  created_at: string;
}

export interface FundingRound {
  id: string;
  company_id: string;
  round_type: string;
  amount: number;
  valuation: number | null;
  announced_date: string;
  lead_investor_id: string | null;
  created_at: string;
}

export interface Investment {
  id: string;
  investor_id: string;
  company_id: string;
  funding_round_id: string | null;
  investment_date: string | null;
  stake_percentage: number | null;
  created_at: string;
}

export interface Product {
  id: string;
  company_id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  url: string | null;
  upvotes: number;
  created_at: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string | null;
  url: string;
  source: string;
  published_at: string;
  tags: string[];
  created_at: string;
}

export interface CompanyNews {
  id: string;
  company_id: string;
  news_article_id: string;
  created_at: string;
}

// Extended types with relations for API responses

export interface CompanyWithRelations extends Company {
  founders?: Founder[];
  funding_rounds?: FundingRound[];
  products?: Product[];
  investors?: Investor[];
  news?: NewsArticle[];
}

export interface InvestorWithRelations extends Investor {
  investments?: Investment[];
  companies?: Company[];
}

export interface FundingRoundWithRelations extends FundingRound {
  company?: Company;
  lead_investor?: Investor;
}

export interface ProductWithRelations extends Product {
  company?: Company;
}

export interface NewsArticleWithRelations extends NewsArticle {
  companies?: Company[];
}

// API Response types

export interface ApiResponse<T> {
  data: T | null;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
  error: string | null;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface CompanyFilters extends PaginationParams {
  category?: string;
  stage?: string;
  is_unicorn?: boolean;
  search?: string;
}

export interface InvestorFilters extends PaginationParams {
  type?: string;
  stage_focus?: string;
  sector_focus?: string;
  search?: string;
}

export interface ProductFilters extends PaginationParams {
  category?: string;
  company_id?: string;
  search?: string;
}

export interface NewsFilters extends PaginationParams {
  tags?: string[];
  company_id?: string;
  search?: string;
}

// Trending score components
export interface TrendingScoreComponents {
  funding_recency_score: number;
  news_mention_score: number;
  view_velocity_score: number;
  employee_growth_score: number;
  product_upvote_score: number;
  total_score: number;
}

// Platform statistics
export interface PlatformStats {
  total_companies: number;
  total_investors: number;
  total_funding_raised: number;
  total_products: number;
  unicorn_count: number;
  recent_funding_rounds: number;
}

// Search result type
export interface SearchResult {
  type: 'company' | 'investor' | 'product';
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
}

// Enums for consistency
export const CompanyStage = {
  SEED: 'Seed',
  SERIES_A: 'Series A',
  SERIES_B: 'Series B',
  SERIES_C: 'Series C',
  SERIES_D: 'Series D',
  SERIES_E: 'Series E',
  PUBLIC: 'Public',
  ACQUIRED: 'Acquired',
} as const;

export const CompanyCategory = {
  CHAT: 'Chat',
  CODE: 'Code',
  IMAGE: 'Image',
  VIDEO: 'Video',
  VOICE: 'Voice',
  RESEARCH: 'Research',
  INFRASTRUCTURE: 'Infrastructure',
  ENTERPRISE: 'Enterprise',
  AGENTS: 'Agents',
  ROBOTICS: 'Robotics',
} as const;

export const InvestorType = {
  VC: 'VC',
  ANGEL: 'Angel',
  CORPORATE: 'Corporate',
  ACCELERATOR: 'Accelerator',
  PRIVATE_EQUITY: 'Private Equity',
  SOVEREIGN_WEALTH: 'Sovereign Wealth',
} as const;

export const ProductCategory = {
  CHAT: 'Chat',
  CODE: 'Code',
  IMAGE: 'Image',
  VIDEO: 'Video',
  VOICE: 'Voice',
} as const;

export type CompanyStageType = typeof CompanyStage[keyof typeof CompanyStage];
export type CompanyCategoryType = typeof CompanyCategory[keyof typeof CompanyCategory];
export type InvestorTypeType = typeof InvestorType[keyof typeof InvestorType];
export type ProductCategoryType = typeof ProductCategory[keyof typeof ProductCategory];
