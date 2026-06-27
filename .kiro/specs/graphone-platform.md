# GraphOne - AI Intelligence Platform

## Metadata
- **Status**: draft
- **Created**: 2026-06-27
- **Owner**: Mithilesh KS
- **Priority**: high

## Overview
GraphOne is a global intelligence layer for the AI economy — a Bloomberg for AI startups. The platform connects AI companies, founders, investors, products, funding rounds, and talent with real-time data, deep entity profiles, and powerful discovery across 30,000+ companies and 6,000+ investors.

## Design

### Architecture Overview

**Stack**:
- **Framework**: Next.js 14 App Router (TypeScript strict mode)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Validation**: Zod
- **Typography**: Inter font

**Architecture Decisions**:
- Next.js App Router for unified frontend/backend deployment
- Server components for faster initial loads
- API routes eliminate separate backend server
- Supabase for managed PostgreSQL with instant REST API
- In-memory caching with 5-minute TTL for trending/stats
- Rate limiting: 100 req/min per IP

### Database Schema

#### Core Tables

**companies**
```sql
- id: uuid (PK)
- slug: text (unique, indexed)
- name: text
- tagline: text
- description: text
- logo_url: text
- website_url: text
- category: text (indexed)
- founded_year: integer
- employee_count: integer
- headquarters: text
- stage: text (indexed)
- valuation: bigint
- is_unicorn: boolean
- growth_score: numeric (indexed DESC)
- view_count: integer
- created_at: timestamp
- updated_at: timestamp
```

**investors**
```sql
- id: uuid (PK)
- slug: text (unique, indexed)
- name: text
- type: text (VC, Angel, Corporate, etc.)
- logo_url: text
- website_url: text
- stage_focus: text[] (Seed, Series A, etc.)
- sector_focus: text[] (AI/ML, Enterprise, etc.)
- aum: bigint (assets under management)
- investment_thesis: text
- portfolio_count: integer
- created_at: timestamp
- updated_at: timestamp
```

**founders**
```sql
- id: uuid (PK)
- company_id: uuid (FK -> companies)
- name: text
- title: text
- bio: text
- avatar_url: text
- linkedin_url: text
- twitter_url: text
- created_at: timestamp
```

**funding_rounds**
```sql
- id: uuid (PK)
- company_id: uuid (FK -> companies)
- round_type: text (Seed, Series A, etc.)
- amount: bigint
- valuation: bigint
- announced_date: date (indexed DESC)
- lead_investor_id: uuid (FK -> investors)
- created_at: timestamp
```

**investments** (junction table)
```sql
- id: uuid (PK)
- investor_id: uuid (FK -> investors)
- company_id: uuid (FK -> companies)
- funding_round_id: uuid (FK -> funding_rounds, nullable)
- investment_date: date
- stake_percentage: numeric (nullable)
- created_at: timestamp
```

**products**
```sql
- id: uuid (PK)
- company_id: uuid (FK -> companies)
- slug: text (unique)
- name: text
- description: text
- category: text (Chat, Code, Image, Video, Voice)
- url: text
- upvotes: integer
- created_at: timestamp
```

**news_articles**
```sql
- id: uuid (PK)
- title: text
- summary: text
- url: text
- source: text
- published_at: timestamp (indexed DESC)
- tags: text[]
- created_at: timestamp
```

**company_news** (junction table)
```sql
- id: uuid (PK)
- company_id: uuid (FK -> companies)
- news_article_id: uuid (FK -> news_articles)
- created_at: timestamp
```

#### Indexes
- companies: slug, category, stage, growth_score DESC
- investors: slug, type
- funding_rounds: company_id, announced_date DESC
- news_articles: published_at DESC
- products: category, company_id

### Trending Score Algorithm

Multi-signal weighted formula:
```
trending_score = 
  (funding_recency_score × 0.35) +
  (news_mention_score × 0.25) +
  (view_velocity_score × 0.20) +
  (employee_growth_score × 0.10) +
  (product_upvote_score × 0.10)
```

**Signal Definitions**:
- `funding_recency_score`: 1.0 if funded in last 30 days, exponential decay to 0 over 365 days
- `news_mention_score`: Normalized count of news articles in last 30 days (capped at 10)
- `view_velocity_score`: view_count / days_since_created, normalized across all companies
- `employee_growth_score`: employee_count relative to founded_year, normalized
- `product_upvote_score`: Sum of product upvotes, normalized

### API Architecture

#### Endpoint Groups

**Companies** (`/api/companies/`)
- `GET /` - List companies (paginated, filterable by category/stage)
- `GET /trending` - Trending companies (cached 5 min)
- `GET /[slug]` - Company detail with relations
- `POST /` - Create company (requires API key)

**Investors** (`/api/investors/`)
- `GET /` - List investors (paginated, filterable by type/stage_focus)
- `GET /most-active` - Most active investors by investment count
- `GET /[slug]` - Investor detail with portfolio

**Products** (`/api/products/`)
- `GET /` - List products (filterable by category)
- `GET /popular` - Popular products by upvotes
- `GET /[slug]` - Product detail

