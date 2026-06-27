-- GraphOne Database Schema
-- PostgreSQL schema for AI Intelligence Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies Table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    category TEXT NOT NULL,
    founded_year INTEGER,
    employee_count INTEGER,
    headquarters TEXT,
    stage TEXT NOT NULL,
    valuation BIGINT,
    is_unicorn BOOLEAN DEFAULT FALSE,
    growth_score NUMERIC(10, 2) DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investors Table
CREATE TABLE investors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    stage_focus TEXT[] DEFAULT '{}',
    sector_focus TEXT[] DEFAULT '{}',
    aum BIGINT,
    investment_thesis TEXT,
    portfolio_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Founders Table
CREATE TABLE founders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    title TEXT,
    bio TEXT,
    avatar_url TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Funding Rounds Table
CREATE TABLE funding_rounds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    round_type TEXT NOT NULL,
    amount BIGINT NOT NULL,
    valuation BIGINT,
    announced_date DATE NOT NULL,
    lead_investor_id UUID REFERENCES investors(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investments Junction Table (Many-to-Many: Investors <-> Companies)
CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investor_id UUID NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    funding_round_id UUID REFERENCES funding_rounds(id) ON DELETE SET NULL,
    investment_date DATE,
    stake_percentage NUMERIC(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(investor_id, company_id, funding_round_id)
);

-- Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    url TEXT,
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News Articles Table
CREATE TABLE news_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    summary TEXT,
    url TEXT NOT NULL,
    source TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company News Junction Table (Many-to-Many: Companies <-> News Articles)
CREATE TABLE company_news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    news_article_id UUID NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, news_article_id)
);

-- Indexes for Performance Optimization

-- Companies indexes
CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_companies_category ON companies(category);
CREATE INDEX idx_companies_stage ON companies(stage);
CREATE INDEX idx_companies_growth_score ON companies(growth_score DESC);
CREATE INDEX idx_companies_is_unicorn ON companies(is_unicorn);

-- Investors indexes
CREATE INDEX idx_investors_slug ON investors(slug);
CREATE INDEX idx_investors_type ON investors(type);
CREATE INDEX idx_investors_portfolio_count ON investors(portfolio_count DESC);

-- Founders indexes
CREATE INDEX idx_founders_company_id ON founders(company_id);

-- Funding rounds indexes
CREATE INDEX idx_funding_rounds_company_id ON funding_rounds(company_id);
CREATE INDEX idx_funding_rounds_announced_date ON funding_rounds(announced_date DESC);
CREATE INDEX idx_funding_rounds_lead_investor_id ON funding_rounds(lead_investor_id);

-- Investments indexes
CREATE INDEX idx_investments_investor_id ON investments(investor_id);
CREATE INDEX idx_investments_company_id ON investments(company_id);
CREATE INDEX idx_investments_funding_round_id ON investments(funding_round_id);

-- Products indexes
CREATE INDEX idx_products_company_id ON products(company_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_upvotes ON products(upvotes DESC);

-- News articles indexes
CREATE INDEX idx_news_articles_published_at ON news_articles(published_at DESC);
CREATE INDEX idx_news_articles_tags ON news_articles USING GIN(tags);

-- Company news indexes
CREATE INDEX idx_company_news_company_id ON company_news(company_id);
CREATE INDEX idx_company_news_news_article_id ON company_news(news_article_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE funding_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_news ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public read access for companies" ON companies
    FOR SELECT USING (true);

CREATE POLICY "Public read access for investors" ON investors
    FOR SELECT USING (true);

CREATE POLICY "Public read access for founders" ON founders
    FOR SELECT USING (true);

CREATE POLICY "Public read access for funding_rounds" ON funding_rounds
    FOR SELECT USING (true);

CREATE POLICY "Public read access for investments" ON investments
    FOR SELECT USING (true);

CREATE POLICY "Public read access for products" ON products
    FOR SELECT USING (true);

CREATE POLICY "Public read access for news_articles" ON news_articles
    FOR SELECT USING (true);

CREATE POLICY "Public read access for company_news" ON company_news
    FOR SELECT USING (true);

-- Service role has full access (configured via Supabase)
-- Write operations will be handled via API with API key authentication

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investors_updated_at
    BEFORE UPDATE ON investors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate trending score (can be called from API or as scheduled job)
-- Note: This is a placeholder - actual implementation will be in the API layer
CREATE OR REPLACE FUNCTION calculate_trending_score(company_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    funding_recency NUMERIC;
    news_mentions NUMERIC;
    view_velocity NUMERIC;
    employee_growth NUMERIC;
    product_upvotes NUMERIC;
    final_score NUMERIC;
BEGIN
    -- Placeholder for trending score calculation
    -- Actual implementation will be in API layer with more complex logic
    final_score := 0;
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;
