-- Auth and Saved Items Migration
-- Adds authentication tables and saved companies/investors functionality

-- Users table for authenticated users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    github_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved Companies table
CREATE TABLE IF NOT EXISTS saved_companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, company_id)
);

-- Saved Investors table
CREATE TABLE IF NOT EXISTS saved_investors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    investor_id UUID NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, investor_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_saved_companies_user_id ON saved_companies(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_companies_company_id ON saved_companies(company_id);
CREATE INDEX IF NOT EXISTS idx_saved_investors_user_id ON saved_investors(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_investors_investor_id ON saved_investors(investor_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_github_id ON users(github_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_investors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for saved_companies table
CREATE POLICY "Users can view their own saved companies" ON saved_companies
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save companies" ON saved_companies
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave their companies" ON saved_companies
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for saved_investors table
CREATE POLICY "Users can view their own saved investors" ON saved_investors
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save investors" ON saved_investors
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave their investors" ON saved_investors
    FOR DELETE USING (auth.uid() = user_id);