**News** (`/api/news/`)
- `GET /` - News feed (paginated)
- `GET /trending` - Trending news (most recent + mentions)
- `GET /` - Filter by tags (query param)

**Search** (`/api/search/`)
- `GET /` - Cross-entity full-text search (companies, investors, products)

**Stats** (`/api/stats/`)
- `GET /` - Platform aggregate stats (cached 5 min)

**Founders** (`/api/founders/`)
- `GET /[id]` - Founder profile

#### Response Format
```typescript
{
  data: T | T[],
  meta: {
    total: number,
    page: number,
    limit: number
  },
  error: string | null
}
```

#### Authentication
- Write operations require `X-API-Key` header
- Validated against `API_KEY` env variable

#### Caching
- In-memory Map cache with 5-minute TTL
- Applied to: `/api/companies/trending`, `/api/stats`

#### Rate Limiting
- 100 requests per minute per IP
- Sliding window counter (in-memory)

### Frontend Pages

#### Page 1: AI Companies Home (`/`)
**Sections**:
- Hero with search bar
- Trending companies carousel (horizontal scroll)
- Fastest growing companies grid
- Emerging startups to watch
- Browse by category grid (Chat, Code, Image, Video, Voice, Research)
- AI Unicorns section
- Frontier Labs section

**Data Sources**:
- `/api/companies/trending`
- `/api/companies?stage=seed&limit=6`
- `/api/companies?is_unicorn=true`

#### Page 2: Company Detail (`/companies/[slug]`)
**Sections**:
- Company header (logo, name, tagline, funding stats, stage)
- Timeline of milestones
- Funding rounds table
- Ownership donut chart (Recharts - investor stakes)
- Investors by stage
- Founders & leadership grid
- Products grid
- Competitor landscape
- News feed (filtered by company)
- Similar companies

**Data Sources**:
- `/api/companies/[slug]`
- Returns: company + funding_rounds + founders + products + investors + news

#### Page 3: Investors Discovery (`/investors`)
**Sections**:
- Hero with search
- Trending investors carousel
- Investor collections (by type: VC, Angel, Corporate)
- Browse by investor type
- Most active investors grid
- Capital themes grid (AI infra, vertical AI, agents)

**Data Sources**:
- `/api/investors/most-active`
- `/api/investors?type=VC`

#### Page 4: Investor Profile (`/investors/[slug]`)
**Sections**:
- Investor header (logo, name, type, AUM, stage focus)
- Investment thesis
- Portfolio concentration donut chart (by sector)
- Recent investments carousel
- Investment velocity table (investments per quarter)
- Co-investor network (who they co-invest with)
- Follow-on strength stats
- Related investors

**Data Sources**:
- `/api/investors/[slug]`
- Returns: investor + investments + companies + co-investors

#### Page 5: AI Products (`/products`)
**Sections**:
- Category tabs (Chat, Code, Image, Video, Voice)
- Popular right now section (top 6 by upvotes)
- Most liked products list with upvote counts
- Product of the day sidebar (random featured)

**Data Sources**:
- `/api/products?category=Chat`
- `/api/products/popular`

### Component Architecture

#### Shared Components
- `<Navbar>` - Global navigation with logo, links, search
- `<Footer>` - Links, social, copyright
- `<SearchBar>` - Autocomplete search with cross-entity results
- `<CompanyCard>` - Company preview card (logo, name, tagline, funding)
- `<InvestorCard>` - Investor preview card (logo, name, type, portfolio count)
- `<ProductCard>` - Product preview (name, description, upvotes)
- `<NewsCard>` - News article preview (title, source, date)
- `<FundingRoundTable>` - Table of funding rounds
- `<DonutChart>` - Recharts-based donut/pie chart
- `<Carousel>` - Horizontal scroll carousel with navigation

#### Animations (Framer Motion)
- Card hover effects (scale, shadow)
- Page transitions (fade in)
- Carousel slide animations

### Environment Variables

Required:
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
API_KEY=<your-api-key-for-writes>
```

### Seed Data

**Companies** (50+):
OpenAI, Anthropic, Mistral AI, Perplexity, Cursor, Lovable, ElevenLabs, Midjourney, Runway, Pika, Hugging Face, Cohere, Stability AI, Character.AI, Harvey, Glean, Databricks, Scale AI, etc.

**Investors** (20+):
Andreessen Horowitz, Sequoia Capital, Lightspeed, Accel, General Catalyst, Khosla Ventures, Tiger Global, SoftBank, Y Combinator, etc.

**News** (100+):
Recent funding rounds, product launches, AI research breakthroughs, market analysis

### Performance Targets
- LCP (Largest Contentful Paint): < 2.5s
- API response time: < 200ms (cached), < 500ms (uncached)
- Bundle size: < 300KB (JS)

### Security
- Row Level Security (RLS) enabled on all Supabase tables
- API key validation on write operations
- Input validation with Zod on all API routes
- Rate limiting on all endpoints

## Tasks

### Phase 1: Foundation & Database
- [ ] T1.1: Initialize Next.js 14 project with TypeScript and Tailwind
- [ ] T1.2: Set up Supabase project and configure environment variables
- [ ] T1.3: Create complete database schema with all tables and indexes
- [ ] T1.4: Enable RLS policies on all tables
- [ ] T1.5: Create seed script for companies, investors, founders, funding rounds, products, news

### Phase 2: API Layer
- [ ] T2.1: Create API response type definitions and Zod schemas
- [ ] T2.2: Implement rate limiting middleware
- [ ] T2.3: Implement caching utility (in-memory with TTL)
- [ ] T2.4: Build companies API endpoints (list, trending, detail, create)
- [ ] T2.5: Build investors API endpoints (list, most-active, detail)
- [ ] T2.6: Build products API endpoints (list, popular, detail)
- [ ] T2.7: Build news API endpoints (feed, trending, filter)
- [ ] T2.8: Build search API endpoint (cross-entity)
- [ ] T2.9: Build stats API endpoint (platform aggregates)
- [ ] T2.10: Build founders API endpoint (detail)

### Phase 3: Shared Components
- [ ] T3.1: Create layout with Navbar and Footer
- [ ] T3.2: Build SearchBar component with autocomplete
- [ ] T3.3: Build CompanyCard component
- [ ] T3.4: Build InvestorCard component
- [ ] T3.5: Build ProductCard component
- [ ] T3.6: Build NewsCard component
- [ ] T3.7: Build FundingRoundTable component
- [ ] T3.8: Build DonutChart component with Recharts
- [ ] T3.9: Build Carousel component with Framer Motion

### Phase 4: Page 1 - AI Companies Home
- [ ] T4.1: Create home page layout and hero section
- [ ] T4.2: Implement trending companies carousel
- [ ] T4.3: Implement fastest growing companies grid
- [ ] T4.4: Implement emerging startups section
- [ ] T4.5: Implement browse by category grid
- [ ] T4.6: Implement AI Unicorns section
- [ ] T4.7: Implement Frontier Labs section

### Phase 5: Page 2 - Company Detail
- [ ] T5.1: Create company detail page layout
- [ ] T5.2: Implement company header with stats
- [ ] T5.3: Implement timeline of milestones
- [ ] T5.4: Implement funding rounds table
- [ ] T5.5: Implement ownership donut chart
- [ ] T5.6: Implement investors by stage section
- [ ] T5.7: Implement founders & leadership grid
- [ ] T5.8: Implement products grid
- [ ] T5.9: Implement competitor landscape
- [ ] T5.10: Implement company news feed
- [ ] T5.11: Implement similar companies section

### Phase 6: Page 3 - Investors Discovery
- [ ] T6.1: Create investors discovery page layout
- [ ] T6.2: Implement hero with search
- [ ] T6.3: Implement trending investors carousel
- [ ] T6.4: Implement investor collections by type
- [ ] T6.5: Implement browse by investor type
- [ ] T6.6: Implement most active investors grid
- [ ] T6.7: Implement capital themes grid

### Phase 7: Page 4 - Investor Profile
- [ ] T7.1: Create investor profile page layout
- [ ] T7.2: Implement investor header with stats
- [ ] T7.3: Implement investment thesis section
- [ ] T7.4: Implement portfolio concentration donut chart
- [ ] T7.5: Implement recent investments carousel
- [ ] T7.6: Implement investment velocity table
- [ ] T7.7: Implement co-investor network
- [ ] T7.8: Implement follow-on strength stats
- [ ] T7.9: Implement related investors section

### Phase 8: Page 5 - AI Products
- [ ] T8.1: Create products page layout
- [ ] T8.2: Implement category tabs navigation
- [ ] T8.3: Implement popular products section
- [ ] T8.4: Implement most liked products list
- [ ] T8.5: Implement product of the day sidebar

### Phase 9: Polish & Testing
- [ ] T9.1: Implement all Framer Motion animations
- [ ] T9.2: Add loading states and error handling
- [ ] T9.3: Optimize images and implement lazy loading
- [ ] T9.4: Test all API endpoints
- [ ] T9.5: Test responsive design on mobile/tablet/desktop
- [ ] T9.6: Run Lighthouse audit and optimize performance
- [ ] T9.7: Create .env.example file and update README

## Notes

### Tradeoffs & Limitations
- No live OAuth flows (API key based for writes)
- Mock data for ecosystem graph (no live scraping)
- In-memory cache resets on server restart (would use Redis in production)
- No real-time updates (Supabase subscriptions stubbed)
- Search is Supabase full-text, not Elasticsearch

### Future Enhancements (Post-MVP)
1. Real-time scraping pipeline with Playwright + Supabase Edge Functions
2. Redis caching layer
3. Elasticsearch for fuzzy cross-entity search
4. GitHub OAuth + saved companies/investors
5. GraphQL API layer
6. WebSocket-based live funding notifications
7. AI-powered company similarity using embeddings
